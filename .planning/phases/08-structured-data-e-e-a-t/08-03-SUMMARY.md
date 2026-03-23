---
phase: 08-structured-data-e-e-a-t
plan: 03
subsystem: content
tags: [internal-linking, seo, ai-agents, topical-authority]

# Dependency graph
requires:
  - phase: 08-structured-data-e-e-a-t
    provides: Phase 08-02 cross-links on first 5 agent posts; slug reference table
provides:
  - Cross-links added to remaining 4 agent posts (markov-chains-with-llms, markymarkov, mindmap, trust-1)
  - All 9 agent posts now meet the 2-link minimum requirement
affects: [phase-10-content-strategy, seo-topical-authority]

# Tech tracking
tech-stack:
  added: []
  patterns: [Inline contextual links using /posts/{slug} format woven into prose]

key-files:
  created: []
  modified:
    - site/src/data/blog/markov-chains-with-llms.md
    - site/src/data/blog/markymarkov.md
    - site/src/data/blog/mindmap.md
    - site/src/data/blog/trust-1.md

key-decisions:
  - "markov-chains-with-llms links to markymarkov (practical implementation) and notes-on-agentic (ideal use case)"
  - "markymarkov links to markov-chains-and-llms-hybrid-architectures (theory) and context-context-context (complementary tool)"
  - "mindmap links to building-smarter (world models) and currying-agents (progressive context)"
  - "trust-1 links to locking-down-agents (sandboxing mitigation) and linear-agentics (capability tokens)"

patterns-established:
  - "Cross-links woven into existing sentences or appended as brief follow-up sentences, not as sections"

requirements-completed: [Ad-hoc-3]

# Metrics
duration: 3min
completed: 2026-03-23
---

# Phase 8 Plan 03: Cross-Links to Remaining 4 Agent Posts Summary

**Contextual inline links added to the final 4 agent posts, completing the 9-post topical cluster with 2+ cross-links per post**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-23T11:20:08Z
- **Completed:** 2026-03-23T11:22:40Z
- **Tasks:** 1
- **Files modified:** 4

## Accomplishments

- Added 2 contextual inline links to markov-chains-with-llms.md (to markymarkov and notes-on-agentic)
- Added 2 contextual inline links to markymarkov.md (to markov-chains-and-llms-hybrid-architectures and context-context-context)
- Added 2 contextual inline links to mindmap.md (to building-smarter-ai-agents-with-ideas-from-philosophy and currying-agents)
- Added 2 contextual inline links to trust-1.md (to locking-down-agents and linear-agentics)
- All links woven into existing prose or appended as natural follow-up sentences; no "Related Posts" sections added
- Build passes cleanly

## Task Commits

Each task was committed atomically:

1. **Task 1: Add cross-links to remaining 4 agent posts** - `7ccb2e2` (feat)

**Plan metadata:** _(to be added in final commit)_

## Files Created/Modified

- `site/src/data/blog/markov-chains-with-llms.md` - Added links to markymarkov and notes-on-agentic (Ideal Use Cases section)
- `site/src/data/blog/markymarkov.md` - Added links to markov-chains-and-llms-hybrid-architectures (intro) and context-context-context (conclusion)
- `site/src/data/blog/mindmap.md` - Added links to building-smarter (paragraph 3) and currying-agents (multi-agent paragraph)
- `site/src/data/blog/trust-1.md` - Added links to locking-down-agents (blind-spot section) and linear-agentics (closing)

## Decisions Made

- markov-chains-with-llms: linked markymarkov in "Benefit" callout after state transitions section (most natural anchor — MarkyMarkov is the practical implementation of this theory); linked notes-on-agentic inside the Ideal Use Cases bullet (agentic business processes are a textbook structured-task use case)
- markymarkov: linked the theory post (markov-chains-and-llms-hybrid-architectures) in the opening paragraph's "what is it" sentence; linked context-context-context in the conclusion as a complementary tool pairing
- mindmap: linked building-smarter in paragraph 3 where world models and belief stores are implied; linked currying-agents near the multi-agent collaboration paragraph where progressive context accumulation is discussed
- trust-1: linked locking-down-agents at the "blind spot in your security model" section; linked linear-agentics in the closing paragraph as an architectural complement

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 9 agent posts now cross-link to at least 2 other agent posts in the cluster
- Requirement Ad-hoc-3 fully satisfied
- Phase 08 is now complete (plans 01, 02, 03 all done)
- Phase 09 (technical polish) is unblocked

## Self-Check: PASSED

- Files confirmed present: markov-chains-with-llms.md, markymarkov.md, mindmap.md, trust-1.md
- Task commit confirmed: 7ccb2e2

---
*Phase: 08-structured-data-e-e-a-t*
*Completed: 2026-03-23*
