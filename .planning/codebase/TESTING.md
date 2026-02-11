# Testing Patterns

**Analysis Date:** 2026-02-11

## Test Framework

**Runner:**
- Vitest (latest version in project)
- Config: `vitest.config.ts`
- Supports two test environments: Node (unit tests) and Playwright (browser tests)

**Assertion Library:**
- Vitest built-in assertions (`expect`, `expect.element` for browser tests)
- No additional assertion library needed

**Run Commands:**
```bash
pnpm test              # Run all tests (unit + browser)
pnpm test.coverage     # Run with Istanbul coverage
pnpm test.ui           # Vitest UI mode
pnpm vitest run src/utils/extract-themed-css/tests/extract-themed-css.unit.ts  # Single test file
```

## Test File Organization

**Location:**
- Unit tests co-located in `tests/` subdirectory: `src/utils/extract-themed-css/tests/`
- Browser/component tests co-located with component: `src/components/ui/input/input.browser.tsx`

**Naming:**
- Unit tests: `*.unit.ts` (e.g., `extract-themed-css.unit.ts`)
- Browser/component tests: `*.browser.tsx` or `*.browser.ts` (e.g., `input.browser.tsx`)

**Structure:**
```
src/utils/extract-themed-css/
├── extract-themed-css.ts
├── step1-only-keep-applied-theme-classes.ts
├── step2-remove-theme-preludes.ts
├── step3-merge-duplicates.ts
└── tests/
    ├── extract-themed-css.unit.ts
    ├── step1-only-keep-applied-theme-classes.unit.ts
    ├── step2-remove-theme-preludes.unit.ts
    ├── step3-merge-duplicates.unit.ts
    ├── fixtures/
    │   ├── button.css.ts
    │   ├── global.css.ts
    │   └── simple-cases.ts
    └── test-helpers.ts

src/components/ui/input/
├── input.tsx
├── input.css
└── input.browser.tsx
```

## Test Structure

**Suite Organization:**
```typescript
// Unit test pattern from src/utils/extract-themed-css/tests/extract-themed-css.unit.ts
import { describe, it, expect } from "vitest";
import { extractThemedCSS } from "../extract-themed-css";

describe("extractThemedCSS - error cases", () => {
  it("should throw if any declaration uses !important", async () => {
    const css = `@layer components { .btn { color: red !important; } }`;
    await expect(extractThemedCSS(css, "modern")).rejects.toThrow(
      "!important is not allowed in base components",
    );
  });
});
```

```typescript
// Browser test pattern from src/components/ui/input/input.browser.tsx
import { component$, useSignal } from "@qwik.dev/core";
import { expect, describe, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-qwik";
import { Input } from "./input";

const inputEl = (dataTestId: string) => page.getByTestId(`input_${dataTestId}`);

describe("Input", () => {
  describe("standalone", () => {
    it("should be visible", async () => {
      render(<Basic />);
      await expect.element(inputEl("basic")).toBeVisible();
    });
  });
});
```

**Patterns:**
- Setup: Test components created inline using `component$()` or imported directly
- Teardown: Vitest handles cleanup automatically; no manual teardown needed
- Assertion: Browser tests use `expect.element(el).toMatcher()` syntax
- Scoping: Tests grouped by feature using nested `describe()` blocks

## Mocking

**Framework:**
- Built-in Vitest mocking via `vi.mock()`, `vi.fn()`
- No additional mocking library in use

**Patterns:**
- Not widely used in this codebase
- Browser tests don't mock; they render real components
- Unit tests mock only when necessary (e.g., CSS parsing with complex dependencies)

**What to Mock:**
- External APIs if testing in isolation
- Time-dependent code (if needed)

**What NOT to Mock:**
- Component rendering (use real components in browser tests)
- CSS parsing (use real fixtures and test end-to-end)
- Qwik internals (trust the framework)

## Fixtures and Factories

**Test Data:**
```typescript
// Fixture pattern from src/utils/extract-themed-css/tests/fixtures/global.css.ts
export const globalCSS = {
  "global.css with theme layers": `
@layer theme {
  .modern .btn {
    color: var(--primary);
  }
}
...
`,
};

// Simple cases fixture from src/utils/extract-themed-css/tests/fixtures/simple-cases.ts
export const cssFiles = {
  "simple: basic component": `
@layer components {
  .btn { color: red; }
  .modern .btn { color: blue; }
}
`,
  // ... more cases
};

// Test helper function pattern
export const generateUpToOnlyKeepAppliedThemeClasses = async (
  cssString: string,
  themeProperties: string[],
): Promise<string> => {
  const ast = withOnlyKeepAppliedThemeClasses(cssString, themeProperties);
  return await generatePrettifiedCSS(ast);
};
```

**Location:**
- Fixtures: `src/utils/extract-themed-css/tests/fixtures/`
- Test helpers: `src/utils/extract-themed-css/tests/test-helpers.ts`
- Each major utility has its own `tests/` subdirectory

## Coverage

**Requirements:** 80% patch coverage (enforced by Codecov)

**View Coverage:**
```bash
pnpm test.coverage
# Generates: coverage/index.html (view in browser)
# Reports: text, json-summary, lcov, html
```

**Coverage Configuration** (from `vitest.config.ts`):
- Provider: Istanbul
- Includes: `src/**/*.{ts,tsx}`
- Excludes: Routes, CSS, type definitions, test setup, entry points, generated files

## Test Types

**Unit Tests:**
- Environment: Node (no DOM)
- Scope: Pure functions, utilities, logic validation
- Examples: CSS AST processing, string transformations
- Pattern: `*.unit.ts` files
- No component rendering

**Browser/Component Tests:**
- Environment: Playwright (Chromium only)
- Scope: Component behavior, user interactions, DOM rendering
- Examples: Input field interaction, button clicks
- Pattern: `*.browser.tsx` or `*.browser.ts` files
- Uses `vitest-browser-qwik` for Qwik-specific testing
- Configuration (from `vitest.config.ts`):
  - File parallelism: disabled (serial execution)
  - Test timeout: 2 seconds
  - Setup files: `src/test-setup.ts`
  - Instances: Chromium only

**E2E Tests:**
- Not used in this codebase
- Component tests cover end-to-end behavior within browser context

## Common Patterns

**Async Testing:**
```typescript
// Pattern for async functions in unit tests
it("should throw if any declaration uses !important", async () => {
  const css = `@layer components { .btn { color: red !important; } }`;
  await expect(extractThemedCSS(css, "modern")).rejects.toThrow(
    "!important is not allowed in base components",
  );
});

// Pattern for browser tests with async interactions
it("should be filled when typed", async () => {
  render(<Basic />);
  const el = inputEl("basic");
  await el.fill("test");  // Async Playwright action
  await expect.element(el).toHaveValue("test");
});
```

**Error Testing:**
```typescript
// Thrown error testing
it("should throw descriptive error", async () => {
  await expect(extractThemedCSS(invalidCss, theme)).rejects.toThrow(
    "expected error message",
  );
});

// Error message assertions
it("should provide helpful context in error", async () => {
  const error = await extractThemedCSS(invalidCss, theme).catch(e => e);
  expect(error.message).toContain("theme class");
});
```

**Snapshot Testing:**
```typescript
// Pattern from src/utils/extract-themed-css/tests/step1-only-keep-applied-theme-classes.unit.ts
describe("step1 - onlyKeepAppliedThemeClasses (snapshots)", () => {
  it.each(Object.entries({ ...cssFiles, ...globalCSS, ...buttonCSS }))(
    "case: %s",
    async (name, css) => {
      const result = await generateUpToOnlyKeepAppliedThemeClasses(css, [
        "modern",
      ]);
      expect(normalize(result)).toMatchSnapshot("modern");
    },
  );
});
```

**Component Testing:**
```typescript
// Pattern for testing Qwik components
const WithBindValue = component$(() => {
  const valueSig = useSignal("test value");
  return <Input data-testid="bind" bind:value={valueSig} />;
});

describe("Input", () => {
  it("should render with a default value", async () => {
    render(<WithBindValue />);
    await expect.element(inputEl("bind")).toHaveValue("test value");
  });
});
```

---

*Testing analysis: 2026-02-11*
