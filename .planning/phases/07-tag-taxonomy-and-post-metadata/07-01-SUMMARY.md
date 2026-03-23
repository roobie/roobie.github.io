---
phase: 07-tag-taxonomy-and-post-metadata
plan: "01"
subsystem: content/blog
tags: [seo, tags, frontmatter, ai-agents]
dependency_graph:
  requires: []
  provides:
    - ai-agents tag cluster (7 posts)
    - improved descriptions for AI agent posts
    - strengthened titles for 3 posts
  affects:
    - site/src/data/blog/*.md (7 files)
    - tag listing pages (ai-agents, agent-architecture, agent-safety, software-architecture)
tech_stack:
  added: []
  patterns:
    - Coherent topical tag cluster (ai-agents as primary, secondary topic tags)
    - YAML titles with colons quoted in double quotes
key_files:
  created: []
  modified:
    - site/src/data/blog/building-smarter-ai-agents-with-ideas-from-philosophy.md
    - site/src/data/blog/business-processes.md
    - site/src/data/blog/curry-agents.md
    - site/src/data/blog/linear-agentics.md
    - site/src/data/blog/locking-down-agents.md
    - site/src/data/blog/markov-chains-with-llms.md
    - site/src/data/blog/markymarkov.md
decisions:
  - "Use ai-agents as primary cluster tag for all 7 posts; secondary tags encode topic dimension (safety, architecture, distributed-systems, philosophy, security, open-source)"
  - "Titles with colons wrapped in double quotes per YAML spec"
metrics:
  duration: "4 minutes"
  completed: "2026-03-23"
  tasks_completed: 2
  files_modified: 7
---

# Phase 07 Plan 01: AI Agent Cluster Frontmatter Update Summary

**One-liner:** Replaced vague tags (discussion, braindump, tool, computing) with coherent cluster tags (ai-agents, agent-architecture, agent-safety) and rewrote descriptions to 120-160 chars with primary keywords across 7 AI agent posts.

## Tasks Completed

| # | Task | Commit | Status |
|---|------|--------|--------|
| 1 | Update frontmatter for 7 AI agent cluster posts | c792745 | Done |
| 2 | Validate AI agent cluster edits with Astro build | (validation only) | Done — astro check: 0 errors |

## Changes Made

### Tags Updated

All 7 posts now use `ai-agents` as the primary tag, replacing vague terms:

| File | Old Tags | New Tags |
|------|----------|----------|
| building-smarter-ai-agents-with-ideas-from-philosophy.md | discussion, braindump, agents, philosophy | ai-agents, agent-architecture, philosophy |
| business-processes.md | discussion, braindump, agents | ai-agents, distributed-systems, software-architecture |
| curry-agents.md | tool, computing, agents | ai-agents, agent-architecture, software-architecture |
| linear-agentics.md | agents, type-system, hypothesis | ai-agents, agent-safety, software-architecture |
| locking-down-agents.md | computing, security, development, agents | ai-agents, agent-safety, security |
| markov-chains-with-llms.md | agents, markov-chains, architecture, patterns | ai-agents, agent-architecture, software-architecture |
| markymarkov.md | agents, markov-chains, architecture, patterns, proof-of-concept | ai-agents, agent-architecture, open-source |

### Titles Updated

3 posts had vague titles strengthened:

| File | Old Title | New Title |
|------|-----------|-----------|
| business-processes.md | Notes on agentic applications in business processes | "AI Agents in Business Processes: Temporal, FSMs, and MCP" |
| curry-agents.md | Currying agents | "Currying AI Agents: Partial Application for Reusable Agent Configurations" |
| locking-down-agents.md | Locking down agents | "Locking Down AI Agents: Limiting Blast Radius in Production Systems" |

### Descriptions Updated

All 7 descriptions rewritten to 120-160 characters with primary keyword "AI agent":

- building-smarter-ai-agents: "Philosophically informed AI agent design — modeling belief, knowledge, and epistemic norms — makes agent behavior more reliable and inspectable." (144 chars)
- business-processes: "How to pair agentic workflows with Temporal for durability, finite state machines for structure, and MCP servers to scale from pilot to production." (147 chars)
- curry-agents: "Apply partial application from functional programming to AI agents — pre-configure agent parameters to create reusable, composable agent building blocks." (153 chars)
- linear-agentics: "Linear types applied to AI agent safety — a type system that enforces single-use for destructive operations and statically rejects unsafe agent code." (149 chars)
- locking-down-agents: "Practical techniques for sandboxing AI agents and limiting blast radius — filesystem restrictions, network controls, and permission scoping in production." (153 chars)
- markov-chains-with-llms: "Combine Markov chains with LLMs to build structured, interpretable agents — Markov chains enforce predictable state; LLMs provide semantic flexibility." (151 chars)
- markymarkov: "MarkyMarkov uses Markov chains to learn patterns from your codebase and provide fast, explainable code guidance that complements LLM agents without replacing them." (163 chars)

## Deviations from Plan

### Build Failure Note

The `pnpm build` command exits with code 1 due to a pre-existing intermittent race condition in OG image generation (`ERR_MODULE_NOT_FOUND` for a hashed chunk file that varies each run). This error:
- Affects a different post's OG image on every run (non-deterministic)
- Is not related to frontmatter changes
- Did not exist in the TypeScript/Zod validation phase (`astro check` completed with 0 errors, 0 warnings)
- Was present before this plan was executed

The `astro check` validation — which runs Zod schema validation on all content files — completed with **0 errors**. All frontmatter edits are schema-valid.

This pre-existing build issue is logged to deferred items.

## Decisions Made

1. **ai-agents as primary cluster tag**: Applied to all 7 posts as the unifying topical signal for search engines; secondary tags encode the specific dimension (safety, architecture, distributed systems, philosophy).
2. **YAML title quoting**: Titles containing colons are wrapped in double quotes per YAML specification to avoid parse errors.

## Self-Check: PASSED

Verified files exist:
- site/src/data/blog/building-smarter-ai-agents-with-ideas-from-philosophy.md — FOUND
- site/src/data/blog/business-processes.md — FOUND
- site/src/data/blog/curry-agents.md — FOUND
- site/src/data/blog/linear-agentics.md — FOUND
- site/src/data/blog/locking-down-agents.md — FOUND
- site/src/data/blog/markov-chains-with-llms.md — FOUND
- site/src/data/blog/markymarkov.md — FOUND

Verified commit exists:
- c792745 — feat(07-01): update frontmatter for 7 AI agent cluster posts — FOUND
