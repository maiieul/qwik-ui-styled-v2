# External Integrations

**Analysis Date:** 2026-02-11

## APIs & External Services

**Design System:**
- QDS UI (@qds.dev/ui v0.8.5) - Headless component primitives
  - SDK/Client: `@qds.dev/ui` package
  - Documentation: Components wrapped in `src/components/ui/`
  - No authentication required - open source dependency

**Icon System:**
- Iconify (@iconify/utils v3.1.0) - Icon library system
  - SDK/Client: `@iconify/utils` package
  - Usage: Icon processing utilities in `src/components/icons/`
  - No authentication required

## Data Storage

**Databases:**
- Not detected - This is a frontend/documentation site with no backend database

**File Storage:**
- Local filesystem only - Static assets served via Vite/build process
- No external file storage (S3, Cloud Storage, etc.) detected

**Caching:**
- HTTP caching headers managed via Vite:
  - Dev mode: `Cache-Control: public, max-age=0` (no caching in `vite.config.ts`)
  - Preview mode: `Cache-Control: public, max-age=600` (10-minute cache in `vite.config.ts`)

## Authentication & Identity

**Auth Provider:**
- Not detected - No authentication system present

**Authorization:**
- Not applicable - Static documentation site with no user accounts

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service (Sentry, Rollbar, etc.) integrated

**Logs:**
- Console logging only - Application does not integrate external logging services
- Environment: Vite dev server logs visible in terminal during development

**Analytics:**
- Not detected - No analytics service (Google Analytics, Mixpanel, etc.) configured

## CI/CD & Deployment

**Hosting:**
- Not configured - Deployment target flexible
- Qwik CLI note in package.json: "Run 'npm run qwik add' to install a server adapter"
- Currently supports SSR via Vite in SSR mode (`src/entry.ssr.tsx`)

**CI Pipeline:**
- Not detected - No CI workflow files present (no GitHub Actions, GitLab CI, etc.)

**Build Process:**
- Vite-based build via `pnpm build` command
- Qwik optimizer handles client/SSR build splitting
- Output: Static assets + SSR-ready application

## Environment Configuration

**Required env vars:**
- None strictly required for development or runtime
- Optional: `BASE_URL` (via `import.meta.env.BASE_URL`) - used in `src/root.tsx` for manifest path

**Secrets location:**
- No secrets management detected
- No `.env` files present or required

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook endpoints

**Outgoing:**
- Not detected - No outgoing webhook calls

## Third-Party Services

**Syntax Highlighting:**
- Shiki v3.22.0 - Server-side syntax highlighting
  - Themes: `github-light` (light mode), `poimandres` (dark mode)
  - Configured in `vite.config.ts` via `@shikijs/rehype`
  - Used for MDX code blocks in documentation routes

**UI Polyfills:**
- HTML Popover API Polyfill (@oddbird/popover-polyfill v0.6.1) - Fallback for unsupported browsers
- Floating UI (@floating-ui/dom v1.7.5) - Tooltip/dropdown positioning (via QDS components)

**Browser Automation (Testing Only):**
- Playwright v1.58.2 - Browser testing automation
  - Browser: Chromium
  - Used only in test environment (vitest browser tests)
  - Not used in production

## Content Management

**MDX Content:**
- Content pages in `src/routes/docs/` are MDX files
- Processed by QwikRouter with:
  - remark-gfm (GitHub Flavored Markdown)
  - rehype-autolink-headings
  - Shiki syntax highlighting
- Custom MDX provider: `src/components/mdx/provider`

## Build-Time Processing

**CSS Processing:**
- Design tokens extracted from `src/global.css`
- CSS tree AST traversal in `src/utils/extract-themed-css/` for theme class extraction
- Tailwind CSS v4 with custom theme variants (`.modern`, `.qwik`)
- Dark mode support via CSS custom properties

**Asset Compression:**
- fflate v0.8.2 - Available for ZIP compression/decompression if needed
- No active compression integration detected

## No External Dependencies For:

- Payment processing (Stripe, PayPal, etc.)
- Email/SMS delivery (SendGrid, Twilio, etc.)
- Real-time features (WebSockets, Firebase, Supabase, etc.)
- External APIs (REST, GraphQL)
- Cloud services (AWS, Google Cloud, Azure, etc.)
- CMS platforms
- Databases
- Task queues/job processors
- Message brokers
- CDNs (Vite-based with standard web server)

---

*Integration audit: 2026-02-11*
