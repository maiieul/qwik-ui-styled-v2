export const theme = "modern" as const;

export const cssFiles = {
  basic: `
@reference "../../../global.css";
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
    --theme-var: var(--color-red);
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

  "nested-selectors": `
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
  "recursively-nested-selectors": `
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
  "dark-variants": `
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
  "comma-separated": `
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
  "mixed-selector-list": `
@layer components {
    .modern .btn,
    .qwik .btn {
        color: red;
    }
}
`,
  "theme-class-not-leading": `
@layer components {
    .container .btn {
        color: red;
    }
    .container .modern .btn {
        color: green;
    }
    .container .qwik .btn {
        color: blue;
    }
}`,
  "media-queries-in-selectors": `
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
  "duplicate-nested-media-overrides": `
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
  "multiple-at-layer-rules": `
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
  "no-combinator": `
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
} as const;
