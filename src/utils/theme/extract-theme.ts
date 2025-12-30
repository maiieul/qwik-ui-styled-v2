import * as csstree from "css-tree";
import * as prettier from "prettier";

const allowedVariantClasses = new Set(["dark", "light"]);

export function assertNoVariantTokensInThemeProperties(
  themeProperties: string[],
): void {
  if (themeProperties.includes("dark") || themeProperties.includes("light")) {
    throw new Error('Theme properties cannot include "dark" or "light"');
  }
}

export function assertNoImportantDeclarations(ast: csstree.StyleSheet): void {
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
}

export function assertAtRuleLayerBlockOnlyContainsRules(
  atRule: csstree.Atrule,
): asserts atRule is csstree.Atrule & { block: csstree.Block } {
  if (atRule.name !== "layer" || !atRule.block) return;

  if (!atRule.block.children) {
    throw new Error("No children found in @layer block");
  }

  if (
    !atRule.block.children.toArray().every((child) => child.type === "Rule")
  ) {
    throw new Error(
      "Only selector rules (e.g. .btn { ... }) are allowed in @layer block. If you need to use media queries, nest them in the selector rules instead.",
    );
  }
}

export function assertNoMultipleThemePropertiesInOneSelector(
  ast: csstree.StyleSheet,
  themeProperties: string[],
): void {
  csstree.walk(ast, {
    visit: "Selector",
    enter(selector) {
      if (selector.type !== "Selector") return;

      let count = 0;
      selector.children.forEach((n) => {
        if (n.type !== "ClassSelector") return;
        if (allowedVariantClasses.has(n.name)) return;
        if (!themeProperties.includes(n.name)) return;

        count++;
      });

      if (count > 1) {
        throw new Error(
          "Multiple theme classes in one selector is not allowed (e.g. instead of `.modern.qwik .btn`, use `.modern .btn, .qwik .btn)`",
        );
      }
    },
  });
}

export function assertNoDuplicateDeclarationsInTheSameRule(
  ast: csstree.StyleSheet,
): void {
  csstree.walk(ast, {
    visit: "Rule",
    enter(rule) {
      if (rule.type !== "Rule") return;
      if (!rule.block?.children) return;

      const seen = new Set<string>();

      for (const child of rule.block.children) {
        if (child.type !== "Declaration") continue;

        const property = child.property;
        if (seen.has(property)) {
          throw new Error(
            `Components cannot contain duplicate declarations for the same selector property: "${property}".`,
          );
        }
        seen.add(property);
      }
    },
  });
}

// Outputs the applied themed CSS so that it contains only the generic + themed rules, but no others.
export async function outputAppliedThemeCSS(
  cssInput: string,
  theme: string,
): Promise<string> {
  const themeProperties = theme
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

  assertNoVariantTokensInThemeProperties(themeProperties);

  const ast = csstree.parse(cssInput) as csstree.StyleSheet;

  assertNoImportantDeclarations(ast);

  assertNoMultipleThemePropertiesInOneSelector(ast, themeProperties);
  assertNoDuplicateDeclarationsInTheSameRule(ast);

  csstree.walk(ast, {
    visit: "Atrule",
    enter(atRule) {
      if (atRule.name !== "layer" || !atRule.block) return;

      assertAtRuleLayerBlockOnlyContainsRules(atRule);

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
          throw new Error(
            "Theme class without combinator is not allowed (e.g. instead of `.modern.btn`, use `.modern .btn`)",
          );
        }
        // Generic selector: keep as-is.
        newSelectors.push(selector);
        continue;
      }

      // Themed selector: keep only if it matches the applied theme.
      if (hasThemeClass) {
        newSelectors.push(selector);
      }
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
        for (const child of selectorNode.children) {
          if (
            child.type === "ClassSelector" &&
            themeProperties.includes(child.name)
          ) {
            continue;
          }
          selectorsWithoutThemeClasses.push(child);
        }
        // If we removed the leading theme class from a selector like ".modern .btn",
        // the selector can end up starting with a combinator (space). Strip it so
        // we don't produce invalid selectors like " .btn".
        const normalizedSelectorChildren = new csstree.List<csstree.CssNode>();
        let droppedLeadingCombinator = false;
        for (const child of selectorsWithoutThemeClasses) {
          if (!droppedLeadingCombinator && child.type === "Combinator") {
            droppedLeadingCombinator = true;
            continue;
          }
          droppedLeadingCombinator = true;
          normalizedSelectorChildren.push(child);
        }

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

  type BlockMergeState = {
    declarationOrder: string[];
    lastDeclarationByProperty: Map<string, csstree.Declaration>;
    nestedRuleOrder: string[];
    nestedRuleByPrelude: Map<string, RuleMergeState>;
    nestedAtRuleOrder: string[];
    nestedAtRuleByKey: Map<string, AtRuleMergeState>;
    otherChildren: csstree.CssNode[];
  };

  type RuleMergeState = BlockMergeState & { rule: csstree.Rule };
  type AtRuleMergeState = BlockMergeState & { atRule: csstree.Atrule };

  const createBlockState = (): BlockMergeState => ({
    declarationOrder: [],
    lastDeclarationByProperty: new Map(),
    nestedRuleOrder: [],
    nestedRuleByPrelude: new Map(),
    nestedAtRuleOrder: [],
    nestedAtRuleByKey: new Map(),
    otherChildren: [],
  });

  const createRuleState = (rule: csstree.Rule): RuleMergeState => ({
    rule,
    ...createBlockState(),
  });

  const createAtRuleState = (atRule: csstree.Atrule): AtRuleMergeState => ({
    atRule,
    ...createBlockState(),
  });

  const atRuleKey = (atRule: csstree.Atrule): string => {
    const prelude =
      atRule.prelude && atRule.prelude.type !== "Raw"
        ? csstree.generate(atRule.prelude).trim()
        : atRule.prelude
          ? csstree.generate(atRule.prelude).trim()
          : "";
    return `${atRule.name} ${prelude}`.trim();
  };

  const mergeChildrenIntoState = (
    state: BlockMergeState,
    children?: csstree.List<csstree.CssNode>,
  ) => {
    if (!children) return;

    for (const n of children) {
      if (n.type === "Declaration") {
        const property = n.property;
        if (!state.lastDeclarationByProperty.has(property)) {
          state.declarationOrder.push(property);
        }
        state.lastDeclarationByProperty.set(property, n);
        continue;
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

        mergeChildrenIntoState(nestedState, n.block.children);
        continue;
      }

      // Nested at-rules like "@media (...) { ... }" inside a selector rule.
      if (n.type === "Atrule" && n.block) {
        const key = atRuleKey(n);
        let nestedAtRuleState = state.nestedAtRuleByKey.get(key);
        if (!nestedAtRuleState) {
          nestedAtRuleState = createAtRuleState(n);
          state.nestedAtRuleByKey.set(key, nestedAtRuleState);
          state.nestedAtRuleOrder.push(key);
        }

        mergeChildrenIntoState(nestedAtRuleState, n.block.children);
        continue;
      }

      state.otherChildren.push(n);
    }
  };

  const finalizeStateIntoChildren = (state: BlockMergeState) => {
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
      nestedState.rule.block.children = finalizeStateIntoChildren(nestedState);
      newChildren.push(nestedState.rule);
    }

    // Then nested at-rules (deduped by name+prelude, recursively finalized)
    for (const key of state.nestedAtRuleOrder) {
      const nestedAtRuleState = state.nestedAtRuleByKey.get(key);
      if (!nestedAtRuleState) continue;
      if (nestedAtRuleState.atRule.block) {
        nestedAtRuleState.atRule.block.children =
          finalizeStateIntoChildren(nestedAtRuleState);
      }
      newChildren.push(nestedAtRuleState.atRule);
    }

    // Then any other children
    for (const other of state.otherChildren) {
      newChildren.push(other);
    }

    return newChildren;
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

    mergeChildrenIntoState(state, child.block.children);
  }

  for (const state of stateByPrelude.values()) {
    state.rule.block.children = finalizeStateIntoChildren(state);
  }

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

    // Only treat top-level at-rules (no indentation) as at-rules for spacing.
    // Nested at-rules like "  @media { ... }" should not get extra blank lines.
    const isLayer = line.startsWith("@layer");
    if (isLayer && !foundFirstLayer) {
      foundFirstLayer = true;
      if (i > 0 && lines[i - 1].trim() !== "") result.push("");
      result.push(line);
      continue;
    }

    const isAtRule = line.startsWith("@");
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
