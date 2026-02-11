# Codebase Concerns

**Analysis Date:** 2026-02-11

## Tech Debt

**Modal Animation State Management:**
- Issue: `[ui-closed]` animations are not properly implemented. The TODO comment indicates unfinished animation logic.
- Files: `src/components/ui/modal/modal-content.css` (line 1)
- Impact: Modal closing animations may not work correctly or may be incomplete. Users may see abrupt transitions instead of smooth animations when closing modals from certain positions (top, right, bottom, left).
- Fix approach: Complete the `[ui-closed]` animation implementation. Currently, `[ui-open]` has backdrop animations defined but `[ui-closed]` state handling appears incomplete. Need to verify backdrop animation behavior when modals close and ensure all position variants animate smoothly.

**DocsCallout Component Redundancy:**
- Issue: The `DocsCallout` component wraps `Callout` with minimal added value. Could be replaced by using `Callout` directly with an optional icon prop.
- Files: `src/components/docs-callout.tsx` (line 5)
- Impact: Maintenance overhead. Extra abstraction layer that doesn't significantly improve the API. Adds cognitive load when developers need to choose between `Callout` and `DocsCallout`.
- Fix approach: Migrate all usages of `DocsCallout` to `Callout` directly. Add icon prop to `Callout.Root` if needed. Remove the wrapper component entirely. This simplifies the component library surface.

**Global CSS Design Token System - Large Single File:**
- Issue: All design tokens and theming are in a single `global.css` file (~650 lines). Complex layer ordering and token definitions make it fragile.
- Files: `src/global.css`
- Impact: Difficult to modify without breaking theme system. Layer ordering (theme, base, qds, qwik, components, components-2, utilities) is explicit but brittle. Adding components-3, components-4 requires manual intervention. CSS inheritance and cascading becomes harder to reason about as file grows.
- Fix approach: Consider splitting into logical layers: `src/css/layers.css`, `src/css/tokens/base.css`, `src/css/tokens/light.css`, `src/css/tokens/dark.css`. Document layer purpose and dependency order. Add comments for why each layer exists.

## Test Coverage Gaps

**Site Components Untested:**
- What's not tested: Header, sidebar, TOC, Make-it-Yours feature, MDX components, routing and page layouts
- Files:
  - `src/components/header/header.tsx` (0% coverage)
  - `src/components/sidebar/sidebar.tsx` (0% coverage)
  - `src/components/toc/toc.tsx` (0% coverage)
  - `src/components/make-it-yours/make-it-yours.tsx` (0% coverage)
  - `src/components/mdx/provider.tsx` (0% coverage)
  - `src/components/mdx/code-snippets.tsx` (0% coverage)
  - `src/components/note/note.tsx` (0% coverage)
- Risk: Site infrastructure (navigation, TOC generation, Make-it-Yours theme extraction) has zero test coverage. Bugs in these could break the entire documentation site experience.
- Priority: High - Make-it-Yours and TOC are critical features. Header/sidebar affect user experience on every page.

**UI Component Test Coverage - Limited Browser Tests:**
- What's not tested: Most UI components only have basic tests or no tests. Coverage is 0.93% lines across the entire codebase.
- Files:
  - `src/components/ui/button/` - No tests
  - `src/components/ui/card/` - No tests
  - `src/components/ui/field/` - No tests
  - `src/components/ui/modal/` - No tests
  - `src/components/ui/separator/` - No tests
  - `src/components/ui/skeleton/` - No tests
  - `src/components/ui/chip/` - No tests
  - `src/components/ui/callout/` - No tests
  - `src/components/ui/breadcrumb/` - No tests
- Risk: Components may have subtle styling or behavior issues not caught by automated tests. Relying on manual testing and visual inspection.
- Priority: Medium - Core components should have at least smoke tests and basic interaction tests.

**Extract-Themed-CSS Tests - Good Coverage but High Risk:**
- What's tested: Comprehensive unit tests for CSS extraction logic (`src/utils/extract-themed-css/tests/`)
- Files:
  - `src/utils/extract-themed-css/tests/extract-themed-css.unit.ts`
  - `src/utils/extract-themed-css/tests/step1-only-keep-applied-theme-classes.unit.ts`
  - `src/utils/extract-themed-css/tests/step2-remove-theme-preludes.unit.ts`
  - `src/utils/extract-themed-css/tests/step3-merge-duplicates.unit.ts`
- Risk: While CSS extraction has excellent test coverage, Make-it-Yours feature depends critically on this utility running correctly in the browser at runtime. Tests are unit-level but real-world CSS from global.css may behave differently.
- Priority: Medium - Add integration tests verifying Make-it-Yours theme extraction works end-to-end with actual component CSS.

## Performance Bottlenecks

**Make-it-Yours CSS Extraction - Client-Side AST Processing:**
- Problem: CSS extraction via css-tree happens on the client when users interact with Make-it-Yours modal. Full global.css (~650 lines) is parsed and traversed for every theme change.
- Files:
  - `src/components/make-it-yours/make-it-yours.tsx` (lines 21-23)
  - `src/utils/extract-themed-css/extract-themed-css.ts` (full pipeline)
- Cause: Parsing and processing full stylesheet client-side on every interaction. Async operation triggered by onClick.
- Improvement path:
  1. Cache parsed CSS AST after first load
  2. Pre-compute theme extractions on build and serve as static artifacts
  3. Consider lazy-loading css-tree and prettier plugins only when modal opens
  4. Add performance monitoring to track extraction time

**Theme Provider - Multiple Re-renders:**
- Problem: Theme provider has several `useTask$` and `useVisibleTask$` that trigger on state changes. Storage events, system theme changes, and explicit theme changes each trigger separate renders.
- Files: `src/hooks/use-theme/provider.tsx` (lines 78-131)
- Cause: Multiple tracking mechanisms (useTask for localStorage sync, useVisibleTask for system theme, useOnWindow for storage events) can cause cascading updates.
- Improvement path: Consolidate theme update logic into single coordinated effect. Consider debouncing rapid theme changes. Add instrumentation to measure actual render counts.

**TOC Active Item Tracking - DOM Querying on Scroll:**
- Problem: Table of Contents uses `useOnWindow` listening to scroll events and likely performs DOM queries on every scroll.
- Files: `src/components/toc/toc.tsx` (lines 24-34)
- Cause: Active heading detection likely walks DOM or uses expensive selectors on every scroll event
- Improvement path: Add scroll event debouncing/throttling. Use Intersection Observer API instead of DOM querying. Cache selector results.

## Fragile Areas

**CSS Layer Ordering - Silent Failures:**
- Files: `src/global.css` (lines 1-4)
- Why fragile: CSS layer ordering is implicit in `@layer theme, base, qds, qwik, components, components-2, utilities;`. A single typo or reorder breaks specificity. New developers may not understand why their styles don't apply.
- Safe modification: Always verify layer order before modifying. Document why each layer exists. Add comments explaining specificity cascade. Consider using CSS variables for layer-dependent logic instead of relying on cascade.
- Test coverage: No automated tests verify layer order correctness. Manual browser verification required.

**Theme Token Hacks - "x" Placeholder Pattern:**
- Files: `src/global.css` (scattered throughout, e.g., lines 12-29)
- Why fragile: Design tokens use `x` as placeholder for undefined values (e.g., `--background: x;`). This works due to CSS error handling but is non-standard and confusing.
- Safe modification: If modifying token structure, verify all layers properly override `x` values. Do not assume `x` stays in computed styles.
- Test coverage: No tests verify that undefined tokens properly default. Visual testing required.

**Make-it-Yours Theme Object Parsing:**
- Files: `src/components/make-it-yours/make-it-yours.tsx` (lines 25-40)
- Why fragile: Theme is parsed by splitting on space: `themeSig.value.split(" ")`. Assumes exactly 2 parts (mode + style). If theme string format changes, this breaks silently.
- Safe modification: Add validation that parsed theme has expected structure. Handle edge cases (empty strings, more than 2 parts). Add tests covering theme parsing.
- Test coverage: No tests for theme parsing logic.

**CSS-Tree AST Traversal - Assumes Valid Input:**
- Files: `src/utils/extract-themed-css/extract-themed-css.ts` (full file)
- Why fragile: Multiple assertions check for CSS structure violations (no !important, proper layers, no duplicate declarations). If any assertion fails, entire extraction throws. No graceful degradation.
- Safe modification: Consider returning errors as data instead of throwing. Provide fallback behavior for invalid CSS. Add detailed error messages for debugging.
- Test coverage: Good unit test coverage for error cases.

## Scaling Limits

**Global CSS Will Need Additional Layers:**
- Current capacity: 2 component layers (components, components-2)
- Limit: If more than 2 component layers needed, must manually add components-3, components-4, etc.
- Scaling path: Convert layer system to dynamic generation or use CSS @supports for feature detection instead of layers.

**Make-it-Yours Feature - CSS Size Constraints:**
- Current capacity: Works with ~650 line global.css
- Limit: As CSS grows (more components, more themes), client-side extraction becomes slower. Clipboard copy of large CSS strings may fail on some browsers.
- Scaling path: Implement streaming download instead of clipboard copy. Pre-compute common theme extractions. Offer minified output.

## Dependencies at Risk

**@qds.dev/tools - PR Build Reference:**
- Risk: Version pinned to PR build: `https://pkg.pr.new/kunai-consulting/qwik-design-system/@qds.dev/tools@380`
- Impact: Breaks if PR #380 closes or is garbage collected. No stable version fallback.
- Migration plan: Switch to stable @qds.dev/tools version once available, or publish a vendored copy of needed tools.

**@qwik.dev/core - Beta Version:**
- Risk: Using `2.0.0-beta.21` - breaking changes possible in future beta releases
- Impact: Build may break on update. No semver guarantees on beta versions.
- Migration plan: Pin version and review release notes before updating. Plan migration once Qwik v2 is stable.

**css-tree - Breaking Changes Risk:**
- Risk: CSS parsing library at `^3.1.0`. Major version constraints mean potential breaking changes.
- Impact: CSS extraction logic could break if css-tree changes AST structure or API
- Migration plan: Review css-tree changelog before major updates. Add integration tests that catch API breakage early.

## Security Considerations

**Theme Extraction - Code Execution Context:**
- Risk: CSS-tree parses and traverses user-provided CSS (from global.css). If css-tree has parsing vulnerabilities, could be exploited.
- Files: `src/utils/extract-themed-css/extract-themed-css.ts` + `css-tree` dependency
- Current mitigation: css-tree is established, widely-used library. Input is controlled (own global.css).
- Recommendations:
  1. Keep css-tree dependency updated
  2. Add CSP headers if serving Make-it-Yours feature to external users
  3. Monitor css-tree security advisories

**localStorage Direct Access - No Validation:**
- Risk: Theme value read from localStorage without validation before applying
- Files: `src/hooks/use-theme/provider.tsx` (lines 117-121)
- Current mitigation: Value only used as CSS class/attribute name
- Recommendations: Validate theme value against whitelist of allowed themes before storing/applying. Sanitize before setAttribute.

**Clipboard Copy - XSS Risk:**
- Risk: Make-it-Yours copies CSS to clipboard. Malicious global.css could include script tags (though CSS parser should reject).
- Files: `src/components/copy-css-config/copy-css-config.tsx`
- Current mitigation: CSS is extracted/cleaned by css-tree
- Recommendations: Verify clipboard-copy library is up-to-date. Add CSP headers to limit damage if compromised.

## Missing Critical Features

**No Dark Mode Testing:**
- Problem: Components support dark mode via CSS custom properties, but no automated tests verify dark theme actually applies.
- Blocks: Cannot confidently ship dark mode features. Manual testing required every time theme tokens change.

**No Theme Consistency Validation:**
- Problem: No automated check that all themes have all required tokens defined.
- Blocks: May silently ship incomplete theme if a token is missing from one theme. Results in inconsistent user experience.

**No Component Documentation Tests:**
- Problem: Component examples in docs have no automated verification they render correctly.
- Blocks: Documentation examples may drift from actual component API over time.
