---
name: extract-theme-css-tdd
overview: "Create a new utility function `extractThemeCSS` that parses CSS files and extracts classes for a specific theme, merging theme-specific classes into base classes. Implement using TDD: first write test definitions, then fill tests, then implement the utility."
todos:
  - id: write-test-definitions
    content: Write test definitions (describe/it statements only) in extract-theme-css.unit.ts covering all test suites
    status: completed
  - id: fill-test-implementations
    content: Fill in test implementations with expected behaviors and assertions
    status: completed
  - id: implement-parse-functions
    content: "Implement parsing functions: extractReferencesAndImports, parseLayerComponents, parseCSSClasses"
    status: completed
  - id: implement-merge-logic
    content: Implement mergeThemeClasses function to merge theme-specific classes into base classes
    status: completed
  - id: implement-output-builder
    content: Implement buildCSSOutput function to reconstruct CSS from parsed structure
    status: completed
  - id: implement-main-function
    content: Implement main extractThemeCSS function that orchestrates all steps
    status: completed
  - id: run-tests-and-refactor
    content: Run tests, fix any issues, and refactor code for clarity and performance
    status: completed
---

# Extract Theme CSS Utility - TDD Implementation

## Overview

Create a new utility function `extractThemeCSS` that parses any CSS file (no START/END comments needed) and outputs a filtered version containing only classes for the applied theme. Theme-specific classes (e.g., `.modern .btn`) are merged into base classes (e.g., `.btn`), and non-matching theme classes are removed.

## File Structure

- **Source**: `src/utils/theme/extract-theme-css.ts` - New utility function
- **Tests**: `src/utils/theme/extract-theme-css.unit.ts` - Test file with definitions

## Implementation Approach

The implementation should be separated into multiple functions with clearly defined purposes:

1. **`mergeThemeClasses(classes: ClassMap, theme: string)`** - Merge theme-specific classes into base classes
2. **`buildCSSOutput(structure: ParsedCSS)`** - Reconstruct CSS from the parsed structure
3. **`extractThemeCSS(theme: string, css: string)`** - Main entry point that orchestrates the above

## Data Structure

The intermediate representation should capture:

- References and imports (preserved as-is)
- Layer blocks with their content
- Class definitions with:
- Base classes (e.g., `.btn.variant-main`)
- Theme-specific classes (e.g., `.modern .btn.variant-main`, `.qwik .btn.variant-main`)
- Comments
- Nested selectors (e.g., `&:hover`, `&:focus-visible`)

## Test Definitions

The test file should include the following test suites with describe/it statements:

0. Test each individual sub-functions

- mergeThemeClasses(classes: ClassMap, theme: string)
- buildCSSOutput(structure: ParsedCSS)
- extractThemeCSS(theme: string, css: string)

### 1. Basic Theme Extraction

- Extract and merge theme-specific classes into base classes
- Remove non-matching theme classes
- Preserve base classes without theme variants

### 2. Preserving CSS Structure

- Preserve `@reference` statements
- Preserve `@import` statements
- Preserve `@layer` declarations
- Preserve comments

### 3. Complex Theme Merging

- Handle multiple theme variants for the same class
- Handle nested selectors with theme prefixes
- Handle complex selectors with multiple classes
- Keep pseudo-selectors (`&:hover` , `&:focus-visible`, etc.)

### 4. Multiple Themes

- Handle theme as space-separated string (e.g., "modern dark")

### 5. Edge Cases

- Handle empty CSS
- Handle CSS with no matching theme classes
- Handle CSS with only theme-specific classes (no base)
- Handle empty theme-specific classes
- Handle media queries
- Handle multiple `@layer` blocks
- Handle dark mode variants (e.g., `.modern.dark .callout-root`)

### 6. Real-world Examples

- Extract modern theme from button.css example (full example from user query)
- Extract qwik theme from callout-root.css example

### 7. Error Handling

- Throw error when theme is not provided
- Handle empty theme string gracefully

## Key Requirements

1. **No START/END comments**: The function should parse any CSS file without requiring special markers
2. **Preserve structure**: Maintain `@reference`, `@import`, `@layer`, and comments
3. **Merge logic**: Theme-specific properties merge into base classes, with theme-specific taking precedence
4. **Remove prefixes**: All theme prefixes (`.modern`, `.qwik`, etc.) should be removed from output
5. **Handle nested selectors**: Preserve and merge nested selectors like `&:hover`, `&:focus-visible`
6. **Handle compound themes**: Support `.modern.dark` style selectors

## Example Transformation

**Input** (theme: "modern"):

```css
@reference "../../../global.css";
@import "./shared.css";

@layer components {
  .btn.variant-main {
    color: var(--primary-foreground);
    &:focus-visible {
      outline: 2px solid var(--primary-ring);
    }
  }
  .qwik .btn.variant-main {
    box-shadow: var(--shadow-sm) var(--primary-shadow);
  }
  .modern .btn.variant-main {
    box-shadow: var(--shadow-sm);
    background-color: var(--primary-background);
    &:hover {
      transform: scale(0.99);
    }
  }
}
```

**Output**:

```css
@reference "../../../global.css";
@import "./shared.css";

@layer components {
  .btn.variant-main {
    box-shadow: var(--shadow-sm);
    background-color: var(--primary-background);
    color: var(--primary-foreground);
    &:focus-visible {
      outline: 2px solid var(--primary-ring);
    }
    &:hover {
      transform: scale(0.99);
    }
  }
}
```



## Implementation Steps

1. **Phase 1**: Write test definitions (describe/it statements only) in `extract-theme-css.unit.ts`
2. **Phase 2**: Fill in test implementations with expected behaviors
3. **Phase 3**: Implement the utility functions in `extract-theme-css.ts`