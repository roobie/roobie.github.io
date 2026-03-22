---
phase: 06-domain-and-site-identity
plan: 01
subsystem: infra
tags: [astro, seo, domain, robots-txt, sitemap, og-tags]

# Dependency graph
requires:
  - phase: 05-apply-edits-as-per-the-ai-seo-suggestions
    provides: og:type and meta tag improvements used in layout
provides:
  - bjro.dev as canonical domain in all generated URLs
  - Updated site description with AI/developer tooling keywords
  - Clean robots.txt (no leading blank line) referencing bjro.dev
  - Sitemap entries all referencing bjro.dev
affects: [all-future-phases, seo-audit-follow-up]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SITE.website in config.ts is the single source of truth for all canonical URLs — changing it propagates to sitemap, robots.txt, OG tags, and meta tags via Astro.site"

key-files:
  created: []
  modified:
    - site/src/config.ts
    - site/src/pages/robots.txt.ts

key-decisions:
  - "editPost.url kept as roobie.github.io — it is a GitHub source-editing link, not a canonical URL, and must not be changed"
  - "301 redirect from roobie.github.io to bjro.dev is a manual infra step outside this repo (GitHub Pages custom domain setting or Cloudflare redirect rule)"

patterns-established:
  - "Domain identity pattern: single SITE.website field propagates to all generated outputs via Astro.site injection"

requirements-completed:
  - "Ad-hoc (SEO audit — Critical)"

# Metrics
duration: 6min
completed: 2026-03-22
---

# Phase 06 Plan 01: Domain and Site Identity Summary

**Domain migrated from roobie.github.io to bjro.dev in config.ts, with desc updated to signal AI agents/dev tooling expertise, and robots.txt leading blank line removed — build verified bjro.dev propagates to sitemap, OG tags, and meta tags**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-03-22T04:57:00Z
- **Completed:** 2026-03-22T05:03:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- `SITE.website` and `SITE.profile` updated from `roobie.github.io` to `https://bjro.dev/` — single change propagates to all generated URLs
- `SITE.desc` updated to "Writing on AI agents, developer tooling, and software architecture — by Björn Roberg." — signals content focus to crawlers and AI agents
- `robots.txt.ts` template literal fixed — `User-agent:` now starts immediately after the opening backtick with no leading newline
- Build verified: sitemap, robots.txt, index.html canonical/OG/Twitter meta tags, and RSS feed all reference bjro.dev
- Zero stale roobie.github.io references in generated HTML/XML/TXT output (editPost.url intentionally preserved as GitHub source-editing link)

## Task Commits

Each task was committed atomically:

1. **Task 1: Update site identity in config.ts and fix robots.txt leading blank line** - `62102d5` (feat)
2. **Task 2: Build and verify domain propagation** - verification only, no new files (covered by Task 1 commit)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `site/src/config.ts` - website and profile changed to https://bjro.dev/, desc updated with AI/dev keywords
- `site/src/pages/robots.txt.ts` - removed leading newline from getRobotsTxt template string

## Decisions Made

- `editPost.url` left as `https://github.com/roobie/roobie.github.io/edit/master/` — this is a GitHub source-editing link pointing to the repo, not a canonical domain reference. Changing it would break "Edit page" links on all posts.
- 301 redirect from roobie.github.io to bjro.dev is documented as a manual infra step. To complete the domain migration: set the custom domain in GitHub repository Settings > Pages (or add a Cloudflare redirect rule). Verify with: `curl -I https://roobie.github.io` — expect 301 with `Location: https://bjro.dev/`.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Build succeeded cleanly (0 errors, 20 hints — pre-existing deprecation warnings in upstream Astro/Zod, unrelated to this change).

## User Setup Required

**Manual infra step required for full domain migration:**

The 301 redirect from roobie.github.io to bjro.dev must be configured outside this repo:

1. **GitHub Pages option:** Go to repository Settings > Pages > Custom domain, enter `bjro.dev`, save.
2. **Cloudflare option:** Add a redirect rule in the Cloudflare dashboard: `roobie.github.io` → 301 → `https://bjro.dev/$1`.

Verify redirect is working: `curl -I https://roobie.github.io` — expect `HTTP/1.1 301` with `Location: https://bjro.dev/`.

## Next Phase Readiness

- Domain identity is fully configured in source — all generated outputs reference bjro.dev
- Ready for Phase 07 (tag taxonomy) and subsequent SEO audit phases
- No blockers

---
*Phase: 06-domain-and-site-identity*
*Completed: 2026-03-22*
