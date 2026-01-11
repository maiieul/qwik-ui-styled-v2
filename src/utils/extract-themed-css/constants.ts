export const allowedVariantClasses = new Set(["dark", "light"]);

// Hardcoded list of all possible theme classes. This allows us to distinguish
// theme classes from component classes when filtering no-combinator selectors.
export const potentialThemes = new Set(["qwik", "modern"]);
