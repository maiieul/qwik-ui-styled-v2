import { describe, it, expect } from "vitest";
import { outputAppliedThemeCSS } from "../extract-theme";

describe("outputAppliedThemedCSS", () => {
  it("should throw if any declaration uses !important", async () => {
    const css = `
@layer components {
  .btn {
    color: red !important;
  }
}
`;

    await expect(outputAppliedThemeCSS(css, "modern")).rejects.toThrow(
      "!important is not allowed",
    );
  });

  it("should throw if a theme class is used without a combinator (e.g. .modern.btn)", async () => {
    const css = `
@layer components {
  .modern.btn {
    color: red;
  }
}
`;

    await expect(outputAppliedThemeCSS(css, "modern")).rejects.toThrow(
      "Theme class without combinator is not allowed",
    );
  });
});
