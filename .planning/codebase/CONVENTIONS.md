# Coding Conventions

**Analysis Date:** 2026-02-11

## Naming Patterns

**Files:**
- Components: PascalCase (`Button.tsx`, `Input.tsx`, `Card.tsx`)
- Utilities: camelCase or kebab-case (`extract-themed-css.ts`, `constants.ts`)
- Tests: lowercase with test type suffix (`*.unit.ts`, `*.browser.tsx`)
- CSS files: kebab-case (`button.css`, `input.css`)

**Functions:**
- PascalCase for Qwik components: `const Button = component$(...)` in `src/components/ui/button/button.tsx`
- camelCase for regular functions: `getPureThemeProperties()`, `extractThemedCSS()` in `src/utils/extract-themed-css/extract-themed-css.ts`
- camelCase for hooks: `useTheme()`, `useStyles$()` (Qwik lifecycle)
- Functions prefixed with `assert` for validation/check functions: `assertNoImportantDeclarations()`, `assertNoMultipleThemePropertiesInOneSelector()` in `src/utils/extract-themed-css/extract-themed-css.ts`
- Functions prefixed with `is`, `get`, `extract`, or `remove` for specific behaviors

**Variables:**
- camelCase for all variables and constants
- UPPERCASE for constants exported as theme/config: `colorModes`, `styles` in `src/utils/constants.ts`
- Signal variables suffixed with `Sig`: `themeSig`, `valueSig` in `src/components/make-it-yours/make-it-yours.tsx`
- Private/internal functions prefixed with underscore if needed

**Types:**
- PascalCase for interfaces and type definitions: `InputProps`, `ButtonProps`, `ButtonVariants` in `src/components/ui/input/input.tsx`
- Suffix with `Props` for component prop types
- Suffix with `Config` for configuration types: `ThemeConfig` in `src/utils/extract-themed-css/types.ts`

## Code Style

**Formatting:**
- Tool: Prettier
- Plugins: `prettier-plugin-tailwindcss`, `prettier-plugin-css-order`
- Tailwind stylesheet reference: `./src/global.css`
- Line length: Default Prettier (80 chars)
- Quotes: Double quotes (Prettier default)
- Trailing comma: ES5 (Prettier default)
- Semicolons: Required (Prettier default)

**Linting:**
- Tool: ESLint 9 (flat config)
- Extends: `@eslint/js`, `typescript-eslint`, `eslint-plugin-qwik`
- Key rules in `eslint.config.js`:
  - `@typescript-eslint/no-explicit-any`: warn (not error)
  - `@typescript-eslint/no-empty-object-type`: warn (not error)
  - All Qwik recommended rules enabled
- Ignored files: `dist/`, `server/`, `build/`, `node_modules/`, `*.spec.*`, `vite.config.ts`

## Import Organization

**Order:**
1. External libraries (`@qwik.dev/core`, `@qds.dev/ui`, third-party packages)
2. Sibling imports from same package (`@qwik.dev/router`, router utilities)
3. Internal imports using path alias (`~/components/`, `~/utils/`, `~/hooks/`)
4. Relative imports (if any) for same-directory files

**Path Aliases:**
- `~/*` → `./src/*` (configured in `tsconfig.json`)
- Example from `src/components/make-it-yours/make-it-yours.tsx`:
  ```typescript
  import { Button, IconButton, Modal } from "~/components/ui";
  import { useTheme } from "~/hooks/use-theme/provider";
  import { extractThemedCSS } from "~/utils/extract-themed-css/extract-themed-css";
  ```

**CSS Imports:**
- Inline CSS for component styles: `import buttonStyles from "./button.css?inline"`
- Raw string imports for global CSS: `import globalCSS from "~/global.css?raw"`

## Error Handling

**Patterns:**
- Throw `Error` with descriptive message for validation failures: `throw new Error("!important is not allowed in base components")` in `src/utils/extract-themed-css/extract-themed-css.ts`
- Use try-catch only for operations that may silently fail (e.g., `getLayerName()` returns `null` on error)
- Errors should be developer-friendly, not user-facing (this is a library)
- Assertion functions use TypeScript asserts keyword: `export function assertAtRuleLayerBlockOnlyContainsRules(atRule: csstree.Atrule): asserts atRule is ...`

**Error Messages:**
- Be specific about what went wrong: `"Multiple theme classes in one selector is not allowed (e.g. instead of `.modern.qwik .btn`, use `.modern .btn, .qwik .btn)"`
- Include context or examples when helpful
- Use lowercase for clarity

## Logging

**Framework:** `console` (no centralized logger)

**Patterns:**
- Minimal logging in application code
- No production logging (this is a component library)
- Errors use `throw` instead of logging
- Browser tests use `console.log()` if debugging needed, but not in committed code

## Comments

**When to Comment:**
- Explain CSS patterns for accessibility: `/* Visually hide text while keeping it accessible */` in `src/utils/visually-hidden.tsx`
- Explain non-obvious algorithm choices in complex utilities
- Document design decisions in component `.md` files rather than inline comments
- Avoid over-commenting obvious code

**JSDoc/TSDoc:**
- Not used widely in this codebase (convention is underutilized)
- Types are self-documenting via TypeScript
- Complex functions could benefit from JSDoc but are not required

## Function Design

**Size:**
- Prefer small, focused functions
- Maximum ~50 lines for utility functions, ~100 lines for complex CSS processing functions
- Break down multi-step processes into named helper functions (e.g., `step1-only-keep-applied-theme-classes.ts`, `step2-remove-theme-preludes.ts`)

**Parameters:**
- Prefer destructuring in component props
- Single object parameter for multiple related values
- Use TypeScript types for all parameters

**Return Values:**
- Functions return typed values; no implicit `undefined` returns
- Async functions return `Promise<T>`
- Validation functions return `void` or `asserts` type guards
- Processing functions return transformed data structures

## Module Design

**Exports:**
- Named exports preferred: `export const Button = ...` or `export function getPureThemeProperties(...)`
- Index files (barrel exports) aggregate related exports: `src/components/ui/index.ts` exports all UI components
- Default exports used for Qwik route components only

**Barrel Files:**
- `src/components/ui/index.ts` exports all styled components
- Used for cleaner imports: `import { Button, Input } from "~/components/ui"`
- Not used for utilities (import directly from utility file)

**Component Composition Pattern:**
- Compound component pattern for complex components: `Card.Root`, `Card.Header`, `Card.Title` exported as object `{ Root, Header, Title }` in `src/components/ui/card/index.tsx`
- Wraps QDS headless components with styling via Tailwind classes and design tokens
- Each component file exports a single component

---

*Convention analysis: 2026-02-11*
