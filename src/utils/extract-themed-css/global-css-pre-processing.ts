import * as csstree from "css-tree";

import { colorModes } from "../constants";

// Converts selectors that are purely theme classes (e.g. `.modern`, `.qwik`)
// to `:root`, since the output represents an already-applied theme from global.css.
// This must run before steps 1-3 so that these rules merge correctly with
// existing `:root` declarations.
export function convertPureThemeRulesToRoot(
  children: csstree.List<csstree.CssNode>,
  themeProperties: string[],
): csstree.List<csstree.CssNode> {
  for (const child of children) {
    if (child.type !== "Rule" || child.prelude.type !== "SelectorList")
      continue;

    for (const selector of child.prelude.children) {
      if (selector.type !== "Selector") continue;

      const hasCombinator = selector.children.some(
        (n) => n.type === "Combinator",
      );
      if (hasCombinator) continue;

      const classNames: string[] = [];
      for (const n of selector.children) {
        if (n.type === "ClassSelector") classNames.push(n.name);
      }

      if (classNames.length === 0) continue;

      // Convert selectors composed solely of the selected theme classes (no variants)
      // to :root, since we are outputting an already-applied theme.
      if (classNames.some((n) => colorModes.includes(n))) continue;

      const allAreSelectedThemes = classNames.every((n) =>
        themeProperties.includes(n),
      );
      if (!allAreSelectedThemes) continue;

      convertSelectorToRoot(selector);
    }
  }

  return children;
}

function convertSelectorToRoot(selector: csstree.Selector): void {
  const rootSelectorAst = csstree.parse(":root", {
    context: "selector",
  }) as csstree.Selector;
  selector.children = rootSelectorAst.children;
}
