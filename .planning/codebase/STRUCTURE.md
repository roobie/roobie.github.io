# Codebase Structure

**Analysis Date:** 2026-03-10

## Directory Layout

```
roobie.github.io/
├── .git/                       # Git repository metadata
├── .github/                    # GitHub workflows and templates
│   └── workflows/              # CI/CD pipeline definitions
├── .planning/
│   └── codebase/               # Analysis and planning documents
├── .vscode/                    # IDE configuration
├── .claude/                    # Claude-specific settings
└── site/                       # Main Astro project root
    ├── src/                    # Source code (non-compiled)
    │   ├── assets/             # Static images, icons, fonts
    │   │   ├── icons/          # SVG icon components
    │   │   └── images/         # PNG, JPEG images
    │   ├── components/         # Reusable Astro components
    │   ├── data/               # Content and data files
    │   │   └── blog/           # Blog post markdown files
    │   ├── layouts/            # Page layout templates
    │   ├── pages/              # Route definitions (file-based routing)
    │   │   ├── posts/          # Blog post routes
    │   │   └── tags/           # Tag-based routes
    │   ├── scripts/            # Client-side JavaScript/TypeScript
    │   ├── styles/             # CSS stylesheets
    │   ├── utils/              # Utility functions and helpers
    │   │   ├── og-templates/   # OG image templates
    │   │   └── transformers/   # Remark/Shiki transformers
    │   ├── config.ts           # Site configuration
    │   ├── constants.ts        # Site constants (socials, share links)
    │   ├── content.config.ts   # Content collection schema
    │   └── env.d.ts            # TypeScript environment types
    ├── public/                 # Static assets served as-is
    │   └── pagefind/           # Search index (generated at build)
    ├── dist/                   # Build output (generated, not committed)
    ├── node_modules/           # Dependencies (not committed)
    ├── .astro/                 # Astro cache (not committed)
    ├── package.json            # Project metadata and dependencies
    ├── tsconfig.json           # TypeScript configuration
    ├── astro.config.ts         # Astro framework configuration
    ├── eslint.config.js        # ESLint configuration
    ├── tailwind.config.js      # Tailwind CSS configuration (inferred)
    └── .prettierrc             # Prettier configuration (inferred)
```

## Directory Purposes

**site/src/assets/:**
- Purpose: Store static images and icons used in components and layouts
- Contains: SVG icon components (IconGitHub.svg, IconMail.svg, etc.), PNG images for posts
- Key files: `icons/` (SVG icons), `images/` (photos and diagrams)

**site/src/components/:**
- Purpose: Reusable, modular Astro components
- Contains: Header, Footer, Card, Pagination, BackButton, Tag, Datetime, ShareLinks, Socials, LinkButton, Breadcrumb, EditPost, BackToTopButton
- Key files: `Header.astro`, `Footer.astro`, `Card.astro`, `Pagination.astro`

**site/src/data/:**
- Purpose: Content data directory (blog posts and scratch files)
- Contains: Markdown files with frontmatter (title, date, tags, etc.)
- Key files: `blog/` (all blog post markdown files), `scratch.md` (temporary notes)

**site/src/layouts/:**
- Purpose: Top-level page templates that wrap page content
- Contains: Layout.astro (base HTML template), PostDetails.astro (blog post layout), Main.astro (main content wrapper), AboutLayout.astro
- Key files: `Layout.astro` (root), `PostDetails.astro` (post-specific), `Main.astro` (standard pages)

**site/src/pages/:**
- Purpose: Define routes via Astro's file-based routing system
- Contains: Route files and directories that map to URLs
- Key files: `index.astro` (homepage), `404.astro` (not found page), `about.md` (about page), `search.astro` (search page)

**site/src/pages/posts/:**
- Purpose: Blog post routes
- Contains: `[...page].astro` (posts list with pagination), `[...slug]/index.astro` (individual post detail)
- URL mapping: `/posts/`, `/posts/2/`, `/posts/{slug}/`

**site/src/pages/tags/:**
- Purpose: Tag-based content browsing routes
- Contains: `index.astro` (all tags page), `[tag]/[...page].astro` (posts filtered by tag, with pagination)
- URL mapping: `/tags/`, `/tags/{tagName}/`, `/tags/{tagName}/2/`

**site/src/pages/archives/:**
- Purpose: Archive view of posts (optional, controlled by SITE.showArchives)
- Contains: `index.astro` (archive page)
- URL mapping: `/archives/`

**site/src/scripts/:**
- Purpose: Client-side JavaScript functionality
- Contains: `theme.ts` (theme switching logic)
- Execution: Loaded in Layout.astro after page render

**site/src/styles/:**
- Purpose: Global CSS and typography
- Contains: `global.css` (Tailwind directives, custom properties), `typography.css` (prose styling)
- Key files: `global.css` (theme variables, base styles)

**site/src/utils/:**
- Purpose: Reusable utility functions for content processing
- Contains: Post filtering/sorting, tag extraction, path generation, OG image generation
- Key files:
  - `getSortedPosts.ts` - Sort posts by date (newest first)
  - `postFilter.ts` - Filter out drafts and unpublished posts
  - `getUniqueTags.ts` - Extract and deduplicate tags from posts
  - `getPostsByTag.ts` - Filter posts by tag
  - `getPath.ts` - Generate URL paths from post id
  - `generateOgImages.ts` - Dynamic OG image creation
  - `slugify.ts` - Convert strings to URL-safe slugs
  - `og-templates/` - Satori templates for OG images

## Key File Locations

**Entry Points:**
- `site/src/pages/index.astro` - Homepage (/), displays featured and recent posts
- `site/src/pages/posts/[...page].astro` - All posts paginated (/posts/, /posts/2/, etc.)
- `site/src/pages/posts/[...slug]/index.astro` - Individual post detail (/posts/{slug}/)
- `site/src/pages/tags/[tag]/[...page].astro` - Posts by tag (/tags/{tagName}/)

**Configuration:**
- `site/src/config.ts` - Site metadata (title, author, timezone, per-page settings)
- `site/src/constants.ts` - Social links and share buttons
- `site/src/content.config.ts` - Blog collection schema (Zod validation)
- `site/astro.config.ts` - Framework setup (integrations, markdown, build options)
- `site/package.json` - Dependencies and npm scripts

**Core Logic:**
- `site/src/utils/getSortedPosts.ts` - Post sorting logic
- `site/src/utils/postFilter.ts` - Post filtering (drafts, scheduling)
- `site/src/utils/getUniqueTags.ts` - Tag extraction
- `site/src/layouts/PostDetails.astro` - Post rendering with metadata, navigation, sharing

**Styling:**
- `site/src/styles/global.css` - Tailwind, CSS variables, base styles
- `site/src/styles/typography.css` - Prose/markdown typography

**Testing:**
- No dedicated test files or test runner configured

**Build & CI:**
- `.github/workflows/` - GitHub Actions workflows (deploy, lint, build)
- `site/package.json` scripts: `dev`, `build`, `preview`, `sync`, `format`, `lint`

## Naming Conventions

**Files:**
- Components: PascalCase.astro (e.g., `Header.astro`, `Card.astro`)
- Utilities: camelCase.ts (e.g., `getSortedPosts.ts`, `postFilter.ts`)
- Pages/Routes: lowercase with brackets for dynamic segments (e.g., `[...slug]`, `[...page]`)
- Data: lowercase with hyphens (e.g., `business-processes.md`)
- Assets: descriptive with Icon/Image prefix (e.g., `IconGitHub.svg`, `AstroPaper-v5.png`)
- Styles: global.css, typography.css

**Directories:**
- Lowercase plural for collections (e.g., `components/`, `pages/`, `utils/`)
- Lowercase singular for single-purpose dirs (e.g., `scripts/`, `data/`)
- Bracket notation for dynamic routes (e.g., `[...slug]/`, `[tag]/`)

**TypeScript/JavaScript:**
- Functions: camelCase (e.g., `getSortedPosts`, `postFilter`)
- Interfaces/Types: PascalCase (e.g., `Tag`, `Props`)
- Constants: UPPER_SNAKE_CASE (e.g., `SITE`, `SOCIALS`, `SHARE_LINKS`)
- Variables: camelCase (e.g., `sortedPosts`, `featuredPosts`, `recentPosts`)

**URL Routes:**
- Homepage: `/`
- Posts list: `/posts/`, `/posts/[page]/`
- Post detail: `/posts/[slug]/`
- Tags: `/tags/`, `/tags/[tagName]/`, `/tags/[tagName]/[page]/`
- Archives: `/archives/`
- About: `/about/`
- Search: `/search/`

## Where to Add New Code

**New Blog Post:**
- Create `.md` file in `site/src/data/blog/{slug}.md`
- Include frontmatter: pubDatetime, title, tags, description, featured (optional), draft (optional)
- Built-in static generation automatically creates routes

**New Feature/Component:**
- Reusable component: `site/src/components/{ComponentName}.astro`
- Layout: `site/src/layouts/{LayoutName}.astro`
- Page route: `site/src/pages/{route-pattern}.astro`
- Utility: `site/src/utils/{functionName}.ts`

**New Utility Function:**
- Primary location: `site/src/utils/{functionName}.ts`
- If utility operates on posts: Place near `getSortedPosts.ts`, `postFilter.ts`
- If utility for routes: Can co-locate in `site/src/utils/` or page file
- Export as named export or default export (check usage pattern)

**New Integration/Plugin:**
- Integrate via `site/astro.config.ts` integrations array
- Add package to `site/package.json` dependencies
- Configure in astro.config.ts (e.g., sitemap, RSS, analytics)

**New Styling:**
- Global styles: `site/src/styles/global.css` (top-level classes)
- Typography: `site/src/styles/typography.css` (prose/markdown related)
- Component-specific: Use Tailwind className attribute in `.astro` files
- Theme variables: Add CSS custom properties (--color-*, --font-*) in global.css

**Static Pages (Non-Blog):**
- Markdown page: Create `.md` in `site/src/pages/` (e.g., `about.md`)
- Astro page: Create `.astro` in `site/src/pages/` with Layout wrapper
- Auto-generated feed: Use `.ts` file in `site/src/pages/` (e.g., `rss.xml.ts`)

## Special Directories

**site/.astro/:**
- Purpose: Astro framework cache for collections, fonts, and build artifacts
- Generated: Yes (at dev start and build)
- Committed: No (.gitignore entry)

**site/dist/:**
- Purpose: Build output - static HTML, CSS, JS, and generated files
- Generated: Yes (by `npm run build`)
- Committed: No (.gitignore entry)
- Contains: Full site ready for deployment

**site/node_modules/:**
- Purpose: NPM dependencies
- Generated: Yes (by `npm install`)
- Committed: No (.gitignore entry)

**site/public/**:
- Purpose: Static assets served exactly as-is (favicon, robots.txt, search index)
- Generated: Partially (pagefind index added by build script)
- Committed: Yes (some), except pagefind/
- Copy behavior: Astro copies entire directory to dist/ during build

**site/.github/workflows/:**
- Purpose: CI/CD pipeline definitions for GitHub Actions
- Committed: Yes
- Examples: Linting, building, deploying on push

---

*Structure analysis: 2026-03-10*
