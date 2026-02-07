# Contributing

Thanks for your interest in contributing to Qwik UI. We're happy to have you here.

Please take a moment to review this document before submitting your first pull request or issue. We also strongly recommend that you check for open issues and pull requests to see if someone else is already on the same boat.

> Creating clear issues with a minimal reproduction for bugs goes a long way. If you care about the project and want its success long term, this is often the first and most important step in improving the project.

If you need any help, feel free to reach out to @maiieul on the [Qwik UI Discord](https://discord.gg/PVWUUejrez).

## About this project

Qwik UI is a highly customizable component collection for Qwik. It provides copy-paste, reusable UI components built on top of [QDS](https://github.com/kunai-consulting/qwik-design-system) headless components (`@qds.dev/ui`), styled with a semantic color token system designed for easier theming.

## Structure

```
src/
├── components/
│   ├── ui/           # Styled components (avatar, button, callout, card, etc.)
│   ├── mdx/          # MDX provider components
│   ├── header/       # Site header
│   ├── sidebar/      # Site sidebar
│   └── toc/          # Table of contents
├── routes/
│   ├── docs/         # Component documentation pages
│   └── index@landing.tsx
├── hooks/            # Custom hooks
├── utils/            # Utility functions
└── global.css        # Design token system
```

| Path                 | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `src/components/ui/` | Styled component wrappers around QDS headless primitives |
| `src/routes/docs/`   | Documentation pages for each component                   |
| `src/global.css`     | Design token system (themes, colors, layers)             |

## Development

### Prerequisites

- Node.js ≥22.0.0
- pnpm 10.24.0

### Fork and clone

```bash
git clone https://github.com/your-username/qwik-ui-styled-v2.git
cd qwik-ui-styled-v2
```

### Create a new branch

```bash
git checkout -b my-new-branch
```

### Install dependencies

```bash
pnpm install
```

### Start the dev server

```bash
pnpm dev
```

This starts the Qwik dev server in SSR mode.

## Components

Styled components live in `src/components/ui/`. Each component wraps a QDS headless primitive from `@qds.dev/ui` and applies styling via Tailwind CSS classes and design tokens.

When adding or modifying components, please ensure that:

1. You use QDS headless components as the base — don't reimplement behavior.
2. You use design tokens from `global.css` instead of hardcoded colors.
3. You add or update documentation in `src/routes/docs/`.
4. You add browser tests (`*.browser.tsx`) for any new component.

## Theming

The design token system is in `src/global.css`. It supports:

- **Theme classes:** `.modern`, `.qwik`
- **Dark mode** via CSS custom properties
- **Purpose-based tokens:** `--background`, `--foreground`, `--border`, `--shadow`, `--ring`, `--standalone`
- **Color variants:** `--primary-*`, `--secondary-*`, `--alert-*`
- **CSS layers:** `theme`, `base`, `qds`, `qwik`, `components`, `components-2`, `utilities`

Understand the layer and token structure before modifying `global.css`.

## Testing

Tests are written using [Vitest](https://vitest.dev) with two test environments:

- **Unit tests** (`*.unit.ts`) —
- **Browser/component tests** (`*.browser.tsx`) — run in Chromium via Playwright

Run all tests:

```bash
pnpm test
```

Run a single test file:

```bash
pnpm vitest run src/components/ui/input/input.browser.tsx
```

Run tests with coverage:

```bash
pnpm test.coverage
```

Please ensure that tests pass before submitting a pull request. If you're adding new components, include browser tests.

## Linting and formatting

- **Linter:** ESLint (`pnpm lint`)
- **Formatter:** Prettier with Tailwind CSS plugin (`pnpm fmt`)

Check formatting without writing:

```bash
pnpm fmt.check
```

## Commit Convention

When you create a commit we kindly ask you to follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)

Example: `feat(button): add loading state variant`
