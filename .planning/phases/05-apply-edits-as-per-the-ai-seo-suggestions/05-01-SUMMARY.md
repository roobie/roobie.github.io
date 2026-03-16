---
phase: 05-apply-edits-as-per-the-ai-seo-suggestions
plan: 01
subsystem: ui
tags: [astro, seo, structured-data, json-ld, open-graph, schema-org]

# Dependency graph
requires: []
provides:
  - Conditional BlogPosting JSON-LD only on post pages (where pubDatetime is set)
  - og:type meta tag on all pages (article for posts, website for others)
  - article:author and article:tag OG meta tags on post pages
  - description and keywords fields in BlogPosting JSON-LD
  - tags prop threaded from PostDetails.astro to Layout.astro
affects: [seo, structured-data, social-sharing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Conditional structured data: use pubDatetime as the discriminator for post vs. non-post pages"
    - "Spread operator for optional JSON-LD fields: ...(condition && { field: value })"

key-files:
  created: []
  modified:
    - site/src/layouts/Layout.astro
    - site/src/layouts/PostDetails.astro

key-decisions:
  - "Use pubDatetime as the single discriminator for post vs. non-post page logic in Layout.astro"
  - "BlogPosting JSON-LD uses pubDatetime.toISOString() directly (not a template literal) to avoid 'undefined' stringification"
  - "og:type set to 'article' when pubDatetime is truthy, 'website' otherwise — covers all page types"

patterns-established:
  - "Conditional JSON-LD: wrap script tag in {structuredData && (...)} so it only renders on post pages"
  - "Optional JSON-LD fields via spread: ...(tags && tags.length > 0 && { keywords: tags.join(', ') })"

requirements-completed: [SEO-01, SEO-02, SEO-03]

# Metrics
duration: 2min
completed: 2026-03-16
---

# Phase 5 Plan 1: Fix Structured Data and Open Graph Meta Tags Summary

**Conditional BlogPosting JSON-LD with description/keywords, og:type on all pages, and article:author/article:tag on post pages — fixing undefined datePublished and missing OG meta tags**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-16T16:57:23Z
- **Completed:** 2026-03-16T16:59:16Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- BlogPosting JSON-LD now only renders on actual blog post pages (gated on pubDatetime), fixing the broken emission on homepage/about/tags/search pages
- Fixed `"datePublished": "undefined"` bug by using `pubDatetime.toISOString()` directly instead of a template literal wrapping an optional
- Added `description` and `keywords` (from tags) fields to the BlogPosting JSON-LD object for richer AI/search indexing
- Added `og:type` meta tag to every page (article for posts, website for others) — was entirely absent before
- Added `article:author` and `article:tag` conditional OG meta tags on post pages for social card metadata
- Threaded the `tags` prop from PostDetails.astro layoutProps through to Layout.astro's Props type and destructuring

## Task Commits

Each task was committed atomically:

1. **Task 1 + 2: Thread tags prop and fix structured data + OG tags (with built output verification)** - `592617b` (feat)

**Plan metadata:** (to be added in final docs commit)

## Files Created/Modified
- `site/src/layouts/Layout.astro` - Props type extended with tags, conditional structuredData, og:type, article:author, article:tag, conditional JSON-LD script
- `site/src/layouts/PostDetails.astro` - layoutProps extended with tags field

## Decisions Made
- Used `pubDatetime` as the single discriminator for post vs. non-post page logic rather than introducing a new `isPost` boolean prop — keeps the API minimal and consistent with existing patterns
- `og:type` placed between og:url and og:image following recommended OG property ordering (title, description, url, type, image)
- `article:author` uses the profile URL (not the author name) as its content, matching social platform expectations for author attribution

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

The `pnpm lint` command failed due to a pre-existing AJV compatibility error in the ESLint tooling infrastructure (`TypeError: Cannot set properties of undefined (setting 'defaultMeta')` in `@eslint/eslintrc`). This is unrelated to any changes in this plan — it was already broken before this session. TypeScript check (`astro check`) passed with 0 errors and the build succeeded.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All SEO structured data fixes are complete and verified against the built dist
- Homepage confirmed to have og:type=website and no BlogPosting JSON-LD
- Post pages confirmed to have BlogPosting JSON-LD with description, keywords, article:author, and article:tag
- No further SEO work items remain in this phase's plan

---
*Phase: 05-apply-edits-as-per-the-ai-seo-suggestions*
*Completed: 2026-03-16*
