import * as csstree from "css-tree";
import {
  assertAtRuleLayerBlockOnlyContainsRules,
  assertNoDuplicateDeclarationsInTheSameRule,
  assertNoImportantDeclarations,
  assertNoMultipleThemePropertiesInOneSelector,
  convertPureThemeRulesToRoot,
  getLayerName,
  getPureThemeProperties,
} from "../extract-themed-css";
import { onlyKeepAppliedThemeClasses } from "../step1-only-keep-applied-theme-classes";
import { removeThemePreludes } from "../step2-remove-theme-preludes";
import { mergeDuplicates } from "../step3-merge-duplicates";

export const normalize = (s: string) =>
  s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();

export const validateCssForThemeSnapshots = (
  cssString: string,
  themeProperties: string[],
): csstree.StyleSheet => {
  // Allow passing variants in snapshot tests (e.g. ["dark", "modern"]) by stripping them.
  const pureThemeProperties = getPureThemeProperties(themeProperties.join(" "));
  const ast = csstree.parse(cssString) as csstree.StyleSheet;

  assertNoImportantDeclarations(ast);
  assertNoMultipleThemePropertiesInOneSelector(ast, pureThemeProperties);
  assertNoDuplicateDeclarationsInTheSameRule(ast);

  // Mirror the exported pipeline’s @layer constraints: inside @layer, only selector rules.
  csstree.walk(ast, {
    visit: "Atrule",
    enter(atRule) {
      if (atRule.name !== "layer" || !atRule.block) return;
      assertAtRuleLayerBlockOnlyContainsRules(atRule);
    },
  });

  return ast;
};

export const withOnlyKeepAppliedThemeClasses = (
  cssString: string,
  themeProperties: string[],
): csstree.StyleSheet => {
  const pureThemeProperties = getPureThemeProperties(themeProperties.join(" "));
  const ast = validateCssForThemeSnapshots(cssString, pureThemeProperties);

  // Find all @layer rule blocks
  csstree.walk(ast, {
    visit: "Atrule",
    enter(atRule) {
      if (atRule.name !== "layer" || !atRule.block) return;
      const layerName = getLayerName(atRule);
      if (layerName === "theme") {
        atRule.block.children = convertPureThemeRulesToRoot(
          atRule.block.children,
          pureThemeProperties,
        );
        atRule.block.children = onlyKeepAppliedThemeClasses(
          atRule.block.children,
          pureThemeProperties,
        );
        return;
      }

      atRule.block.children = onlyKeepAppliedThemeClasses(
        atRule.block.children,
        pureThemeProperties,
      );
    },
  });

  return ast;
};

export const withRemoveThemePreludes = (
  ast: csstree.StyleSheet,
  themeProperties: string[],
): csstree.StyleSheet => {
  csstree.walk(ast, {
    visit: "Atrule",
    enter(atRule) {
      if (atRule.name !== "layer" || !atRule.block) return;
      atRule.block.children = removeThemePreludes(
        atRule.block.children,
        themeProperties,
      );
    },
  });
  return ast;
};

export const withMergeDuplicates = (
  ast: csstree.StyleSheet,
): csstree.StyleSheet => {
  // Find all @layer rule blocks
  csstree.walk(ast, {
    visit: "Atrule",
    enter(atRule) {
      if (atRule.name !== "layer" || !atRule.block) return;
      atRule.block.children = mergeDuplicates(atRule.block.children);
    },
  });

  return ast;
};
