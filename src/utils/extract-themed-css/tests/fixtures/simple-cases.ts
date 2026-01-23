export const cssFiles = {
  basic: `
@import "./shared.css";

@layer components {
    .btn {
        color: red;
    }
    .qwik .btn {
        color: blue;
    }
    .modern .btn {
        color: green;
    }
    .whatever .btn {
        color: yellow;
    }
}

@theme {
    --theme-var: var(--foreground);
}

@media (max-width: 768px) {
    .test {
        color: yellow;
    }
}
`,
  "class-selectors": `
@layer components {
    .btn {
        color: red;
        background-color: blue;
        padding: 8px;
    }
    .qwik .btn {
        color: blue;
    }
    .modern .btn {
        color: green;
        border: 1px solid red;
    }
}
`,

  "should-merge-nested-selectors": `
@layer components {
    .btn {
        color: red;
            background-color: blue;
        &:focus-visible {
            outline: 2px solid red;
        }
        &:active {
            transform: translate(2px, 2px);
        }
    }
    .qwik .btn {
        color: blue;
        &:hover {
            transform: translate(-2px, -2px);
        }
    }
    .modern .btn {
        color: green;
        border: 1px solid red;
        &:hover {
            transform: scale(0.99);
        }
        &:active {
            transform: translate(-2px, -2px);
        }
    }
}
`,
  "should-keep-recursively-nested-selectors": `
@layer components {
    .btn {
        color: red;
            background-color: blue;
        &:focus-visible {
            outline: 2px solid red;
            &:active {
                transform: translate(2px, 2px);
            }
        }
    }
    .qwik .btn {
        color: blue;
        &:hover {
            transform: translate(-2px, -2px);
        }
    }
    .modern .btn {
        color: green;
        border: 1px solid red;
        &:hover {
            transform: scale(0.99);
        }
        &:active {
            transform: translate(-2px, -2px);
        }
    }
}
`,
  "should-merge-dark-variants": `
@layer components {
    .btn {
        color: red;
    }
    .qwik .btn {
        color: green;
    }
    .dark .btn {
        color: gray;
    }
    .dark.qwik .btn {
        color: blue;
    }
    .qwik.dark .btn {
        color: orange;
    }
    .modern .btn {
        color: yellow;
    }
    .modern.dark .btn {
        color: pink;
    }
    .dark.modern .btn {
        color: purple;
    }
}
`,
  "should-handle-comma-separated-classes": `
@layer components {
    .btn,
    .icon-btn {
        color: red;
    }
    .modern .btn,
    .modern .icon-btn {
        color: green;
    }
}
`,
  "should-handle-mixed-selector-list": `
@layer components {
    .modern .btn,
    .qwik .btn {
        color: red;
    }
}
`,
  "should-handle-not-leading-theme-class": `
@layer components {
    .leading .btn {
        color: red;
    }
    .leading .modern .btn {
        color: green;
    }
    .leading .qwik .btn {
        color: blue;
    }
}`,
  "should-keep-media-queries-in-selectors": `
@layer components {
    .btn {
        color: red;
        @media (max-width: 768px) {
            color: yellow;
        }
    }
    .modern .btn {
        color: green;
    }
}
`,
  "should-handle-duplicate-nested-media-overrides": `
@layer components {
    .btn {
        color: red;
        @media (max-width: 768px) {
            color: yellow;
            background-color: blue;
            &:hover {
                transform: scale(0.99);
            }
        }
    }
    .modern .btn {
        color: green;
        @media (max-width: 768px) {
            color: orange;
            border: 1px solid red;
            &:hover {
                transform: scale(0.98);
            }
            &:active {
                transform: translate(-2px, -2px);
            }
        }
    }
}
`,
  "should-handle-multiple-at-layer-rules": `
@layer components {
    .btn {
        color: red;
    }
    .modern .btn {
        color: green;
    }
}

@layer components {
    .test {
        color: pink;
    }
    .modern .test {
        color: purple;
    }
}
`,
  "should-work-without-combinator": `
@layer components {
    .light {
        color: red;
    }
    .dark {
        color: gray;
    }
    .modern.light {
        color: green;
    }
    .modern.dark {
        color: blue;
    }
}
`,
  "should-strip-comments": `
/*
 * This is a comment
 */
/* This is a comment */
@layer components {
    /*
    * This is a comment
    */
    /* This is a comment */
    .btn {
        color: red;
    }
}
/*
 * This is a comment
 */
/* This is a comment */
@theme {
    /*
    * This is a comment
    */
    /* This is a comment */
    --theme-var: var(--foreground);
}
`,
  "should-handle-light-variant": `
@layer components {
    .btn {
        color: red;
    }
    .light .btn {
        color: white;
    }
    .dark .btn {
        color: gray;
    }
    .modern.light .btn {
        color: green;
    }
    .modern.dark .btn {
        color: blue;
    }
}
`,
  "should-preserve-top-level-at-rules": `
@custom-variant dark (&:where(.dark, .dark *));
@import "./shared.css";

@layer components {
    .btn {
        color: red;
    }
    .modern .btn {
        color: green;
    }
}

@media (min-width: 768px) {
    .responsive-test {
        color: yellow;
    }
}

@theme {
    --my-var: var(--foreground);
}
`,
} as const;
