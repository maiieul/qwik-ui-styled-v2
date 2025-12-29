// To understand the AST, use https://astexplorer.net/

import { describe, it, expect } from "vitest";
import {
  generatePrettifiedCSS,
  mergeDuplicates,
  onlyKeepAppliedThemeClasses,
  // outputThemedCSS,
  removeThemePreludes,
} from "./extract-theme";
import * as csstree from "css-tree";

const theme = "modern" as const;

const cssFiles = {
  basic: `
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
    color: yellow;
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
  "nested-selectors": `
@reference "../../../global.css";
@import "./shared.css";

@layer components {
  .btn {
    color: red;
    background-color: blue;
    &:focus-visible {
      outline: 2px solid red;
    }
    &:active {
      transform: translate(2px, 2px);
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
    &:active {
      transform: translate(-2px, -2px);
    }
  }
}
`,
  "dark-variants": `
@reference "../../../global.css";
@import "./shared.css";

@layer components {
  .btn {
    color: red;
  }
  .qwik .btn {
    color: green;
  }
  .dark.qwik .btn {
    color: blue;
  }
  .qwik.dark .btn {
    color: orange;
  }
  .modern .btn {
    color: yellow;
  }
  .modern.dark .btn {
    color: pink;
  }
  .dark.modern .btn {
    color: purple;
  }
}
`,
} as const;

describe.skip("outputThemedCSS", () => {
  // it.each(Object.entries(cssFiles))(
  //   "should throw an error if multiple @layer declarations are found (case %#)",
  //   (_name, css) => {
  //     expect(() => outputThemedCSS(css, "modern")).toThrow(
  //       "Multiple @layer declarations found",
  //     );
  //   },
  // );
});

describe("onlyKeepAppliedThemeClasses", () => {
  it.each(Object.entries(cssFiles))(
    "should keep all generic rules that do not have a theme specific class name in the prelude (e.g. .btn { ... }) (case %s)",
    async (_name, css) => {
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

  it.each(Object.entries(cssFiles))(
    "should keep all rules that match the applied theme (e.g. .modern .btn { ... }) (case %s)",
    async (_name, css) => {
      const result = await generateUpToOnlyKeepAppliedThemeClasses(css, [
        "modern",
      ]);

      const modernThemeButtonRule = `
  .modern .btn {
`;
      expect(result).toContain(modernThemeButtonRule);
    },
  );

  it.each(Object.entries(cssFiles))(
    "should not keep any rules containing a theme class that isn't applied (e.g. .qwik .btn { ... }) (case %s)",
    async (_name, css) => {
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
  it.each(Object.entries(cssFiles))(
    "should remove the theme preludes from the at layer rule blocks (case %s)",
    async (_name, css) => {
      const result = await generateUpToRemoveThemePreludes(css, [theme]);
      expect(result).not.toContain(".modern");
      expect(result).toContain(".btn");
    },
  );
});

describe("mergeDuplicates", () => {
  const findDuplicateLayerRulePreludes = (ast: csstree.StyleSheet) => {
    const duplicates: string[] = [];

    csstree.walk(ast, {
      visit: "Atrule",
      enter(atRule) {
        if (atRule.name !== "layer" || !atRule.block) return;

        const counts = new Map<string, number>();

        atRule.block.children?.forEach((child) => {
          if (child.type !== "Rule" || child.prelude.type !== "SelectorList")
            return;
          const prelude = csstree.generate(child.prelude).trim(); // e.g. ".btn"
          counts.set(prelude, (counts.get(prelude) ?? 0) + 1);
        });

        for (const [prelude, count] of counts) {
          if (count > 1) duplicates.push(`${prelude} (x${count})`);
        }
      },
    });

    return duplicates;
  };

  it.each(Object.entries(cssFiles))(
    "should remove duplicate selectors inside @layer blocks (case %s)",
    async (_name, css) => {
      // Before merge: duplicates should exist (otherwise the test is vacuous)
      let ast = withOnlyKeepAppliedThemeClasses(css, [theme]);
      ast = withRemoveThemePreludes(ast, [theme]);
      expect(findDuplicateLayerRulePreludes(ast).length).toBeGreaterThan(0);

      // After merge: no duplicates
      ast = withMergeDuplicates(ast, [theme]);

      expect(findDuplicateLayerRulePreludes(ast)).toEqual([]);
    },
  );
  it("should output the correct CSS without duplicates", async () => {
    const cssOutput0 = await generateUpToMergeDuplicates(cssFiles["basic"], [
      theme,
    ]);
    expect(cssOutput0).toContain(`
  .btn {
    color: green;
  }
`);
    const cssOutput1 = await generateUpToMergeDuplicates(
      cssFiles["nested-selectors"],
      [theme],
    );
    console.log("cssOutput1", cssOutput1);
    expect(cssOutput1).toContain(`
  .btn {
    color: green;
    background-color: blue;
    border: 1px solid red;
    &:focus-visible {
      outline: 2px solid red;
    }
    &:active {
      transform: translate(-2px, -2px);
    }
    &:hover {
      transform: scale(0.99);
    }
  }
`);
    const cssOutput2 = await generateUpToMergeDuplicates(
      cssFiles["dark-variants"],
      [theme],
    );
    expect(cssOutput2).toContain(`
  .btn {
    color: yellow;
  }
  .dark .btn {
    color: purple;
  }
`);
  });
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
