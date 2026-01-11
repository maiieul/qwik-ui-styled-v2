export const theme = "modern" as const;

export const buttonCSS = {
  "a button": `
@reference "../../../global.css";
@import "./shared.css";

@layer components {
  .btn.variant-primary {
    color: var(--primary-foreground);
    &:focus-visible {
      outline: 2px solid var(--primary-ring);
    }
  }
  .qwik .btn.variant-primary {
    box-shadow: var(--shadow-sm) var(--primary-shadow);
    border: var(--default-border-width) solid var(--primary-border);
    background-color: var(--primary-background);
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: var(--shadow-md) var(--primary-shadow);
    }
  }
  .modern .btn.variant-primary {
    box-shadow: var(--shadow-sm);
    background-color: var(--primary-background);
    &:hover {
      transform: scale(0.99);
    }
  }

  .btn.variant-secondary {
    background-color: var(--secondary-background);
    color: var(--secondary-foreground);
    &:focus-visible {
      outline: 2px solid var(--secondary-ring);
    }
  }
  .qwik .btn.variant-secondary {
    box-shadow: var(--shadow-sm) var(--secondary-shadow);
    border: var(--default-border-width) solid var(--secondary-border);
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: var(--shadow-md) var(--secondary-shadow);
    }
  }
  .modern .btn.variant-secondary {
    box-shadow: var(--shadow-sm);
    &:hover {
      transform: scale(0.99);
    }
  }

  .btn.variant-outline {
    background-color: var(--background);
    color: var(--foreground);
    &:focus-visible {
      outline: 2px solid var(--secondary-ring);
    }
  }
  .qwik .btn.variant-outline {
    box-shadow: var(--shadow-sm) var(--secondary-shadow);
    border: var(--default-border-width) solid var(--secondary-border);
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: var(--shadow-md) var(--secondary-shadow);
    }
  }
  .modern .btn.variant-outline {
    box-shadow: var(--shadow-sm);
    border: var(--default-border-width) solid var(--border);
    &:hover {
      transform: scale(0.99);
    }
  }

  .btn.variant-link {
    color: var(--primary-standalone);
    &:hover {
      text-decoration: underline;
    }
    &:focus-visible {
      outline: 2px solid var(--secondary-ring);
    }
  }
  .qwik .btn.variant-link {
  }
  .modern .btn.variant-link {
  }

  .btn.variant-ghost {
    border-radius: var(--radius-xl);
    color: var(--foreground);
    &:hover {
      background-color: var(--background-accent);
      color: var(--foreground-accent);
    }
    &:focus-visible {
      outline: 2px solid var(--ring);
    }
  }
  .qwik .btn.variant-ghost {
  }
  .modern .btn.variant-ghost {
  }

  .btn.variant-vanilla {
    color: var(--foreground);
    &:focus-visible {
      outline: 2px solid var(--secondary-ring);
    }
  }
  .qwik .btn.variant-vanilla {
  }
  .modern .btn.variant-vanilla {
  }

  .btn.variant-alert {
    box-shadow: var(--shadow-sm) var(--alert-shadow);
    border: var(--default-border-width) solid var(--alert-border);
    background-color: var(--alert-background);
    color: var(--alert-foreground);
    &:hover {
      transform: scale(0.99);
    }
    &:focus-visible {
      outline: 2px solid var(--alert-ring);
    }
  }
  .qwik .btn.variant-alert {
  }
  .modern .btn.variant-alert {
  }

  /* sizes */
  .btn.size-sm {
    gap: 0.375rem;
    padding: 0 0.75rem;
    height: 2rem;
    &:has(> svg) {
      padding: 0 0.625rem;
    }
  }

  .btn.size-md {
    padding: 0.5rem 1rem;
    height: 2.25rem;
    &:has(> svg) {
      padding: 0.5rem 0.75rem;
    }
  }

  .btn.size-lg {
    padding: 0 1.5rem;
    height: 2.5rem;
    &:has(> svg) {
      padding: 0 1rem;
    }
  }
}
`,
} as const;
