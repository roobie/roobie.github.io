# Technology Stack

**Analysis Date:** 2026-03-10

## Languages

**Primary:**
- TypeScript 5.9.3 - Type-safe implementation of frontend and build scripts
- Astro 5.17.1 - Static site generation and component framework

**Secondary:**
- JavaScript (module form) - Build scripts and configuration

## Runtime

**Environment:**
- Node.js (version managed via pnpm, defaults to 22 per Astro v5 spec)

**Package Manager:**
- pnpm (latest) - Used in CI/CD pipeline (see `.github/workflows/deploy.yml`)
- Lockfile: Present at `site/pnpm-lock.yaml` (lockfileVersion: 9.0)

## Frameworks

**Core:**
- Astro 5.17.1 - Static site generator for markdown-based blog
- @astrojs/rss 4.0.15 - RSS feed generation
- @astrojs/sitemap 3.7.0 - Sitemap generation for SEO

**Styling:**
- Tailwind CSS 4.1.18 - Utility-first CSS framework
- @tailwindcss/vite 4.1.18 - Vite integration for Tailwind
- @tailwindcss/typography 0.5.19 - Typography plugin for styled markdown content

**Content Processing:**
- remark-toc 9.0.0 - Generates table of contents in markdown
- remark-collapse 0.1.2 - Collapses sections in markdown
- @shikijs/transformers 3.22.0 - Syntax highlighting transformers

**Code Generation:**
- satori 0.18.4 - Generate images from React components (used for OG images)
- @resvg/resvg-js 2.6.2 - SVG rendering for image generation
- sharp 0.34.5 - Image processing and optimization

**Development Tools:**
- TypeScript ESLint 8.54.0 - Linting with TS support
- eslint-plugin-astro 1.5.0 - Astro-specific linting rules
- Prettier 3.8.1 - Code formatting
- prettier-plugin-astro 0.14.1 - Astro formatting support
- prettier-plugin-tailwindcss 0.7.2 - Tailwind class sorting in formatting
- @astrojs/check 0.9.6 - Type checking for Astro components

**Testing & Search:**
- pagefind 1.4.0 - Site search indexing (client-side)
- @pagefind/default-ui 1.4.0 - UI for site search

**Analytics:**
- astro-simpleanalytics-plugin 0.3.20 - Simple Analytics integration

**Utilities:**
- dayjs 1.11.19 - Date manipulation
- lodash 4.17.23 - General utilities
- lodash.kebabcase 4.1.1 - String case conversion
- slugify 1.6.6 - URL-safe slug generation

## Configuration

**Environment:**
- Environment variables defined via `astro:env/client` schema in `site/astro.config.ts`
- `PUBLIC_GOOGLE_SITE_VERIFICATION` - Optional Google Search Console verification (public, client-side)
- `PUBLIC_POKEAPI` - Used in CI/CD, set to `https://pokeapi.co/api/v2` (not actively used in codebase)

**Build:**
- `site/astro.config.ts` - Main Astro configuration with integrations, markdown, Vite plugins
- `site/tsconfig.json` - TypeScript strict mode with path alias `@/*` → `./src/*`
- `site/.prettierrc.mjs` - Prettier formatting config (80 char line width, double quotes, trailing commas)
- `site/eslint.config.js` - ESLint config with TypeScript and Astro plugin support

**Directory Structure:**
- `site/src/` - Application source
  - `site/src/config.ts` - Site metadata and settings
  - `site/src/content.config.ts` - Content collection schema
  - `site/src/data/blog/` - Markdown blog posts
  - `site/src/pages/` - Route pages and endpoints
  - `site/src/layouts/` - Layout components
  - `site/src/components/` - Reusable Astro components
  - `site/src/utils/` - Build-time utilities
  - `site/src/styles/` - Global CSS
- `site/dist/` - Built output (not committed)
- `site/public/` - Static assets and built artifacts

## Platform Requirements

**Development:**
- Node.js 22+ (recommended, defaults via pnpm)
- pnpm package manager

**Production:**
- GitHub Pages (deployed via GitHub Actions)
- Static hosting (no server-side rendering)
- Custom domains supported (currently `roobie.github.io`)

---

*Stack analysis: 2026-03-10*
