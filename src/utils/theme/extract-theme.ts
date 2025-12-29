import * as csstree from "css-tree";
import * as prettier from "prettier";

export async function outputThemedCSS(
  cssInput: string,
  theme: string,
): Promise<string> {
  const themeProperties = theme
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const ast = csstree.parse(cssInput) as csstree.StyleSheet;

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

    const shouldKeep = rule.prelude.children.some((selector) => {
      if (selector.type !== "Selector") return false;

      const hasCombinator = selector.children.some(
        (n) => n.type === "Combinator",
      );

      if (!hasCombinator) return true;

      const hasThemeClass = selector.children.some(
        (n) =>
          n.type === "ClassSelector" &&
          themeProperties.some((p) => p === n.name),
      );

      return hasThemeClass;
    });

    if (shouldKeep) filtered.push(rule);
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
        selectorNode.children = selectorsWithoutThemeClasses;
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

  type MergeState = {
    rule: csstree.Rule;
    declarationOrder: string[];
    lastDeclarationByProperty: Map<string, csstree.Declaration>;
    otherChildren: csstree.CssNode[];
  };

  const merged: csstree.List<csstree.CssNode> = new csstree.List();
  const stateByPrelude = new Map<string, MergeState>();

  if (!atRuleBlockChildren) return merged;

  for (const child of atRuleBlockChildren) {
    if (child.type !== "Rule" || child.prelude.type !== "SelectorList") {
      continue;
    }

    const prelude = csstree.generate(child.prelude).trim();
    let state = stateByPrelude.get(prelude);

    if (!state) {
      state = {
        rule: child,
        declarationOrder: [],
        lastDeclarationByProperty: new Map(),
        otherChildren: [],
      };
      stateByPrelude.set(prelude, state);
      merged.push(child);
    }

    child.block.children?.forEach((n) => {
      if (n.type === "Declaration") {
        const property = n.property;
        if (!state.lastDeclarationByProperty.has(property)) {
          state.declarationOrder.push(property);
        }
        state.lastDeclarationByProperty.set(property, n);
        return;
      }

      state.otherChildren.push(n);
    });
  }

  for (const state of stateByPrelude.values()) {
    const newChildren = new csstree.List<csstree.CssNode>();

    for (const property of state.declarationOrder) {
      const decl = state.lastDeclarationByProperty.get(property);
      if (decl) newChildren.push(decl);
    }

    for (const other of state.otherChildren) {
      newChildren.push(other);
    }

    state.rule.block.children = newChildren;
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
