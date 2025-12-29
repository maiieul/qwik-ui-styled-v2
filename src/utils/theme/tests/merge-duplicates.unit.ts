// To understand the AST, use https://astexplorer.net/

import { describe, it, expect } from "vitest";
import { cssFiles, theme } from "./constants";
import { generateUpToMergeDuplicates, normalize } from "./helpers";

describe("mergeDuplicates (snapshots)", () => {
  it.each(Object.entries(cssFiles))("case %s", async (name, css) => {
    const result = await generateUpToMergeDuplicates(css, [theme]);
    expect(normalize(result)).toMatchSnapshot(name);
  });
});
