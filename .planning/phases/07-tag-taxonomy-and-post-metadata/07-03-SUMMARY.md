---
phase: 07-tag-taxonomy-and-post-metadata
plan: "03"
subsystem: content
tags: [seo, frontmatter, tags, taxonomy, blog]

# Dependency graph
requires:
  - phase: 07-tag-taxonomy-and-post-metadata
    provides: "Tag taxonomy established in plans 01 and 02 — canonical tag list and batch updates for 14 posts"
provides:
  - "All 21 published posts have SEO-optimized frontmatter"
  - "Zero vague tags (computing/tool/discussion/braindump) across entire blog"
  - "All posts have 120-160 char descriptions with primary keyword"
  - "No single-word unquoted titles remain"
affects: [phase-08-structured-data, content-strategy]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tag taxonomy: linux, open-source, ai-agents, agent-architecture, llm, opinion, security, ecosystem-analysis, developer-tools, keyboard, meta"

key-files:
  created: []
  modified:
    - site/src/data/blog/ctrl-nocaps.md
    - site/src/data/blog/debian.md
    - site/src/data/blog/mindmap.md
    - site/src/data/blog/new-domain-bjro-dev.md
    - site/src/data/blog/notes-1.md
    - site/src/data/blog/the-npm-problem-nobody-wants-to-work-on.md
    - site/src/data/blog/trust-1.md

key-decisions:
  - "ctrl-nocaps: tags [linux, keyboard, developer-tools] — keyboard remapping is a developer ergonomics topic, linux as primary cluster"
  - "debian.md: tags [linux, open-source] — Debian post belongs to linux cluster, open-source adds ecosystem signal"
  - "mindmap.md: tags [ai-agents, agent-architecture, opinion] — MINDMAP pattern is an agent architecture technique, removed context tag (too generic)"
  - "notes-1.md: tags [ai-agents, llm, opinion] — reflects actual post content (LLMs + agents), dropped generic software-engineering tag"
  - "trust-1.md: tags [security, llm, opinion] — security is primary angle, llm is the subject, opinion reflects author perspective"
  - "the-npm-problem: tags [ecosystem-analysis, opinion, developer-tools] — structural analysis of npm ecosystem fits ecosystem-analysis cluster"

patterns-established:
  - "Tag pattern: posts get at most one topic cluster tag + one or two modifier tags (opinion, open-source, llm, etc.)"
  - "Titles containing colons wrapped in double-quoted YAML strings to avoid parse errors"

requirements-completed:
  - "Ad-hoc (SEO audit — High impact)"

# Metrics
duration: 4min
completed: 2026-03-23
---

# Phase 07 Plan 03: Tag Taxonomy Cleanup (Linux, Opinion, Meta Posts) Summary

**SEO frontmatter updated for all 7 remaining posts — zero vague tags across all 21 published posts, build clean, phase 7 criteria fully met**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-23T08:20:11Z
- **Completed:** 2026-03-23T08:23:26Z
- **Tasks:** 2 completed
- **Files modified:** 7

## Accomplishments

- Updated title, tags, and description for all 7 remaining posts (Linux/config, opinion/analysis, meta)
- Eliminated all remaining vague tags: `computing`, `discussion`, `braindump` — zero matches across the entire blog
- Astro build passes clean with 21 pages indexed by Pagefind
- All titles are multi-word descriptive strings; no single-word unquoted titles remain

## Task Commits

1. **Task 1: Update frontmatter for 7 remaining posts** - `e09a02c` (feat)
2. **Task 2: Final validation — full build and cross-blog vague tag sweep** - `4ea8bc7` (chore)

## Files Created/Modified

- `site/src/data/blog/ctrl-nocaps.md` - New title "Remap Caps Lock to Left Control on Linux and Windows", tags [linux, keyboard, developer-tools], 155-char description
- `site/src/data/blog/debian.md` - New title "Debian: Why the Universal Operating System Still Matters in 2026", tags [linux, open-source], 163-char description
- `site/src/data/blog/mindmap.md` - New title "Context Management for AI Agents: Why MINDMAP Changes Everything", tags [ai-agents, agent-architecture, opinion], 155-char description
- `site/src/data/blog/new-domain-bjro-dev.md` - Updated description to 149 chars (title and tags unchanged)
- `site/src/data/blog/notes-1.md` - New title "Software Development Opinions: LLMs, Agentic Tooling, and What Actually Changes", tags [ai-agents, llm, opinion], 159-char description
- `site/src/data/blog/the-npm-problem-nobody-wants-to-work-on.md` - Tags updated to [ecosystem-analysis, opinion, developer-tools], description shortened and sharpened to 131 chars
- `site/src/data/blog/trust-1.md` - New title "Cloud LLMs in Production: The Hidden Trust Boundary You're Already Crossing", tags [security, llm, opinion], 150-char description

## Decisions Made

- Dropped `context` tag from mindmap.md (too generic — not a topic cluster); replaced with `agent-architecture`
- Dropped `software-engineering` tag from notes-1.md (too broad); replaced with `ai-agents` matching actual post content
- Kept `new-domain-bjro-dev.md` title and `meta` tag unchanged — already correct per plan spec
- Build failure on first attempt was transient dist cache corruption (pre-existing); resolved by removing `dist/` and rebuilding

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Cleared stale dist/ cache causing ERR_MODULE_NOT_FOUND**
- **Found during:** Task 2 (pnpm build)
- **Issue:** Build failed with `Cannot find module '...index_DeUMMUdA.mjs'` — pre-existing dist cache from earlier build runs, not caused by frontmatter changes
- **Fix:** Removed `dist/` directory, ran `pnpm build` again — succeeded cleanly
- **Files modified:** None (dist/ is generated, not tracked in git)
- **Verification:** Build succeeded, 21 pages built, Pagefind indexed 21 pages
- **Committed in:** 4ea8bc7 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (blocking build issue)
**Impact on plan:** Transient infrastructure issue unrelated to content changes. No scope creep.

## Issues Encountered

None beyond the dist cache issue documented above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 7 complete: all 21 published posts have coherent taxonomy and SEO-optimized descriptions
- Topical clusters established: linux, ai-agents/llm, security, ecosystem-analysis, meta, opinion
- Ready for Phase 8 (structured data) — JSON-LD schemas can reference consistent tag clusters

---
*Phase: 07-tag-taxonomy-and-post-metadata*
*Completed: 2026-03-23*
