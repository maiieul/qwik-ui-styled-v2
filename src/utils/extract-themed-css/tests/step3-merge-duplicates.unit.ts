// To understand the AST, use https://astexplorer.net/

import { describe, it, expect } from "vitest";
import { cssFiles } from "./fixtures/simple-cases";

import {
  normalize,
  withMergeDuplicates,
  withOnlyKeepAppliedThemeClasses,
  withRemoveThemePreludes,
} from "./test-helpers";
import { globalCSS } from "./fixtures/global.css";
import { buttonCSS } from "./fixtures/button.css";
import { generatePrettifiedCSS } from "../extract-themed-css";

describe("step3 - mergeDuplicates (snapshots)", () => {
  it.each(Object.entries({ ...cssFiles, ...globalCSS, ...buttonCSS }))(
    "case: %s",
    async (name, css) => {
      const result = await generateUpToMergeDuplicates(css, ["modern"]);
      expect(normalize(result)).toMatchSnapshot("modern");
      const result2 = await generateUpToMergeDuplicates(css, ["qwik"]);
      expect(normalize(result2)).toMatchSnapshot("qwik");
    },
  );
});

export const generateUpToMergeDuplicates = async (
  cssString: string,
  themeProperties: string[],
): Promise<string> => {
  let ast = withOnlyKeepAppliedThemeClasses(cssString, themeProperties);
  ast = withRemoveThemePreludes(ast, themeProperties);
  ast = withMergeDuplicates(ast);
  return await generatePrettifiedCSS(ast);
};
