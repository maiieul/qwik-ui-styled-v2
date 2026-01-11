import * as csstree from "css-tree";
import prettier from "prettier/standalone";
import postcssPlugin from "prettier/plugins/postcss";

import { allowedVariantClasses } from "./constants";
import { onlyKeepAppliedThemeClasses } from "./step1-only-keep-applied-theme-classes";
import { removeThemePreludes } from "./step2-remove-theme-preludes";
import { mergeDuplicates } from "./step3-merge-duplicates";

// Outputs the applied themed CSS so that it contains only the generic + themed rules, but no others.
export async function extractThemedCSS(
  cssInput: string,
  theme: string,
): Promise<string> {
  const themeProperties = getPureThemeProperties(theme);

  const ast = csstree.parse(cssInput) as csstree.StyleSheet;

  assertNoImportantDeclarations(ast);

  assertNoMultipleThemePropertiesInOneSelector(ast, themeProperties);
  assertNoDuplicateDeclarationsInTheSameRule(ast);

  csstree.walk(ast, {
    visit: "Atrule",
    enter(atRule) {
      if (atRule.name !== "layer" || !atRule.block) return;

      assertAtRuleLayerBlockOnlyContainsRules(atRule);

      const layerName = getLayerName(atRule);
      const isThemeLayer = layerName === "theme";
      const isComponentLayer = layerName?.startsWith("components");

      if (!isThemeLayer && !isComponentLayer) return;

      atRule.block.children = convertPureThemeRulesToRoot(
        atRule.block.children,
        themeProperties,
      );

      atRule.block.children = onlyKeepAppliedThemeClasses(
        atRule.block.children,
        themeProperties,
      );
      atRule.block.children = removeThemePreludes(
        atRule.block.children,
        themeProperties,
      );
      atRule.block.children = mergeDuplicates(atRule.block.children);
    },
  });

  return generatePrettifiedCSS(ast);
}

export function getPureThemeProperties(theme: string): string[] {
  const tokens = theme
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const pureThemeClasses = tokens.filter((t) => !allowedVariantClasses.has(t));

  if (pureThemeClasses.length === 0) {
    throw new Error(
      "Theme must contain at least one theme class (e.g. 'modern')",
    );
  }

  return pureThemeClasses;
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

export function getLayerName(atRule: csstree.Atrule): string | null {
  if (atRule.name !== "layer" || !atRule.prelude) return null;
  try {
    return csstree.generate(atRule.prelude).trim();
  } catch {
    return null;
  }
}

function convertSelectorToRoot(selector: csstree.Selector): void {
  const rootSelectorAst = csstree.parse(":root", {
    context: "selector",
  }) as csstree.Selector;
  selector.children = rootSelectorAst.children;
}

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
      const hasVariant = classNames.some((n) => allowedVariantClasses.has(n));
      if (hasVariant) continue;

      const allAreSelectedThemes = classNames.every((n) =>
        themeProperties.includes(n),
      );
      if (!allAreSelectedThemes) continue;

      convertSelectorToRoot(selector);
    }
  }

  return children;
}

export async function generatePrettifiedCSS(
  ast: csstree.StyleSheet,
): Promise<string> {
  const cssOutput = csstree.generate(ast);
  const formatted = await prettier.format(cssOutput, {
    parser: "css",
    plugins: [postcssPlugin],
  });
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
