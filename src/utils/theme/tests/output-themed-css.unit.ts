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
      "!important is not allowed in base components",
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

  it("should throw if multiple theme classes are used in one selector (e.g. .modern.qwik .btn)", async () => {
    const css = `
@layer components {
  .modern.qwik .btn {
    color: red;
  }
}
`;

    await expect(outputAppliedThemeCSS(css, "modern qwik")).rejects.toThrow(
      "Multiple theme classes in one selector is not allowed",
    );
  });

  it("should throw if @layer contains non-selector rules (e.g. @media)", async () => {
    const css = `
@layer components {
  @media (min-width: 1px) {
    .btn {
      color: red;
    }
  }
}
`;

    await expect(outputAppliedThemeCSS(css, "modern")).rejects.toThrow(
      "Only selector rules (e.g. .btn { ... }) are allowed in @layer block. If you need to use media queries, nest them in the selector rules instead.",
    );
  });

  it("should throw if a rule contains duplicate declarations for the same property", async () => {
    const css = `
@layer components {
  .btn {
    color: red;
    color: green;
  }
  .modern .btn {
    color: blue;
  }
}
`;

    await expect(outputAppliedThemeCSS(css, "modern")).rejects.toThrow(
      'Components cannot contain duplicate declarations for the same selector property: "color".',
    );
  });
});
