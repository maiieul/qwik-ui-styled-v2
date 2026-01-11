// To understand the AST, use https://astexplorer.net/

import { describe, it, expect } from "vitest";
import { cssFiles, theme } from "./fixtures/simple-cases";
import { generateUpToMergeDuplicates, normalize } from "./test-helpers";
import { globalCSS } from "./fixtures/global.css";
import { buttonCSS } from "./fixtures/button.css";

describe("step3 - mergeDuplicates (snapshots)", () => {
  it.each(Object.entries({ ...cssFiles, ...globalCSS, ...buttonCSS }))(
    "case %s",
    async (name, css) => {
      const result = await generateUpToMergeDuplicates(css, [theme]);
      expect(normalize(result)).toMatchSnapshot(name);
    },
  );
});
