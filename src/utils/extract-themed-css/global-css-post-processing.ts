import * as csstree from "css-tree";

// Removes declarations with placeholder value `x` that exist in global.css
// solely to reserve token ordering across themes. These placeholders ensure
// consistent declaration order during steps 1-3, and are stripped here after
// merging is complete.
export function removeGlobalCssUndefinedTokens(
  children: csstree.List<csstree.CssNode>,
): csstree.List<csstree.CssNode> {
  const result = new csstree.List<csstree.CssNode>();

  for (const child of children) {
    if (child.type !== "Rule" || !child.block?.children) {
      result.push(child);
      continue;
    }

    const filtered = new csstree.List<csstree.CssNode>();
    for (const node of child.block.children) {
      if (
        node.type === "Declaration" &&
        csstree.generate(node.value).trim() === "x"
      ) {
        continue;
      }
      filtered.push(node);
    }

    if (filtered.isEmpty) continue;

    child.block.children = filtered;
    result.push(child);
  }

  return result;
}

// Replaces `marker: new-line;` declarations in the prettified CSS string with
// blank lines. These markers are placed in global.css to visually separate
// groups of tokens (e.g. config/layout tokens from color tokens) in the output.
// mergeDuplicates treats marker declarations as positional (each gets a unique
// key) so multiple markers in the same rule are preserved in order.
export function replaceNewLineMarkers(css: string): string {
  return css.replace(/^[ \t]*marker: new-line;\n?/gm, "\n");
}
