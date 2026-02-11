# Qwik UI Styled v2 — AI Agent Instructions

> Canonical instruction file for AI coding agents working on the Qwik UI Styled v2 project.

## Overview

Qwik UI Styled v2 is a **styled component library and documentation site** for Qwik v2. It provides copy-paste, reusable UI components built on top of [QDS](https://github.com/kunai-consulting/qwik-design-system) headless components (`@qds.dev/ui`), styled with Tailwind CSS v4 and a comprehensive design token system.

This is a **single Qwik application** (not a monorepo). Components are styled wrappers around headless QDS primitives with a multi-theme system.

## Setup

**Requirements:** Node ≥22.0.0, pnpm 10.24.0

```bash
pnpm install
```

## Key Commands

| Task                   | Command              | Notes                         |
| ---------------------- | -------------------- | ----------------------------- |
| **Install**            | `pnpm install`       |                               |
| **Dev server**         | `pnpm dev`           | Vite SSR mode                 |
| **Dev (debug)**        | `pnpm dev.debug`     | With Node inspector           |
| **Build**              | `pnpm build`         | Full Qwik build               |
| **Build client**       | `pnpm build.client`  | Vite client build             |
| **Build types**        | `pnpm build.types`   | `tsc --incremental --noEmit`  |
| **Preview**            | `pnpm preview`       | Build + preview               |
| **Run tests**          | `pnpm test`          | Vitest — unit + browser tests |
| **Test with coverage** | `pnpm test.coverage` | Istanbul coverage             |
| **Test UI**            | `pnpm test.ui`       | Vitest UI mode                |
| **Lint**               | `pnpm lint`          | ESLint on `src/**/*.ts*`      |
| **Format**             | `pnpm fmt`           | Prettier `--write`            |
| **Format check**       | `pnpm fmt.check`     | Prettier `--check`            |

### Running a Single Test File

```bash
# Unit test
pnpm vitest run src/utils/extract-themed-css/tests/extract-themed-css.unit.ts

# Browser/component test
pnpm vitest run src/components/ui/input/input.browser.tsx
```

## Architecture

### Project Structure

```
src/
├── components/
│   ├── ui/                # Styled components (the library)
│   │   ├── avatar/
│   │   ├── breadcrumb/
│   │   ├── button/
│   │   ├── callout/
│   │   ├── card/
│   │   ├── chip/
│   │   ├── field/
│   │   ├── input/
│   │   ├── modal/
│   │   ├── separator/
│   │   └── skeleton/
│   ├── mdx/               # MDX provider components
│   ├── header/            # Site header
│   ├── sidebar/           # Site sidebar
│   └── toc/               # Table of contents
├── routes/
│   ├── docs/              # Component documentation pages
│   └── index@landing.tsx  # Landing page
├── hooks/                 # Custom hooks
├── utils/                 # Utility functions
├── global.css             # Design token system (~650 lines)
└── entry.*.tsx            # Qwik entry points
```

### Relationship to QDS

This project **depends on** QDS headless components:

- `@qds.dev/ui` (v0.8.5) — headless component primitives
- `@qds.dev/tools` (v0.8.5) — Vite plugins (`asChild()`, `icons()`)

Styled components in `src/components/ui/` wrap QDS headless components with Tailwind CSS classes and design tokens.

### Make it Yours

The Make it Yours feature is core to Qwik UI. It is achieved using a client-side css-tree ast traversal to extract the applied make-it-yours theme classes.

### Theming System

The design token system lives in `src/global.css` and supports multiple themes:

- **Theme classes:** `.modern`, `.qwik` (applied to root element)
- **Dark mode:** Supported via CSS custom properties
- **Color tokens:** Purpose-based naming (`--background`, `--foreground`, `--border`, `--shadow`, `--ring`, `--standalone`)
- **Color variants:** `--primary-*`, `--secondary-*`, `--alert-*`
- **CSS layers:** `theme`, `base`, `qds`, `qwik`, `components`, `components-2`, `utilities`

### Component Pattern

Styled components live in `src/components/ui/`. Each component wraps a QDS headless primitive from `@qds.dev/ui` and applies styling via vanilla CSS classes and design tokens. Each component contains classes for each Make it Yours themes.

When adding or modifying components, please ensure that:

1. You use html or QDS headless components as the base — don't reimplement behavior.
2. You use design tokens from `global.css` instead of hardcoded colors.
3. You make sure that the component supports all the existing themes (e.g. modern, brutalist, etc.)
4. You add or update documentation in `src/routes/docs/`.
5. You document your design choices in the .md file

```
src/components/ui/button/
├── button.tsx           # Styled wrapper around QDS headless button
├── button.css           # button styles
├── button.browser.tsx   # Browser tests
├── button.md            # design decisions
└── index.ts             # Public exports
```

## Code Style

### Formatter: Prettier

**Config:** `prettier.config.js`

- Plugins: `prettier-plugin-tailwindcss`, `prettier-plugin-css-order`
- Tailwind stylesheet reference: `./src/global.css`

### Linter: ESLint

**Config:** `eslint.config.js` (ESLint 9 flat config)

- Extends: `@eslint/js`, `typescript-eslint`, `eslint-plugin-qwik`
- `@typescript-eslint/no-explicit-any`: warn
- `@typescript-eslint/no-empty-object-type`: warn

### Path Aliases

- `~/*` → `./src/*` (configured in `tsconfig.json`)

## Testing

### Unit Tests (Vitest — Node)

- File pattern: `*.unit.ts`
- Environment: Node
- Run: `pnpm test` or `pnpm vitest run <path>`

### Browser/Component Tests (Vitest — Playwright)

- File pattern: `*.browser.ts`, `*.browser.tsx`
- Environment: Playwright (Chromium)
- Uses `vitest-browser-qwik` for Qwik-specific testing
- File parallelism disabled, 2s timeout
- Setup file: `src/test-setup.ts`
- Run: `pnpm test` or `pnpm vitest run <path>`

### Coverage

- Provider: Istanbul
- Reports: text, json-summary, lcov, html
- Target: 80% patch coverage (enforced by Codecov)
- Run: `pnpm test.coverage`

## Git Workflow

### Commit Convention

```
type(scope): description
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `build`, `ci`

### Branch Strategy

- **Base branch:** `main`
- CI runs tests on push to `main` and on all PRs

## Boundaries — What NOT to Do

1. **Don't modify `global.css` carelessly** — It contains the entire design token system. Understand the layer and token structure before making changes.
2. **Don't bypass QDS headless components** — Styled components should wrap `@qds.dev/ui` primitives, not reimplement behavior.
3. **Don't hardcode colors** — Use design tokens (`var(--primary)`, etc.) instead of raw color values.
4. **Don't skip browser tests for new components** — Components that render UI should have `*.browser.tsx` tests.
5. **Don't edit generated files** — Files in `dist/`, `lib/`, `server/`, and `coverage/` are generated.
