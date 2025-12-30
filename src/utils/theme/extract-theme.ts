import * as csstree from "css-tree";
import * as prettier from "prettier";

// Outputs the applied themed CSS so that it contains only the generic + themed rules, but no others.
export async function outputAppliedThemeCSS(
  cssInput: string,
  theme: string,
): Promise<string> {
  const themeProperties = theme
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const ast = csstree.parse(cssInput) as csstree.StyleSheet;

  // We don't support !important anywhere in the input: it makes merging and
  // deterministic theming output ambiguous and is banned by convention.
  csstree.walk(ast, {
    visit: "Declaration",
    enter(decl) {
      if (decl.type !== "Declaration") return;
      if (decl.important) {
        throw new Error("!important is not allowed in base components");
      }
    },
  });

  csstree.walk(ast, {
    visit: "Atrule",
    enter(atRule) {
      if (atRule.name !== "layer" || !atRule.block) return;

      if (!atRule.block.children) {
        throw new Error("No children found in @layer block");
      }

      if (
        !atRule.block.children.toArray().every((child) => child.type === "Rule")
      ) {
        throw new Error(
          "Only selector rules (e.g. .btn { ... }) are allowed in @layer block",
        );
      }

      atRule.block.children = onlyKeepAppliedThemeClasses(
        atRule.block.children,
        themeProperties,
      );
    },
  });

  return generatePrettifiedCSS(ast);
}

export function onlyKeepAppliedThemeClasses(
  atRuleLayerRules: csstree.List<csstree.CssNode>,
  themeProperties: string[],
): csstree.List<csstree.CssNode> {
  const filtered: csstree.List<csstree.CssNode> = new csstree.List();

  if (!atRuleLayerRules) return filtered;

  for (const rule of atRuleLayerRules) {
    if (rule.type !== "Rule" || rule.prelude.type !== "SelectorList") {
      continue;
    }

    const newSelectors: csstree.List<csstree.CssNode> = new csstree.List();

    for (const selector of rule.prelude.children) {
      if (selector.type !== "Selector") continue;

      const hasCombinator = selector.children.some(
        (n) => n.type === "Combinator",
      );

      const hasThemeClass = selector.children.some(
        (n) =>
          n.type === "ClassSelector" &&
          themeProperties.some((p) => p === n.name),
      );

      // We only support theme selectors of the form ".theme .component".
      // Theme class without a combinator (e.g. ".modern.btn") should not be used since the theme is set on the <html> element.
      if (!hasCombinator) {
        if (hasThemeClass) {
          throw new Error("Theme class without combinator is not allowed");
        }
        // Generic selector: keep as-is.
        newSelectors.push(selector);
        continue;
      }

      // Themed selector: keep only if it matches the applied theme.
      if (hasThemeClass) newSelectors.push(selector);
    }

    if (newSelectors.isEmpty) continue;

    rule.prelude.children = newSelectors;
    filtered.push(rule);
  }

  return filtered;
}

export function removeThemePreludes(
  atRuleBlockChildren: csstree.List<csstree.CssNode>,
  themeProperties: string[],
): csstree.List<csstree.CssNode> {
  const nonThemedRules: csstree.List<csstree.CssNode> = new csstree.List();

  if (!atRuleBlockChildren) return nonThemedRules;

  for (const rule of atRuleBlockChildren) {
    if (rule.type !== "Rule" || rule.prelude.type !== "SelectorList") {
      continue;
    }

    const newSelectors: csstree.List<csstree.CssNode> = new csstree.List();

    for (const selectorNode of rule.prelude.children) {
      if (selectorNode.type !== "Selector") continue;

      const containsThemeClass = selectorNode.children.some(
        (n) => n.type === "ClassSelector" && themeProperties.includes(n.name),
      );

      if (containsThemeClass) {
        // Remove matching theme class selectors from the leading compound in-place.
        const selectorsWithoutThemeClasses =
          new csstree.List<csstree.CssNode>();
        selectorNode.children.forEach((child) => {
          if (
            child.type === "ClassSelector" &&
            themeProperties.includes(child.name)
          ) {
            return;
          }
          selectorsWithoutThemeClasses.push(child);
        });
        // If we removed the leading theme class from a selector like ".modern .btn",
        // the selector can end up starting with a combinator (space). Strip it so
        // we don't produce invalid selectors like " .btn".
        const normalizedSelectorChildren = new csstree.List<csstree.CssNode>();
        let droppedLeadingCombinator = false;
        selectorsWithoutThemeClasses.forEach((child) => {
          if (!droppedLeadingCombinator && child.type === "Combinator") {
            droppedLeadingCombinator = true;
            return;
          }
          droppedLeadingCombinator = true;
          normalizedSelectorChildren.push(child);
        });

        selectorNode.children = normalizedSelectorChildren;
      }

      newSelectors.push(selectorNode);
    }

    rule.prelude.children = newSelectors;
    nonThemedRules.push(rule);
  }

  return nonThemedRules;
}

export function mergeDuplicates(
  atRuleBlockChildren: csstree.List<csstree.CssNode>,
  themeProperties: string[],
): csstree.List<csstree.CssNode> {
  void themeProperties;

  type RuleMergeState = {
    rule: csstree.Rule;
    declarationOrder: string[];
    lastDeclarationByProperty: Map<string, csstree.Declaration>;
    nestedRuleOrder: string[];
    nestedRuleByPrelude: Map<string, RuleMergeState>;
    otherChildren: csstree.CssNode[];
  };

  const createRuleState = (rule: csstree.Rule): RuleMergeState => ({
    rule,
    declarationOrder: [],
    lastDeclarationByProperty: new Map(),
    nestedRuleOrder: [],
    nestedRuleByPrelude: new Map(),
    otherChildren: [],
  });

  const mergeRuleChildrenIntoState = (
    state: RuleMergeState,
    sourceRule: csstree.Rule,
  ) => {
    sourceRule.block.children?.forEach((n) => {
      if (n.type === "Declaration") {
        const property = n.property;
        if (!state.lastDeclarationByProperty.has(property)) {
          state.declarationOrder.push(property);
        }
        state.lastDeclarationByProperty.set(property, n);
        return;
      }

      // Nested rules like "&:hover { ... }"
      if (n.type === "Rule" && n.prelude.type === "SelectorList") {
        const nestedPrelude = csstree.generate(n.prelude).trim();
        let nestedState = state.nestedRuleByPrelude.get(nestedPrelude);
        if (!nestedState) {
          nestedState = createRuleState(n);
          state.nestedRuleByPrelude.set(nestedPrelude, nestedState);
          state.nestedRuleOrder.push(nestedPrelude);
        }

        mergeRuleChildrenIntoState(nestedState, n);
        return;
      }

      state.otherChildren.push(n);
    });
  };

  const finalizeRuleState = (state: RuleMergeState) => {
    const newChildren = new csstree.List<csstree.CssNode>();

    // Declarations first (deduped by property, last one wins)
    for (const property of state.declarationOrder) {
      const decl = state.lastDeclarationByProperty.get(property);
      if (decl) newChildren.push(decl);
    }

    // Then nested rules (deduped by selector prelude, recursively finalized)
    for (const nestedPrelude of state.nestedRuleOrder) {
      const nestedState = state.nestedRuleByPrelude.get(nestedPrelude);
      if (!nestedState) continue;
      finalizeRuleState(nestedState);
      newChildren.push(nestedState.rule);
    }

    // Then any other children
    for (const other of state.otherChildren) {
      newChildren.push(other);
    }

    state.rule.block.children = newChildren;
  };

  const merged: csstree.List<csstree.CssNode> = new csstree.List();
  const stateByPrelude = new Map<string, RuleMergeState>();

  if (!atRuleBlockChildren) return merged;

  for (const child of atRuleBlockChildren) {
    if (child.type !== "Rule" || child.prelude.type !== "SelectorList") {
      continue;
    }

    const prelude = csstree.generate(child.prelude).trim();
    let state = stateByPrelude.get(prelude);

    if (!state) {
      state = createRuleState(child);
      stateByPrelude.set(prelude, state);
      merged.push(child);
    }

    mergeRuleChildrenIntoState(state, child);
  }

  for (const state of stateByPrelude.values()) finalizeRuleState(state);

  return merged;
}

export async function generatePrettifiedCSS(
  ast: csstree.StyleSheet,
): Promise<string> {
  const cssOutput = csstree.generate(ast);
  const formatted = await prettier.format(cssOutput, { parser: "css" });
  return addBlankLinesBeforeAtRules(formatted);
}

function addBlankLinesBeforeAtRules(css: string): string {
  const lines = css.split("\n");
  const result: string[] = [];
  let foundFirstLayer = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    const isLayer = trimmedLine.startsWith("@layer");
    if (isLayer && !foundFirstLayer) {
      foundFirstLayer = true;
      if (i > 0 && lines[i - 1].trim() !== "") result.push("");
      result.push(line);
      continue;
    }

    const isAtRule = trimmedLine.startsWith("@");
    if (
      isAtRule &&
      i > 0 &&
      lines[i - 1].trim() !== "" &&
      !lines[i - 1].trim().startsWith("@")
    ) {
      result.push("");
    }

    result.push(line);
  }

  return result.join("\n");
}
