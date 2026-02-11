# Codebase Structure

**Analysis Date:** 2026-02-11

## Directory Layout

```
qwik-ui-styled-v2/
├── src/
│   ├── components/              # All components (site + library)
│   │   ├── ui/                  # Styled library components (public API)
│   │   ├── mdx/                 # MDX provider + doc components
│   │   ├── header/              # Site header component
│   │   ├── sidebar/             # Navigation sidebar
│   │   ├── toc/                 # Table of contents
│   │   ├── make-it-yours/       # Make it Yours feature
│   │   ├── router-head/         # Meta tags
│   │   ├── code-copy/           # Copy button for code blocks
│   │   ├── copy-css-config/     # CSS export component
│   │   ├── highlight/           # Code highlighting
│   │   ├── icons/               # Icon library wrapper
│   │   ├── headless/            # Headless wrappers (if any)
│   │   └── note/                # Callout/note components
│   ├── routes/                  # Qwik routing (filesystem-based)
│   │   ├── docs/                # Doc pages
│   │   │   └── components/      # Component doc pages
│   │   │       ├── button/
│   │   │       ├── card/
│   │   │       ├── input/
│   │   │       └── ...
│   │   ├── test/                # Test routes
│   │   ├── sink/                # Sink pages (misc)
│   │   ├── layout.tsx           # Main layout (wraps docs)
│   │   ├── layout-landing.tsx   # Landing layout
│   │   ├── index@landing.tsx    # Landing page
│   │   └── horizontal-layout.constant.ts
│   ├── hooks/                   # Custom hooks
│   │   ├── use-theme/           # Theme management
│   │   └── use-menu-items.tsx   # Navigation menu
│   ├── utils/                   # Utilities
│   │   ├── extract-themed-css/  # Make it Yours CSS extraction
│   │   ├── constants.ts         # Color mode constants
│   │   └── visually-hidden.tsx  # Accessibility helper
│   ├── root.tsx                 # Root component (providers)
│   ├── entry.ssr.tsx            # SSR entry point
│   ├── entry.dev.tsx            # Dev entry point
│   ├── entry.preview.tsx        # Preview entry point
│   ├── global.css               # Design token system
│   └── test-setup.ts            # Vitest setup
├── vite.config.ts               # Vite + Qwik + Tailwind config
├── vitest.config.ts             # Vitest (unit + browser) config
├── tsconfig.json                # TypeScript config
├── prettier.config.js           # Prettier formatter
├── eslint.config.js             # ESLint (flat config v9)
├── package.json                 # Dependencies, scripts
└── ...
```

## Directory Purposes

**`src/components/ui/`:**
- Purpose: Public UI component library (styled wrappers around QDS headless)
- Contains: 10+ styled components (Button, Card, Input, Modal, Field, Breadcrumb, Chip, Callout, Skeleton, Separator)
- Key files:
  - Each component subdirectory contains: `{component}.tsx`, `{component}.css`, index file, optional tests (`*.browser.tsx`), `design.md`
  - `index.ts` exports all components as public API
  - `render.tsx` - Flexible composition helper used by all components

**`src/components/mdx/`:**
- Purpose: MDX documentation infrastructure
- Contains: Provider, custom tag components, showcase/code snippet renderers
- Key files:
  - `provider.tsx` - MDXContext + MDXProvider component
  - `components.tsx` - Overrides for HTML tags (`<h1>`, `<code>`, `<a>`) and custom components
  - `code-snippets.tsx` - Generates themed CSS downloads (uses `extract-themed-css`)
  - `showcase.tsx` - Component showcase wrapper

**`src/components/header/`:**
- Purpose: Site navigation header
- Contains: Logo, theme toggle, mobile menu button
- Key files: `header.tsx`

**`src/components/sidebar/`:**
- Purpose: Left navigation sidebar for docs
- Contains: Menu item groups, active page highlighting
- Key files: `sidebar.tsx`

**`src/components/toc/`:**
- Purpose: Table of contents for current page
- Contains: Heading extraction and nesting
- Key files: `toc.tsx`

**`src/routes/`:**
- Purpose: Qwik filesystem-based routing
- Contains: Markdown + MDX pages, layout wrappers
- Key files:
  - `layout.tsx` - Main doc layout (sidebar, header, TOC)
  - `index@landing.tsx` - Landing page
  - `docs/components/` - Subdirectories per component (button/, card/, etc.)
  - `horizontal-layout.constant.ts` - Grid layout class

**`src/hooks/use-theme/`:**
- Purpose: Theme state management and persistence
- Contains: Provider component, custom hook, types, theme script
- Key files:
  - `provider.tsx` - ThemeProvider + useTheme() hook
  - `types.ts` - Type definitions
  - `theme-script.ts` - Script for flash prevention

**`src/utils/extract-themed-css/`:**
- Purpose: CSS AST processing for theme extraction (Make it Yours)
- Contains: Multi-step CSS transformation pipeline
- Key files:
  - `extract-themed-css.ts` - Main orchestrator
  - `step1-only-keep-applied-theme-classes.ts` - Filter by applied theme
  - `step2-remove-theme-preludes.ts` - Remove theme class prefix
  - `step3-merge-duplicates.ts` - Merge duplicate rules
  - `global-css-pre-processing.ts` - Convert pure theme rules to root
  - `global-css-post-processing.ts` - Post-process undefined tokens
  - `tests/` - Unit tests for each step

**`src/global.css`:**
- Purpose: Design token system (colors, spacing, shadows, etc.)
- Contains:
  - CSS layer definitions: `@layer theme, base, qds, qwik, components, components-2, utilities;`
  - Theme definitions (`:root`, `.light`, `.dark`, `.modern`, `.qwik`)
  - Color tokens (primary, secondary, alert variants)
  - Generic tokens (background, foreground, border, shadow, ring)
  - Dark mode custom variant
  - Tailwind CSS import
  - QDS design token import

## Key File Locations

**Entry Points:**
- `src/entry.ssr.tsx` - Server-side rendering entry (called on every request)
- `src/entry.dev.tsx` - Development entry
- `src/entry.preview.tsx` - Build preview entry
- `src/root.tsx` - Root component (providers, global styles)

**Configuration:**
- `tsconfig.json` - TypeScript (path alias: `~/*` → `./src/*`)
- `vite.config.ts` - Vite + Qwik + Tailwind + QDS tools (asChild, icons)
- `vitest.config.ts` - Vitest with unit (Node) + browser (Playwright) projects
- `eslint.config.js` - ESLint 9 flat config
- `prettier.config.js` - Prettier with Tailwind + CSS order plugins

**Core Logic:**
- `src/components/ui/render.tsx` - Flexible composition primitive
- `src/utils/extract-themed-css/extract-themed-css.ts` - Theme CSS extraction orchestrator
- `src/hooks/use-theme/provider.tsx` - Theme state management
- `src/components/mdx/code-snippets.tsx` - Styled code snippets with theme extraction

**Utilities:**
- `src/utils/extract-themed-css/tests/test-helpers.ts` - CSS test helpers
- `src/utils/constants.ts` - Color mode constants (light, dark values)
- `src/utils/visually-hidden.tsx` - Accessibility helper

**Testing:**
- `src/test-setup.ts` - Vitest setup for browser tests
- `src/components/ui/{component}/{component}.browser.tsx` - Component browser tests
- `src/utils/extract-themed-css/tests/*.unit.ts` - CSS extraction unit tests

## Naming Conventions

**Files:**
- Components: PascalCase (e.g., `Button.tsx`, `Input.tsx`)
- Styles: kebab-case with component name (e.g., `button.css`, `card-root.css`)
- Utilities: camelCase (e.g., `extract-themed-css.ts`, `test-helpers.ts`)
- Tests: suffix with `.unit.ts` (Node) or `.browser.tsx` (browser)
- Hooks: `use-*` prefix (e.g., `use-theme/`, `use-menu-items.tsx`)

**Directories:**
- Component directories: kebab-case (e.g., `src/components/ui/icon-button/`)
- Feature directories: kebab-case (e.g., `src/components/code-copy/`)
- Grouping directories: plural or descriptive (e.g., `src/routes/docs/components/`)

**CSS Classes:**
- Base variant: `component-name` (e.g., `.btn`, `.input`, `.card-root`)
- Variant modifier: `variant-{name}` (e.g., `.variant-primary`, `.variant-secondary`)
- Size modifier: `size-{name}` (e.g., `.size-md`, `.size-lg`)
- Theme-scoped: `.{theme} .component-name` (e.g., `.qwik .btn.variant-primary`)

**TypeScript/JSX:**
- Component names: PascalCase exports (e.g., `export const Button = component$(...)`)
- Props types: `{Component}Props` (e.g., `ButtonProps`, `InputProps`)
- Type unions for variants: `{Component}Variants` (e.g., `ButtonVariants`)
- Size type: `{Component}Sizes` (e.g., `ButtonSizes`)

## Where to Add New Code

**New Styled Component:**
1. Primary code: `src/components/ui/{component-name}/`
2. Structure:
   - `{component-name}.tsx` - Component wrapper
   - `{component-name}.css` - Styles with theme variants
   - `{component-name}.browser.tsx` - Vitest browser tests (if interactive)
   - `design.md` - Design decisions
   - `index.tsx` or `index.ts` - Exports
3. If composite component (like Card): Export namespace object with subcomponents:
   ```typescript
   export const Card = {
     Root,
     Header,
     Title,
     Description,
     Content,
     Footer,
   };
   ```
4. Register in `src/components/ui/index.ts` export

**New Utility Function:**
- Shared logic: `src/utils/{feature}/`
- Single function: `src/utils/{feature}.ts`
- With tests: `src/utils/{feature}/tests/`

**New Custom Hook:**
- Location: `src/hooks/{hook-name}/` or `src/hooks/{hook-name}.tsx`
- Export custom hook and any related types/providers

**New Documentation Page:**
1. MDX content: `src/routes/docs/components/{component}/`
2. Include filename as route (Qwik filesystem routing)
3. Use MDX components from `src/components/mdx/components.tsx` for consistency
4. For code examples: Use `CodeSnippets` component with `rawSnippetTab` array

**New Test File:**
- Unit tests (Node environment): `{location}/{feature}.unit.ts`
- Browser tests (Playwright): `{location}/{feature}.browser.tsx`
- Test fixtures: `{location}/tests/fixtures/` subdirectory

## Special Directories

**`src/routes/`:**
- Purpose: Qwik filesystem-based routing (auto-generated routes)
- Generated: No (manually authored)
- Committed: Yes
- Special files:
  - `layout.tsx` - Main layout (wraps all routes)
  - `layout-landing.tsx` - Landing-specific layout
  - `index@landing.tsx` - Landing page (@ segment reset)
  - `horizontal-layout.constant.ts` - Shared grid constant

**`src/components/mdx/`:**
- Purpose: MDX content infrastructure
- Generated: No
- Committed: Yes
- Note: `components.tsx` maps HTML tags to custom components

**`dist/`, `lib/`, `server/`, `coverage/`:**
- Purpose: Build outputs
- Generated: Yes (by build process)
- Committed: No
- Note: Gitignored

**`.planning/codebase/`:**
- Purpose: GSD analysis documents
- Generated: Yes (by GSD agents)
- Committed: Yes (check-in when ready)

## Path Aliases

**TypeScript Config (`tsconfig.json`):**
- `~/*` → `./src/*` (import from any src file as `~/path/to/file`)

**Usage:**
```typescript
// Instead of:
import { Button } from "../../../components/ui/button";

// Use:
import { Button } from "~/components/ui";
```

---

*Structure analysis: 2026-02-11*
