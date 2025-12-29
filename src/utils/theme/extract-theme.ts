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
  const result: csstree.List<csstree.CssNode> = new csstree.List();

  if (!atRuleBlockChildren) return result;

  for (const rule of atRuleBlockChildren) {
    if (rule.type !== "Rule" || rule.prelude.type !== "SelectorList") {
      continue;
    }

    const newSelectors: csstree.List<csstree.CssNode> = new csstree.List();

    for (const selectorNode of rule.prelude.children) {
      if (selectorNode.type !== "Selector") {
        continue;
      }

      const children = selectorNode.children.toArray();
      const first = children[0];
      const second = children[1];

      const startsWithThemePrelude =
        first?.type === "ClassSelector" &&
        themeProperties.some((p) => p === first.name) &&
        second?.type === "Combinator";

      if (!startsWithThemePrelude) {
        newSelectors.push(selectorNode);
        continue;
      }

      // Strip: [ClassSelector(".modern"), Combinator(" "), ...rest] => [...rest]
      if (children.length <= 2) {
        // Would become an empty selector; drop it entirely.
        continue;
      }

      selectorNode.children = new csstree.List();
      for (let i = 2; i < children.length; i++) {
        selectorNode.children.push(children[i]);
      }

      newSelectors.push(selectorNode);
    }

    // If all selectors were removed, drop the entire rule
    if (newSelectors.isEmpty) {
      continue;
    }

    rule.prelude.children = newSelectors;
    result.push(rule);
  }

  return result;
}

export function mergeAtRuleAppliedThemeClassesIntoGenericClasses(
  atRuleBlockChildren: csstree.List<csstree.CssNode>,
  themeProperties: string[],
): csstree.List<csstree.CssNode> {
  void themeProperties;
  return atRuleBlockChildren;
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
