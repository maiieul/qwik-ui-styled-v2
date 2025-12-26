import * as csstree from "css-tree";
import * as prettier from "prettier";

export async function outputThemedCSS(
  cssInput: string,
  theme: string,
): Promise<string> {
  const themeProperties = theme.split(" ").map((property) => property.trim());

  const ast = csstree.parse(cssInput) as csstree.StyleSheet;

  const atLayerRuleBlocks = getAtLayerRuleBlocks(ast);
  for (const atLayerRuleBlock of atLayerRuleBlocks) {
    if (!atLayerRuleBlock.children) {
      throw new Error("No children found in @layer block");
    }

    if (
      !atLayerRuleBlock.children
        .toArray()
        .every((child) => child.type === "Rule")
    ) {
      throw new Error(
        "Only selector rules (e.g. .btn { ... }) are allowed in @layer block",
      );
    }
    atLayerRuleBlock.children = onlyKeepAppliedThemeClasses(
      atLayerRuleBlock.children,
      themeProperties,
    );
  }
  return await generatePrettifiedCSS(ast);
}

export function getAtLayerRuleBlocks(
  ast: csstree.StyleSheet,
): csstree.List<csstree.Block> {
  const atLayerRules: csstree.List<csstree.Block> = new csstree.List();
  for (const child of ast.children) {
    if (child.type === "Atrule" && child.name === "layer" && child.block) {
      atLayerRules.push(child.block);
    }
  }
  return atLayerRules;
}

export function onlyKeepAppliedThemeClasses(
  atRuleBlockChildren: csstree.List<csstree.CssNode>,
  themeProperties: string[],
): csstree.List<csstree.CssNode> {
  const filteredChildren: csstree.List<csstree.CssNode> = new csstree.List();

  // Only keep selector rules that include the theme class name in their prelude, or no theme specific class name.
  for (const child of atRuleBlockChildren) {
    if (child.type === "Rule" && child.prelude.type === "SelectorList") {
      // No theme specific class name in the prelude, keep the rule
      if (
        child.prelude.children.some(
          (selector) =>
            selector.type === "Selector" &&
            !selector.children.some((child) => child.type === "Combinator"),
        )
      ) {
        filteredChildren.push(child);
        // Applied theme class name in the prelude, keep the rule
      } else if (
        child.prelude.children.some(
          (selector) =>
            selector.type === "Selector" &&
            selector.children.some((child) => child.type === "Combinator") &&
            selector.children.some(
              (child) =>
                child.type === "ClassSelector" &&
                themeProperties.some((property) => child.name === property),
            ),
        )
      ) {
        filteredChildren.push(child);
      }
    }
  }
  return filteredChildren;
}

export async function generatePrettifiedCSS(
  ast: csstree.StyleSheet,
): Promise<string> {
  const cssOutput = csstree.generate(ast);
  const formatted = await prettier.format(cssOutput, {
    parser: "css",
  });
  return addBlankLinesBeforeAtRules(formatted);
}

/**
 * Adds blank lines before @-rules, with special handling:
 * - All rules before the first @layer are stacked together (no blank lines)
 * - A blank line is added before the first @layer
 * - After the first @layer, blank lines are added before @-rules
 * @param css - CSS string to process
 * @returns CSS string with blank lines added appropriately
 */
function addBlankLinesBeforeAtRules(css: string): string {
  const lines = css.split("\n");
  const result: string[] = [];
  let foundFirstLayer = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if this line is a @layer rule
    const isLayer = trimmedLine.startsWith("@layer");
    if (isLayer && !foundFirstLayer) {
      foundFirstLayer = true;
      // Add blank line before first @layer if previous line is not blank
      if (i > 0 && lines[i - 1].trim() !== "") {
        result.push("");
      }
      result.push(line);
      continue;
    }

    // Check if this line is an @-rule (starts with @)
    const isAtRule = trimmedLine.startsWith("@");

    if (isAtRule) {
      // After first @layer, add blank line before @-rules
      if (
        i > 0 &&
        lines[i - 1].trim() !== "" &&
        !lines[i - 1].trim().startsWith("@")
      ) {
        result.push("");
      }
    }

    result.push(line);
  }

  return result.join("\n");
}
