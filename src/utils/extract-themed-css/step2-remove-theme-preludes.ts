import * as csstree from "css-tree";

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
