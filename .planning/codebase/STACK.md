# Technology Stack

**Analysis Date:** 2026-02-11

## Languages

**Primary:**
- TypeScript 5.9.3 - Application code, components, utilities, and type-safe development
- CSS (Tailwind + vanilla CSS) - Styling via Tailwind CSS v4 and custom CSS in `src/global.css`

**Secondary:**
- JavaScript (MDX) - Content pages in `src/routes/docs/` for component documentation

## Runtime

**Environment:**
- Node.js ≥22.0.0 (required for sharp compatibility with Node-API v9)

**Package Manager:**
- pnpm 10.24.0
- Lockfile: `pnpm-lock.yaml` (checked into version control)

## Frameworks

**Core:**
- Qwik v2.0.0-beta.21 (`@qwik.dev/core`) - Meta-framework for server-side rendering and resumability
- QwikRouter v2.0.0-beta.21 (`@qwik.dev/router`) - File-based routing system with MDX support

**Component Library (Headless):**
- QDS UI v0.8.5 (`@qds.dev/ui`) - Headless component primitives (button, modal, input, etc.)
- QDS Tools v0.8.5 (`@qds.dev/tools`) - Vite plugins: `asChild()` and `icons()`

**Styling:**
- Tailwind CSS v4.1.18 - Utility-first CSS framework
- @tailwindcss/vite v4.1.18 - Vite plugin for Tailwind CSS integration
- CSS Layers (in `src/global.css`) - Cascade control with layers: `theme`, `base`, `qds`, `qwik`, `components`, `components-2`, `utilities`

**Documentation & Syntax Highlighting:**
- Shiki v3.22.0 - Syntax highlighter for code blocks
- @shikijs/rehype v3.22.0 - Rehype plugin for Shiki
- @shikijs/transformers v3.22.0 - Shiki transformers for code examples

**Testing:**
- Vitest v4.0.18 - Unit and browser test runner
- @vitest/browser-playwright v4.0.18 - Vitest browser test provider using Playwright
- @vitest/coverage-istanbul v4.0.18 - Istanbul coverage provider
- @vitest/ui v4.0.18 - Vitest UI dashboard
- Playwright v1.58.2 - Browser automation for browser tests
- vitest-browser-qwik v0.1.0 - Qwik-specific testing utilities for Vitest browser mode

**Build & Dev:**
- Vite v7.3.1 - Build tool and dev server
- Rollup v4.57.1 - Module bundler (used by Vite)
- vite-tsconfig-paths v4.3.2 - Support for tsconfig path aliases in Vite

**Linting & Formatting:**
- ESLint 9.39.2 - JavaScript/TypeScript linter (flat config format)
- eslint-plugin-qwik 2.0.0-beta.21 - Qwik-specific linting rules
- typescript-eslint 8.55.0 - TypeScript support for ESLint
- @eslint/js 9.39.2 - ESLint recommended configuration
- Prettier 3.8.1 - Code formatter
- prettier-plugin-tailwindcss v0.7.2 - Tailwind class sorting plugin
- prettier-plugin-css-order v2.2.0 - CSS property ordering plugin

**CSS Utilities:**
- css-tree v3.1.0 - CSS parser and AST manipulation (used for theme extraction in `src/utils/extract-themed-css/`)
- @types/css-tree v2.3.11 - TypeScript types for css-tree

**UI Utilities:**
- @floating-ui/dom v1.7.5 - Floating UI positioning library (modal, dropdown positioning)
- @oddbird/popover-polyfill v0.6.1 - Polyfill for HTML popover API
- clipboard-copy v4.0.1 - Clipboard utilities for copy-to-clipboard functionality

**Icon & Asset Processing:**
- @iconify/utils v3.1.0 - Icon utility functions for Iconify icon system
- fflate v0.8.2 - Fast compression/decompression library (ZIP support)

**Type Definitions:**
- @types/node 25.2.3 - Node.js type definitions

**Dev Utilities:**
- @vitejs/plugin-basic-ssl v2.1.4 - HTTPS support for local development
- typescript-plugin-css-modules 5.2.0 - CSS modules type support
- globals 17.3.0 - Global variable definitions for ESLint
- stylelint-config-idiomatic-order v10.0.0 - CSS property ordering convention
- stylelint-config-prettier v9.0.5 - Prettier compatibility for stylelint

## Configuration

**Environment:**
- No `.env` file present - Configuration managed via `import.meta.env.BASE_URL` for manifest path
- No explicit environment variables required for local development

**Build:**
- `vite.config.ts` - Main Vite configuration
  - Plugins: `qwikVite()`, `qwikRouter()` (with MDX), `tsconfigPaths()`, `tailwindcss()`
  - MDX configuration: `remark-gfm`, `rehype-autolink-headings`, Shiki syntax highlighting (light: github-light, dark: poimandres)
  - Tailwind stylesheet reference: `src/global.css`
  - SSR external modules: `@qds.dev/ui`, excludes Qwik internal modules
- `vitest.config.ts` - Vitest configuration
  - Two test projects: `unit` (Node environment) and `dom` (Playwright/Chromium)
  - File patterns: `*.unit.ts` (unit), `*.browser.ts`/`*.browser.tsx` (DOM)
  - Test timeout: 2 seconds for browser tests
  - File parallelism disabled for browser tests
  - Setup file: `src/test-setup.ts`
  - Coverage: Istanbul provider with text, json-summary, lcov, and HTML reports
- `tsconfig.json` - TypeScript configuration
  - Target: ES2020, Module: ES2022
  - JSX: react-jsx with `@qwik.dev/core` as JSX import source
  - Path alias: `~/*` → `src/*`
  - Strict mode enabled
  - Plugins: `typescript-plugin-css-modules`
- `prettier.config.js` - Prettier configuration
  - Plugins: `prettier-plugin-tailwindcss`, `prettier-plugin-css-order`
  - Tailwind stylesheet reference: `src/global.css`
- `eslint.config.js` - ESLint configuration (flat config)
  - Extends: `@eslint/js`, `typescript-eslint`, `eslint-plugin-qwik`
  - Rules: `@typescript-eslint/no-explicit-any` (warn), `@typescript-eslint/no-empty-object-type` (warn)

## Platform Requirements

**Development:**
- Node.js ≥22.0.0 (for sharp Node-API v9 compatibility)
- pnpm 10.24.0
- Modern web browser for dev server (Vite supports all modern browsers)

**Production:**
- Node.js ≥22.0.0 (required by Qwik SSR)
- No server adapter configured - deployment target flexible via Qwik adapters (not yet selected)
- Browser: Modern browsers (supports ES2020+)

---

*Stack analysis: 2026-02-11*
