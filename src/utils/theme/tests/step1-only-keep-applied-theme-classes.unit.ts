// To understand the AST, use https://astexplorer.net/

import { describe, it, expect } from "vitest";
import { cssFiles, theme } from "./constants";
import { generateUpToOnlyKeepAppliedThemeClasses, normalize } from "./helpers";

describe("step1 - onlyKeepAppliedThemeClasses (snapshots)", () => {
  it.each(Object.entries(cssFiles))("case %s", async (name, css) => {
    const result = await generateUpToOnlyKeepAppliedThemeClasses(css, [theme]);
    expect(normalize(result)).toMatchSnapshot(name);
  });
});
