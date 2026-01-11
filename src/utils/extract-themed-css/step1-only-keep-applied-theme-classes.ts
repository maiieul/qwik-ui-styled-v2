import * as csstree from "css-tree";
import { allowedVariantClasses, potentialThemes } from "./constants";

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

      if (!hasCombinator) {
        // For no-combinator selectors, filter out those that contain theme classes
        // (identified by being in the potentialThemes list) that are not in the applied theme.
        // Component classes (not in potentialThemes) are always kept.
        const classNames: string[] = [];
        for (const n of selector.children) {
          if (n.type === "ClassSelector") classNames.push(n.name);
        }

        // Check if any class name is a known theme class (not a variant) that's not applied
        const hasNonAppliedThemeClass = classNames.some(
          (className) =>
            !allowedVariantClasses.has(className) &&
            potentialThemes.has(className) &&
            !themeProperties.includes(className),
        );

        if (hasNonAppliedThemeClass) {
          // Filter out this selector as it contains a non-applied theme class
          continue;
        }

        // Keep: generic selectors (no classes), variant-only selectors, selectors with applied theme classes,
        // or component selectors (classes not in potentialThemes)
        newSelectors.push(selector);
        continue;
      }

      // Keep selectors that match the applied theme.
      if (hasThemeClass) {
        newSelectors.push(selector);
        continue;
      }

      // Keep selectors that are only variant-scoped (no theme classes) such as ".dark .btn".
      // We detect this by checking that the leading compound (before the first combinator)
      // contains only variant class selectors ("dark"/"light").
      let variantOnlyLeadingCompound = false;
      const leadingClassNames: string[] = [];
      for (const n of selector.children) {
        if (n.type === "Combinator") break;
        if (n.type === "ClassSelector") leadingClassNames.push(n.name);
      }

      if (leadingClassNames.length === 1) {
        variantOnlyLeadingCompound = allowedVariantClasses.has(
          leadingClassNames[0],
        );
      }

      if (variantOnlyLeadingCompound) {
        newSelectors.push(selector);
      }
    }

    if (newSelectors.isEmpty) continue;

    rule.prelude.children = newSelectors;
    filtered.push(rule);
  }

  return filtered;
}
