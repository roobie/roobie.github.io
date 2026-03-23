---
phase: 09-technical-seo-polish
plan: "01"
subsystem: seo
tags: [seo, meta-tags, sitemap, twitter-card]
dependency_graph:
  requires: []
  provides: [clean-meta-tags, sitemap-lastmod]
  affects: [site/src/layouts/Layout.astro, site/astro.config.ts]
tech_stack:
  added: []
  patterns: [sitemap-serialize-callback, frontmatter-regex-parsing]
key_files:
  created: []
  modified:
    - site/src/layouts/Layout.astro
    - site/astro.config.ts
decisions:
  - theme-color meta tag removed entirely (empty value is invalid; no color chosen)
  - sitemap lastmod reads .md frontmatter at config-load time via simple regex (no external dependency)
  - modDatetime preferred over pubDatetime for lastmod; null/empty values fall back to pubDatetime
metrics:
  duration: "194s"
  completed: "2026-03-23"
  tasks_completed: 2
  files_modified: 2
---

# Phase 09 Plan 01: Technical SEO Polish Summary

Fix three low-severity technical SEO issues: remove invalid empty theme-color meta tag, fix Twitter Card meta attributes from property= to name=, and add lastmod dates to sitemap entries using build-time frontmatter parsing.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Remove theme-color and fix Twitter Card meta attributes | f4c8fc6 | site/src/layouts/Layout.astro |
| 2 | Add lastmod dates to sitemap via serialize function | b9784c9 | site/astro.config.ts, site/src/layouts/Layout.astro |

## What Was Built

### Task 1: Meta Tag Fixes (Layout.astro)

- Removed `<meta name="theme-color" content="" />` (line 160 — empty value is invalid and flagged by SEO auditors)
- Changed all five Twitter Card meta tags from `property=` to `name=` attribute:
  - `twitter:card`, `twitter:url`, `twitter:title`, `twitter:description`, `twitter:image`
  - Twitter Card spec explicitly requires `name=` not `property=` (which is for Open Graph/Facebook)
- Prettier reformatting applied to Layout.astro

### Task 2: Sitemap Lastmod (astro.config.ts)

- Added `buildPostDateMap()` helper function that runs at config-load time (once per build)
- Reads all `.md` files from `site/src/data/blog/`, extracts frontmatter with a simple regex
- Builds a `Map<slug, ISO-date-string>` preferring `modDatetime` over `pubDatetime`
- Handles null/empty `modDatetime` values by falling back to `pubDatetime`
- Added `serialize` callback to the sitemap integration that matches post URLs (`/posts/{slug}/`) and attaches `lastmod` from the map
- Non-post pages (index, tags, about, search) correctly receive no `lastmod`
- Build verified: sitemap contains `<lastmod>` entries for posts with dates

## Verification Results

- Build: PASS (completed without errors)
- Twitter meta name= count: 5 (was 0)
- Twitter meta property= count: 0 (was 5)
- theme-color occurrences: 0 (was 1)
- Sitemap lastmod entries: present for posts with dates (e.g., building-smarter-*, debian, introducing-cairn, introducing-slog, etc.)
- Lint: Pre-existing errors in unrelated files (constants.ts, index.astro, search.astro) — not caused by this plan
- Format: Applied Prettier to modified files

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Format] Applied Prettier formatting to modified files**
- **Found during:** Task 2 verification
- **Issue:** `pnpm format:check` showed astro.config.ts and Layout.astro were not formatted (pre-existing)
- **Fix:** Ran `pnpm prettier --write` on only the two modified files to bring them to standard
- **Files modified:** site/astro.config.ts, site/src/layouts/Layout.astro
- **Commit:** b9784c9 (included in Task 2 commit)

## Self-Check: PASSED

- site/src/layouts/Layout.astro: FOUND
- site/astro.config.ts: FOUND
- Commit f4c8fc6: FOUND
- Commit b9784c9: FOUND
