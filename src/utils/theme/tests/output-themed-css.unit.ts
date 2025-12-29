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
});
