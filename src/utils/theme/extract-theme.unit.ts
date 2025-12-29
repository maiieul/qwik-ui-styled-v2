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
  "comma-separated": `
@reference "../../../global.css";
@import "./shared.css";

@layer components {
  .btn,
  .icon-btn {
    color: red;
    padding: 8px;
  }
  .modern .btn,
  .modern .icon-btn {
    color: green;
  }
}
`,
} as const;

const normalize = (s: string) =>
  s
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();

describe.skip("outputThemedCSS", () => {
  // it.each([
  //   cssFiles["basic"],
  //   cssFiles["nested-selectors"],
  //   cssFiles["dark-variants"],
  // ])(
  //   "should throw an error if multiple @layer declarations are found",
  //   (css) => {
  //     expect(() => outputThemedCSS(css, "modern")).toThrow(
  //       "Multiple @layer declarations found",
  //     );
  //   },
  // );
});

describe("onlyKeepAppliedThemeClasses (snapshots)", () => {
  it.each(Object.entries(cssFiles))("case %s", async (name, css) => {
    const result = await generateUpToOnlyKeepAppliedThemeClasses(css, [theme]);
    expect(normalize(result)).toMatchSnapshot(name);
  });
});

describe("removeThemePreludes (snapshots)", () => {
  it.each(Object.entries(cssFiles))("case %s", async (name, css) => {
    const result = await generateUpToRemoveThemePreludes(css, [theme]);
    expect(normalize(result)).toMatchSnapshot(name);
  });
});

describe("mergeDuplicates (snapshots)", () => {
  it.each(Object.entries(cssFiles))("case %s", async (name, css) => {
    const result = await generateUpToMergeDuplicates(css, [theme]);
    expect(normalize(result)).toMatchSnapshot(name);
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
