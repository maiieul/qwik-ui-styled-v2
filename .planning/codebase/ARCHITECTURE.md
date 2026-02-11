# Architecture

**Analysis Date:** 2026-02-11

## Pattern Overview

**Overall:** Qwik SSR application with a styled component library wrapper layer

**Key Characteristics:**
- Single-page Qwik application (not monorepo) serving as documentation + component showcase
- Styled wrapper components around QDS (Qwik Design System) headless primitives from `@qds.dev/ui`
- Multi-theme system via design tokens in `src/global.css` with CSS layers and custom properties
- Theme-aware CSS extraction ("Make it Yours" feature) via AST traversal with `css-tree`
- MDX-based documentation with client-side code snippet generation

## Layers

**Presentation Layer (UI Components):**
- Purpose: Styled components wrapping QDS headless primitives with Tailwind + design tokens
- Location: `src/components/ui/`
- Contains: Component files (`.tsx`), styles (`.css`), index exports
- Depends on: `@qds.dev/ui` headless components, design tokens from `src/global.css`, utility components
- Used by: Documentation routes, MDX documentation pages

**Design System Layer:**
- Purpose: CSS custom properties, color tokens, theme definitions, CSS layers
- Location: `src/global.css`
- Contains: Root-level CSS variables for each theme (light, dark, modern, qwik), color definitions, layer cascade
- Depends on: Tailwind CSS, `@qds.dev/ui/tailwind` (QDS design tokens)
- Used by: All styled components, theme-aware extraction

**Documentation/Routes Layer:**
- Purpose: Render MDX documentation and component examples
- Location: `src/routes/`
- Contains: Layout components (`layout.tsx`), landing page (`index@landing.tsx`), docs pages, examples
- Depends on: Styled components from `src/components/ui/`, MDX provider, hooks (theme, menu)
- Used by: Browser (Qwik router renders these)

**Composition Layer:**
- Purpose: MDX provider, custom MDX components, showcase/code snippet components
- Location: `src/components/mdx/`
- Contains: `MDXProvider`, `components.tsx` (tag overrides), `CodeSnippets`, `Showcase`
- Depends on: Styled components, `extract-themed-css` utility, Tabs from `@qds.dev/ui`
- Used by: Documentation routes for rendering dynamic content

**Utility/Infrastructure Layer:**
- Purpose: Shared logic, hooks, CSS processing, helper functions
- Location: `src/utils/`, `src/hooks/`
- Contains: Theme extraction logic, custom hooks, constants
- Depends on: Qwik core, external libraries (css-tree, prettier)
- Used by: Components, composition layer, routes

**Site Structure Layer:**
- Purpose: Top-level chrome (header, sidebar, TOC)
- Location: `src/components/header/`, `src/components/sidebar/`, `src/components/toc/`
- Contains: Navigation, layout structure
- Depends on: Styled components, hooks (theme, menu)
- Used by: Main layout (`src/routes/layout.tsx`)

## Data Flow

**Initial Page Load (SSR):**

1. `src/entry.ssr.tsx` → renders `src/root.tsx`
2. Root establishes:
   - QwikRouterProvider for routing
   - ThemeProvider (from `src/hooks/use-theme/provider.tsx`) for theme context
   - Inlines `src/global.css` via `useStyles$(globalStyles)`
3. Router renders requested route from `src/routes/`
4. Layout (`src/routes/layout.tsx`) renders:
   - Header with theme toggle
   - Sidebar with navigation
   - Main content slot (MDX or example)
   - Table of contents (TOC)

**Theme Management (Client-Side):**

1. `ThemeProvider` via `useTheme()` hook manages theme state
2. On `useVisibleTask$`, reads theme from `localStorage` (key: `storageKey`)
3. Applies theme class (`.light`, `.dark`, `.modern`, `.qwik`) to `document.documentElement`
4. CSS variables in `src/global.css` re-evaluate based on active theme class
5. Components consume theme via CSS custom properties (e.g., `var(--primary-foreground)`)

**Make it Yours Feature (Dynamic CSS Extraction):**

1. User views component documentation page
2. `CodeSnippets` component (in `src/components/mdx/code-snippets.tsx`) receives styled component's CSS
3. On user action (copy theme button):
   - Calls `extractThemedCSS()` from `src/utils/extract-themed-css/extract-themed-css.ts`
   - CSS AST walk via `css-tree` extracts only applied theme classes for current theme
   - Step 1: Keep only theme classes applied to current theme (`.qwik .btn { }` → kept if theme is "qwik")
   - Step 2: Remove theme class prelude (`.qwik .btn { }` → `.btn { }`)
   - Step 3: Merge duplicate rules
   - Post-processing: Replace CSS custom property fallbacks
4. Generates downloadable CSS/zip with themed styles

**Component Rendering:**

1. Component (e.g., `Button`) wraps QDS headless primitive
2. `Render` component (`src/components/ui/render.tsx`) handles flexible composition
3. Component applies:
   - Base classes (e.g., `btn-base btn`)
   - Variant class (e.g., `variant-primary`)
   - Size class (e.g., `size-md`)
4. CSS in `src/components/ui/button/button.css` applies:
   - Generic rules (no theme prefix)
   - Theme-specific rules (`.qwik .btn.variant-primary`, `.modern .btn.variant-primary`)
5. Active theme class on root element triggers correct CSS

**State Management:**

- Theme signal: `themeSig` in `ThemeProvider`
- Resolved theme signal: `resolvedThemeSig` for "system" theme detection
- localStorage persistence: `localStorage.setItem(storageKey, theme)`
- Qwik reactivity: Uses `useSignal`, `useVisibleTask$`, `useTask$` for client interactivity

## Key Abstractions

**Render Component:**
- Purpose: Flexible component composition with asChild pattern
- Location: `src/components/ui/render.tsx`
- Pattern: Accepts `jsxType` prop to swap rendering element; fallback to provided element type (button, div, etc.)
- Usage: All styled components wrap their QDS headless version with `<Render fallback="element">`
- Benefit: Enables composition without reimplementing behavior

**Extract Themed CSS:**
- Purpose: AST-based CSS transformation to extract theme-specific styles
- Location: `src/utils/extract-themed-css/`
- Pattern: Multi-step CSS-tree walking + Prettier formatting
  - Step 1: `step1-only-keep-applied-theme-classes.ts` - Filter rules by applied theme
  - Step 2: `step2-remove-theme-preludes.ts` - Strip theme class prefixes
  - Step 3: `step3-merge-duplicates.ts` - Deduplicate merged rules
- Usage: Called by `CodeSnippets` component to generate user-downloadable themed CSS

**Theme Provider:**
- Purpose: Global theme state + system preference detection + localStorage persistence
- Location: `src/hooks/use-theme/provider.tsx`
- Pattern: Qwik context provider + custom hook for consumption
- Supports: Light/dark mode, custom themes (modern, qwik), system preference detection
- Exports: `useTheme()` hook returns `{ themeSig, resolvedThemeSig, storageKey, defaultTheme }`

**MDX Component Wrapper:**
- Purpose: Override MDX default tag rendering (e.g., `<h1>`, `<code>`, `<a>`)
- Location: `src/components/mdx/provider.tsx` (context) + `src/components/mdx/components.tsx` (overrides)
- Pattern: MDXContext + useContext for component lookup
- Usage: MDX documents render with custom Callout, CodeCopy, CodeSnippet components instead of raw HTML

**Component Pattern:**
- All styled components in `src/components/ui/{component}/`:
  - `{component}.tsx` - Component with props, imports CSS, uses `Render`
  - `{component}.css` - Styles with theme variants in CSS layers
  - `{component}.browser.tsx` - Vitest browser tests (if interactive)
  - `index.tsx` - Exports (or barrel pattern for grouped components like Card)
  - `design.md` - Design decisions documentation

## Entry Points

**SSR Entry:**
- Location: `src/entry.ssr.tsx`
- Triggers: On every request (dev), build (preview/prod)
- Responsibilities: Invoke `renderToStream()` with Root component, pass through container attributes and server data

**Root Component:**
- Location: `src/root.tsx`
- Triggers: Rendered by entry.ssr.tsx
- Responsibilities: Set up providers (QwikRouterProvider, ThemeProvider), inline global CSS, define document structure

**Layout (Main):**
- Location: `src/routes/layout.tsx`
- Triggers: Wraps all doc pages
- Responsibilities: Render header, sidebar, main content, TOC; manage theme from localStorage

**Landing Page:**
- Location: `src/routes/index@landing.tsx`
- Triggers: Root path `/`
- Responsibilities: Render landing page with hero/showcase

**Docs Routes:**
- Location: `src/routes/docs/components/{component}/`
- Triggers: `/docs/components/{component}`
- Responsibilities: Render MDX documentation for each component

## Error Handling

**Strategy:** Assertions in CSS extraction, component prop validation via TypeScript

**Patterns:**
- `extractThemedCSS()` throws on:
  - `!important` declarations (breaks theme extraction logic)
  - Multiple theme classes in selector (prevents ambiguity)
  - Non-selector rules in @layer blocks (requires flat structure)
  - Duplicate property declarations in same rule (prevents merge ambiguity)
- Component types: Strict TypeScript props (e.g., `ButtonVariants` union, `ButtonSizes` literal type)
- Input validation: QDS headless components handle accessibility + validation; styled wrappers inherit

## Cross-Cutting Concerns

**Logging:** Console only (no structured logging framework detected)

**Validation:** TypeScript strict mode + prop type definitions

**Authentication:** Not applicable (documentation site, no auth)

**Theming:** Centralized in `src/global.css` + `ThemeProvider` hook
- Theme classes applied to `document.documentElement`
- CSS custom properties cascade from root
- Multiple themes: light, dark, modern, qwik (can be combined, e.g., "light modern")

**Styling:**
- Tailwind CSS v4 + CSS custom properties + CSS layers
- All components use design tokens instead of hardcoded colors
- CSS layers ensure proper cascade: `theme` → `base` → `qds` → `qwik` → `components` → `components-2` → `utilities`

---

*Architecture analysis: 2026-02-11*
