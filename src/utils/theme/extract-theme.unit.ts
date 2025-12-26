import { describe, it, expect } from "vitest";
import {
  generatePrettifiedCSS,
  getAtLayerRuleBlocks,
  onlyKeepAppliedThemeClasses,
  outputThemedCSS,
} from "./extract-theme";
import * as csstree from "css-tree";

const css = `
@reference "../../../global.css";
@import "./shared.css";

@layer components {
  .btn {
    color: red;
    background-color: blue;
  }
  .qwik .btn {
    color: blue;
  }
  .modern .btn {
    color: green;
    border: 1px solid red;
  }
}

@theme {
  --theme-var: var(--color-red);
}

@media (max-width: 768px) {
  .test {
    color: yellow;
  }
}

@layer components {
  .test {
    color: orange;
  }
  .callout-root {
    background-color: blue;
  }
  .qwik .callout-root {
    background-color: yellow;
  }
  .modern .callout-root {
    background-color: green;
  }
  .whatever .callout-root {
    background-color: red;
  }
}
`;

describe("outputThemedCSS", () => {
  it("should extract all @layer declarations", () => {
    expect(() => outputThemedCSS("modern", css)).toThrow(
      "Multiple @layer declarations found",
    );
  });
});

describe("onlyKeepAppliedThemeClasses", () => {
  it("should keep all generic rules that do not have a theme specific class name in the prelude (e.g. .btn { ... })", async () => {
    const result = await generateUpToOnlyKeepAppliedThemeClasses(css, "modern");

    const buttonRule = `
  .btn {
`;
    expect(result).toContain(buttonRule);

    const testRuleInAtMediaRule = `
@media (max-width: 768px) {
  .test {
`;
    expect(result).toContain(testRuleInAtMediaRule);

    const testRuleInAtLayerRule = `
@layer components {
  .test {
`;
    expect(result).toContain(testRuleInAtLayerRule);
  });
  it("should keep all rules that match the applied theme (e.g. .modern .btn { ... })", async () => {
    const result = await generateUpToOnlyKeepAppliedThemeClasses(css, "modern");

    const modernThemeButtonRule = `
  .modern .btn {
`;
    expect(result).toContain(modernThemeButtonRule);

    const modernThemeCalloutRule = `
  .modern .callout-root {
`;
    expect(result).toContain(modernThemeCalloutRule);
  });
  it("should not keep any rules containing a theme class that isn't applied (e.g. .qwik .btn { ... })", async () => {
    const result = await generateUpToOnlyKeepAppliedThemeClasses(css, "modern");

    const qwikThemeButtonRule = `
  .qwik .btn {
`;
    expect(result).not.toContain(qwikThemeButtonRule);

    const qwikThemeCalloutRule = `
  .qwik .callout-root {
`;
    expect(result).not.toContain(qwikThemeCalloutRule);

    const whateverThemeCalloutRule = `
  .whatever .callout-root {
`;
    expect(result).not.toContain(whateverThemeCalloutRule);
  });
});

const generateUpToOnlyKeepAppliedThemeClasses = async (
  cssString: string,
  theme: string,
): Promise<string> => {
  const ast = withOnlyKeepAppliedThemeClasses(cssString, theme);
  return await generatePrettifiedCSS(ast);
};

const withOnlyKeepAppliedThemeClasses = (
  cssString: string,
  theme: string,
): csstree.StyleSheet => {
  const themeProperties = theme.split(" ").map((property) => property.trim());

  const ast = csstree.parse(cssString) as csstree.StyleSheet;

  const atLayerRuleBlocks = getAtLayerRuleBlocks(ast);
  for (const atLayerRuleBlock of atLayerRuleBlocks) {
    atLayerRuleBlock.children = onlyKeepAppliedThemeClasses(
      atLayerRuleBlock.children,
      themeProperties,
    );
  }
  return ast;
};
