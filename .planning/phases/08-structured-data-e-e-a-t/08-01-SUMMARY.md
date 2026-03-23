---
phase: 08-structured-data-e-e-a-t
plan: 01
subsystem: seo
tags: [json-ld, schema.org, structured-data, e-e-a-t, about-page, blogposting]

# Dependency graph
requires:
  - phase: 05-apply-edits-as-per-the-ai-seo-suggestions
    provides: BlogPosting JSON-LD base schema with author field in Layout.astro
  - phase: 06-domain-and-site-identity
    provides: SITE.author and SITE.website values in config.ts

provides:
  - BlogPosting JSON-LD publisher field (Person type, SITE.author, SITE.website)
  - BlogPosting JSON-LD mainEntityOfPage field (WebPage type, canonicalURL as @id)
  - About page expertise section (AI agents, developer tooling, software architecture, Rust/TypeScript/Go)
  - About page open-source project links (casq, cairn, slog pointing to their blog posts)

affects: [08-02, 08-03, future-seo-phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "BlogPosting JSON-LD publisher uses SITE.author/SITE.website (not destructured props) to represent publisher identity"
    - "mainEntityOfPage uses template literal ${canonicalURL} to coerce URL object to string, consistent with ${socialImageURL} pattern"

key-files:
  created: []
  modified:
    - site/src/layouts/Layout.astro
    - site/src/pages/about.md

key-decisions:
  - "publisher URL is SITE.website (site URL), not SITE.profile — per user decision, publisher URL is the site URL"
  - "About page uses casual direct voice matching existing intro paragraph style"
  - "Project links use on-site /posts/introducing-* paths to keep traffic on-site"

patterns-established:
  - "BlogPosting JSON-LD: publisher (Person) and mainEntityOfPage (WebPage) are unconditional fields within pubDatetime ternary"

requirements-completed: [Ad-hoc-1, Ad-hoc-2]

# Metrics
duration: 3min
completed: 2026-03-23
---

# Phase 08 Plan 01: Structured Data E-E-A-T — Publisher and About Page Summary

**BlogPosting JSON-LD extended with publisher (Person) and mainEntityOfPage (WebPage) fields; about page expanded with expertise areas and open-source project links for E-E-A-T signals**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-23T11:19:56Z
- **Completed:** 2026-03-23T11:22:17Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `publisher` field to BlogPosting JSON-LD: Person type with `SITE.author` name and `SITE.website` URL
- Added `mainEntityOfPage` field to BlogPosting JSON-LD: WebPage type with `canonicalURL` as `@id`
- Expanded about page with "What I work on" section listing AI agents, developer tooling, software architecture, and Rust/TypeScript/Go
- Added "Open-source projects" section with casq, cairn, and slog links pointing to their respective blog posts
- Retained existing intro paragraph, CC BY 4.0 license notice, and AstroPaper attribution

## Task Commits

Each task was committed atomically:

1. **Task 1: Add publisher and mainEntityOfPage to BlogPosting JSON-LD** - `3803a92` (feat)
2. **Task 2: Expand about page with expertise and open-source projects** - `1c9e83e` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `site/src/layouts/Layout.astro` - Added publisher (Person, SITE.author, SITE.website) and mainEntityOfPage (WebPage, canonicalURL) to BlogPosting structured data
- `site/src/pages/about.md` - Added expertise section and open-source project links; retained all existing content

## Decisions Made

- Publisher URL uses `SITE.website` (the site's canonical URL) rather than `SITE.profile` — per plan specification, publisher URL is the site URL, not the author profile URL
- About page project links use relative `/posts/introducing-*` paths (on-site traffic) rather than external URLs
- Casual/direct voice maintained throughout: "I build mostly in Rust, TypeScript, and Go" — matches existing intro tone

## Deviations from Plan

None - plan executed exactly as written.

Note: Pre-existing lint errors found in `index.astro` and `search.astro` (5 ESLint errors for unused vars) are unrelated to this plan's changes and were logged to `deferred-items.md`.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- BlogPosting JSON-LD now has complete publisher and page identity fields, ready for Google Rich Results validation
- About page establishes author expertise context for E-E-A-T signals in phases 08-02 and 08-03
- No blockers for remaining phase 08 plans

---
*Phase: 08-structured-data-e-e-a-t*
*Completed: 2026-03-23*
