// To understand the AST, use https://astexplorer.net/

import { describe, it, expect } from "vitest";
import { cssFiles } from "./fixtures/simple-cases";

import { normalize, withOnlyKeepAppliedThemeClasses } from "./test-helpers";
import { globalCSS } from "./fixtures/global.css";
import { buttonCSS } from "./fixtures/button.css";
import { generatePrettifiedCSS } from "../extract-themed-css";

describe("step1 - onlyKeepAppliedThemeClasses (snapshots)", () => {
  it.each(Object.entries({ ...cssFiles, ...globalCSS, ...buttonCSS }))(
    "case: %s",
    async (name, css) => {
      const result = await generateUpToOnlyKeepAppliedThemeClasses(css, [
        "modern",
      ]);
      expect(normalize(result)).toMatchSnapshot("modern");
      const result2 = await generateUpToOnlyKeepAppliedThemeClasses(css, [
        "qwik",
      ]);
      expect(normalize(result2)).toMatchSnapshot("qwik");
    },
  );
});

export const generateUpToOnlyKeepAppliedThemeClasses = async (
  cssString: string,
  themeProperties: string[],
): Promise<string> => {
  const ast = withOnlyKeepAppliedThemeClasses(cssString, themeProperties);
  return await generatePrettifiedCSS(ast);
};
