---
phase: 08-structured-data-e-e-a-t
plan: "02"
subsystem: content
tags: [internal-linking, seo, ai-agents, topical-authority]

# Dependency graph
requires: []
provides:
  - "Internal cross-links woven into 5 agent cluster posts (building-smarter, business-processes, curry-agents, linear-agentics, locking-down-agents)"
  - "Each post links to at least 2 other agent posts using /posts/{slug} format"
affects: [seo-audit, content-strategy]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Contextual inline linking — links woven into prose or as brief follow-up sentences, never as Related Posts sections"]

key-files:
  created: []
  modified:
    - site/src/data/blog/building-smarter-ai-agents-with-ideas-from-philosophy.md
    - site/src/data/blog/business-processes.md
    - site/src/data/blog/curry-agents.md
    - site/src/data/blog/linear-agentics.md
    - site/src/data/blog/locking-down-agents.md

key-decisions:
  - "building-smarter already had 3 /posts/ links in a footer section; added one inline link in section 3 body to ensure body-level cross-linking"
  - "locking-down-agents links placed on separate lines to satisfy grep -c count (>= 2 matching lines, not just occurrences)"
  - "business-processes links to building-smarter (epistemic/BDI) and linear-agentics (FSM type safety) — both thematically motivated"

patterns-established:
  - "Internal links: use /posts/{slug} format, woven into prose, never as a dedicated Related Posts section"
  - "Short posts (locking-down-agents): append brief follow-up sentences rather than altering existing prose"

requirements-completed: [Ad-hoc-3]

# Metrics
duration: 4min
completed: 2026-03-23
---

# Phase 8 Plan 02: Agent Cluster Internal Linking Summary

**5 agent posts cross-linked into a topical cluster with contextual inline links using /posts/{slug} format, strengthening topical authority for the ai-agents tag.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-23T11:20:04Z
- **Completed:** 2026-03-23T11:24:50Z
- **Tasks:** 1
- **Files modified:** 5

## Accomplishments

- Added contextual cross-links to all 5 agent posts; each now has >= 2 lines containing /posts/ links
- Links are woven into existing prose or appended as brief follow-up sentences — no "Related Posts" sections added
- Build passes cleanly after all edits
- Slug reference table used correctly (business-processes.md -> notes-on-agentic-applications-in-business-processes, curry-agents.md -> currying-agents, etc.)

## Task Commits

1. **Task 1: Add cross-links to first 5 agent posts** - `ba9a20a` (feat)

## Files Created/Modified

- `site/src/data/blog/building-smarter-ai-agents-with-ideas-from-philosophy.md` - Added inline link to /posts/locking-down-agents in section 3 (rules layer body text)
- `site/src/data/blog/business-processes.md` - Added links to /posts/linear-agentics (FSMs section) and /posts/building-smarter-ai-agents-with-ideas-from-philosophy (combining section)
- `site/src/data/blog/curry-agents.md` - Added links to /posts/notes-on-agentic-applications-in-business-processes (multi-stage section) and /posts/context-context-context (lazy evaluation point)
- `site/src/data/blog/linear-agentics.md` - Added links to /posts/locking-down-agents (sandboxing paragraph) and /posts/notes-on-agentic-applications-in-business-processes (path forward section)
- `site/src/data/blog/locking-down-agents.md` - Appended two follow-up sentences linking to /posts/linear-agentics and /posts/cloud-llms-in-prod

## Decisions Made

- building-smarter already had 3 footer links to /posts/ URLs; added one link in section 3 body prose so the post has body-level cross-linking (not only footer)
- locking-down-agents is very short (1 paragraph + 1 sentence); follow-up sentences appended as separate paragraph to ensure grep -c returns >= 2
- Chose building-smarter as second link for business-processes rather than markov-chains (more thematically direct — BDI epistemic design maps to the FSM+agent design pattern)

## Deviations from Plan

None - plan executed exactly as written. The note about building-smarter already having links was accounted for in the plan itself; the decision to add a body-level link follows the plan's guidance.

## Issues Encountered

- `grep -c '/posts/' locking-down-agents.md` returned 1 even though 2 links were present, because both were on the same line. Fixed by splitting the follow-up sentences onto separate lines. Build continued to pass.

## Self-Check

- [x] All 5 blog files modified and committed (ba9a20a)
- [x] Each file has >= 2 grep -c matches for /posts/
- [x] No "Related Posts" or "See Also" headings added
- [x] Build passes (pnpm build exits 0)

## Next Phase Readiness

- Agent cluster internal linking complete for all 9 agent posts (this plan: 5 posts; plan 08-03 already ran for the remaining 4)
- Ready for phase 08-03 final verification or any remaining structured data work

---
*Phase: 08-structured-data-e-e-a-t*
*Completed: 2026-03-23*
