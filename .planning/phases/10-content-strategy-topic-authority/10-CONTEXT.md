# Phase 10: Content Strategy — Topic Authority - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Publish one comparison/roundup post and enhance the AI agents tag page to serve as a topic landing page. SC-3 (systematic cross-linking) is already resolved by Phase 8.

</domain>

<decisions>
## Implementation Decisions

### Comparison Post: Dev Environment Tool Roundup
- **Topic:** Developer environment tooling — mise, direnv, just, and task
- **Angle:** Neutral feature comparison (not first-person "my setup" or opinionated recommendation)
- **Scope:** Outline with high-level comparison points and a starter comparison table — the user will write the prose
- **Tools compared:** mise (version management + task runner), direnv (env var management), just (command runner), task (command runner)
- **Structure:** Intro → one section per tool category (version management, env vars, task running) → comparison table → conclusion
- **Cross-links:** Link to existing mise post; link to any relevant agent posts if tools intersect with agent workflows
- **Tags:** `developer-tools`, `cli`, `comparison`
- **The post should be created as `draft: true`** — the user will finalize and publish

### Topic Landing Page: AI Agents Series Index
- **Approach:** Enhance the existing `/tags/ai-agents` tag page with an intro paragraph and suggested reading order
- **Implementation:** Simple — add a tag description or series intro that appears at the top of the ai-agents tag page
- **Content:** Brief intro (2-3 sentences) positioning the cluster + numbered reading order for the 9 agent posts
- **No new page needed** — leverage the existing tag page infrastructure

### Already Resolved (No Action Needed)
- SC-3 (internal linking): All 9 agent posts already have 2+ cross-links from Phase 8

### Claude's Discretion
- Exact comparison table columns and structure
- Reading order for the agent posts on the landing page
- Whether to add tag descriptions to other clusters (developer-tools, etc.) — nice-to-have

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Post (for cross-linking)
- `site/src/data/blog/mise.md` — Existing mise post to link from the comparison

### Tag Page Infrastructure
- `site/src/pages/tags/[tag]/[...page].astro` — Tag page template (where intro text would be added)
- `site/src/utils/getPostsByTag.ts` — How posts are filtered by tag (if exists)

### Blog Post Schema
- `site/src/content.config.ts` — Frontmatter schema (title, description, tags, draft, etc.)
- `CLAUDE.md` — Blog post conventions, frontmatter requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Blog post template: standard frontmatter schema with tags, description, draft fields
- Tag pages: auto-generated from post tags via `[tag]/[...page].astro`
- The 9 agent posts already use `ai-agents` tag consistently (Phase 7)

### Established Patterns
- Posts go in `site/src/data/blog/` as `.md` files
- Draft posts use `draft: true` in frontmatter
- Tags drive the tag page URLs automatically

### Integration Points
- New comparison post: create `.md` file in blog directory with correct frontmatter
- Tag page enhancement: modify the tag page template to support per-tag descriptions/intros

</code_context>

<specifics>
## Specific Ideas

- Comparison table should cover: language/runtime support, env var management, task running, config format, community size, "polyglot?" column
- The tag page intro for ai-agents should position it as "a series exploring how to build reliable, interpretable AI agents"
- Reading order: start with the philosophy post, then the architectural patterns (linear types, Markov chains), then practical posts (currying agents, business processes), then meta posts (context, trust)

</specifics>

<deferred>
## Deferred Ideas

- Tag descriptions for other clusters (developer-tools, linux, etc.) — future enhancement
- Full "tools I use" post — could be its own post separate from the comparison
- Agent orchestration comparison post (Temporal vs Inngest) — different topic, future phase

</deferred>

---

*Phase: 10-content-strategy-topic-authority*
*Context gathered: 2026-03-23*
