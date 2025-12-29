// To understand the AST, use https://astexplorer.net/

import { describe, it, expect } from "vitest";
import { cssFiles, theme } from "./constants";
import { generateUpToRemoveThemePreludes, normalize } from "./helpers";

describe("step2 - removeThemePreludes (snapshots)", () => {
  it.each(Object.entries(cssFiles))("case %s", async (name, css) => {
    const result = await generateUpToRemoveThemePreludes(css, [theme]);
    expect(normalize(result)).toMatchSnapshot(name);
  });
});
