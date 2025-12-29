import {
  generatePrettifiedCSS,
  mergeDuplicates,
  onlyKeepAppliedThemeClasses,
  // outputThemedCSS,
  removeThemePreludes,
} from "../extract-theme";
import * as csstree from "css-tree";

export const normalize = (s: string) =>
  s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();

export const generateUpToOnlyKeepAppliedThemeClasses = async (
  cssString: string,
  themeProperties: string[],
): Promise<string> => {
  const ast = withOnlyKeepAppliedThemeClasses(cssString, themeProperties);
  return await generatePrettifiedCSS(ast);
};

export const generateUpToRemoveThemePreludes = async (
  cssString: string,
  themeProperties: string[],
): Promise<string> => {
  let ast = withOnlyKeepAppliedThemeClasses(cssString, themeProperties);
  ast = withRemoveThemePreludes(ast, themeProperties);
  return await generatePrettifiedCSS(ast);
};

export const generateUpToMergeDuplicates = async (
  cssString: string,
  themeProperties: string[],
): Promise<string> => {
  let ast = withOnlyKeepAppliedThemeClasses(cssString, themeProperties);
  ast = withRemoveThemePreludes(ast, themeProperties);
  ast = withMergeDuplicates(ast, themeProperties);
  return await generatePrettifiedCSS(ast);
};

export const withOnlyKeepAppliedThemeClasses = (
  cssString: string,
  themeProperties: string[],
): csstree.StyleSheet => {
  const ast = csstree.parse(cssString) as csstree.StyleSheet;

  // Find all @layer rule blocks
  csstree.walk(ast, {
    visit: "Atrule",
    enter(atRule) {
      if (atRule.name !== "layer" || !atRule.block) return;
      atRule.block.children = onlyKeepAppliedThemeClasses(
        atRule.block.children,
        themeProperties,
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
  themeProperties: string[],
): csstree.StyleSheet => {
  // Find all @layer rule blocks
  csstree.walk(ast, {
    visit: "Atrule",
    enter(atRule) {
      if (atRule.name !== "layer" || !atRule.block) return;
      atRule.block.children = mergeDuplicates(
        atRule.block.children,
        themeProperties,
      );
    },
  });

  return ast;
};
