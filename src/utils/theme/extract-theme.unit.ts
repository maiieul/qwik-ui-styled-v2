// To understand the AST, use https://astexplorer.net/

import { describe, it, expect } from "vitest";
import {
  generatePrettifiedCSS,
  mergeDuplicates,
  onlyKeepAppliedThemeClasses,
  outputThemedCSS,
  removeThemePreludes,
} from "./extract-theme";
import * as csstree from "css-tree";

const cssFiles = [
  `
@reference "../../../global.css";
@import "./shared.css";

@layer components {
  .btn {
    color: red;
  }
  .qwik .btn {
    color: blue;
  }
  .modern .btn {
    color: green;
  }
  .whatever .btn {
    color: red;
  }
  .whatever.modern .btn {
    color: green;
  }
  .whatever.qwik .btn {
    color: blue;
  }
  .whatever.modern.qwik .btn {
    color: green;
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
`,
  `
@reference "../../../global.css";
@import "./shared.css";

@layer components {
  .btn {
    color: red;
    background-color: blue;
    &:focus-visible {
      outline: 2px solid red;
    }
  }
  .qwik .btn {
    color: blue;
    &:hover {
      transform: translate(-2px, -2px);
    }
  }
  .modern .btn {
    color: green;
    border: 1px solid red;
    &:hover {
      transform: scale(0.99);
    }
  }
}
`,
  `
@reference "../../../global.css";
@import "./shared.css";

@layer components {
  .btn {
    color: red;
  }
  .qwik .btn {
    color: blue;
  }
  .dark.qwik .btn {
    color: green;
  }
  .qwik.dark .btn {
    color: blue;
  }
  .modern .btn {
    color: green;
  }
  .modern.dark .btn {
    color: green;
  }
  .dark.modern .btn {
    color: red;
  }
}
`,
];

describe("outputThemedCSS", () => {
  it.each(cssFiles)(
    "should throw an error if multiple @layer declarations are found (case %#)",
    (css) => {
      expect(() => outputThemedCSS("modern", css)).toThrow(
        "Multiple @layer declarations found",
      );
    },
  );
});

describe.only("onlyKeepAppliedThemeClasses", () => {
  it.each(cssFiles)(
    "should keep all generic rules that do not have a theme specific class name in the prelude (e.g. .btn { ... }) (case %s)",
    async (css) => {
      const result = await generateUpToOnlyKeepAppliedThemeClasses(css, [
        "modern",
      ]);

      const testRuleInAtLayerRule = `
@layer components {
  .btn {
`;
      expect(result).toContain(testRuleInAtLayerRule);
    },
  );

  it.each(cssFiles)(
    "should keep all rules that match the applied theme (e.g. .modern .btn { ... }) (case %s)",
    async (css) => {
      const result = await generateUpToOnlyKeepAppliedThemeClasses(css, [
        "modern",
      ]);

      const modernThemeButtonRule = `
  .modern .btn {
`;
      expect(result).toContain(modernThemeButtonRule);
    },
  );

  it.each(cssFiles)(
    "should not keep any rules containing a theme class that isn't applied (e.g. .qwik .btn { ... }) (case %s)",
    async (css) => {
      const result = await generateUpToOnlyKeepAppliedThemeClasses(css, [
        "modern",
      ]);

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
    },
  );
});

describe("removeThemePreludes", () => {
  it.each(cssFiles)(
    "should remove the theme preludes from the at layer rule blocks (case %s)",
    async (css) => {
      const result = await generateUpToRemoveThemePreludes(css, ["modern"]);
      console.log("result", result);
      expect(result).not.toContain(".modern");
      expect(result).toContain(".btn");
    },
  );
});

describe("mergeDuplicates", () => {
  it.each(cssFiles)(
    "should not contain any duplicate selectors (case %s)",
    async (css) => {
      const result = await generateUpToMergeDuplicates(css, ["modern"]);

      console.log("result", result);

      const duplicates = result
        .split("\n")
        .filter((line) => line.includes(".btn"));
      expect(duplicates).toHaveLength(0);
    },
  );
});

const generateUpToOnlyKeepAppliedThemeClasses = async (
  cssString: string,
  themeProperties: string[],
): Promise<string> => {
  const ast = withOnlyKeepAppliedThemeClasses(cssString, themeProperties);
  return await generatePrettifiedCSS(ast);
};

const generateUpToRemoveThemePreludes = async (
  cssString: string,
  themeProperties: string[],
): Promise<string> => {
  let ast = withOnlyKeepAppliedThemeClasses(cssString, themeProperties);
  ast = withRemoveThemePreludes(ast, themeProperties);
  return await generatePrettifiedCSS(ast);
};

const generateUpToMergeDuplicates = async (
  cssString: string,
  themeProperties: string[],
): Promise<string> => {
  let ast = withOnlyKeepAppliedThemeClasses(cssString, themeProperties);
  ast = withRemoveThemePreludes(ast, themeProperties);
  ast = withMergeDuplicates(ast, themeProperties);
  return await generatePrettifiedCSS(ast);
};

const withOnlyKeepAppliedThemeClasses = (
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

const withRemoveThemePreludes = (
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

const withMergeDuplicates = (
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
