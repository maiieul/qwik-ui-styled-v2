import { describe, it, expect } from "vitest";
import * as csstree from "css-tree";

import {
  removeGlobalCssUndefinedTokens,
  replaceNewLineMarkers,
} from "../global-css-post-processing";
import { generatePrettifiedCSS } from "../extract-themed-css";
import { normalize } from "./test-helpers";

const applyRemoveUndefinedTokens = (cssString: string): csstree.StyleSheet => {
  const ast = csstree.parse(cssString) as csstree.StyleSheet;

  csstree.walk(ast, {
    visit: "Atrule",
    enter(atRule) {
      if (atRule.name !== "layer" || !atRule.block) return;
      atRule.block.children = removeGlobalCssUndefinedTokens(atRule.block.children);
    },
  });

  return ast;
};

const process = async (cssString: string): Promise<string> => {
  const ast = applyRemoveUndefinedTokens(cssString);
  return normalize(await generatePrettifiedCSS(ast));
};

describe("global-css-post-processing - removeGlobalCssUndefinedTokens", () => {
  it("should handle `x` values in both :root and .dark rules", async () => {
    const input = `
@layer theme {
  :root {
    --primary-background: var(--color-violet-55);
    --primary-foreground-accent: x;
    --secondary-background-accent: x;
  }
  .dark {
    --primary-background: var(--color-sky-60);
    --primary-background-accent: x;
    --secondary-foreground-accent: x;
  }
}`;

    const result = await process(input);
    expect(result).toBe(
      normalize(`
@layer theme {
  :root {
    --primary-background: var(--color-violet-55);
  }
  .dark {
    --primary-background: var(--color-sky-60);
  }
}`),
    );
  });

  it("should not remove declarations where `x` appears as part of a larger value", async () => {
    const input = `
@layer theme {
  :root {
    --shadow-xs: 3px 4px;
    --shadow-xl: 11px 12px;
  }
}`;

    const result = await process(input);
    expect(result).toBe(
      normalize(`
@layer theme {
  :root {
    --shadow-xs: 3px 4px;
    --shadow-xl: 11px 12px;
  }
}`),
    );
  });
});

describe("global-css-post-processing - replaceNewLineMarkers", () => {
  it("should replace `marker: new-line;` lines with blank lines", () => {
    const input = `@layer theme {
  :root {
    marker: new-line;
    --default-border-width: 1px;
    --shadow-xs: 3px 4px;
    marker: new-line;
    --background: white;
  }
}`;

    const result = replaceNewLineMarkers(input);
    expect(normalize(result)).toBe(
      normalize(`@layer theme {
  :root {

    --default-border-width: 1px;
    --shadow-xs: 3px 4px;

    --background: white;
  }
}`),
    );
  });
});
