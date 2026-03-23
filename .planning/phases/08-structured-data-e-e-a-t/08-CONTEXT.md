# Phase 8: Structured Data & E-E-A-T - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning
**Source:** Auto-selected defaults from SEO audit findings

<domain>
## Phase Boundary

Strengthen JSON-LD structured data for Google rich results and add author credibility (E-E-A-T) signals. Three deliverables: publisher field in BlogPosting schema, expanded about page with expertise and project links, and internal cross-links between agent-related posts.

</domain>

<decisions>
## Implementation Decisions

### Publisher Schema
- Add `publisher` field to the existing BlogPosting JSON-LD in Layout.astro
- Publisher type: `Person` (personal blog, not an organization)
- Publisher name: `Björn Roberg`
- Publisher URL: `https://bjro.dev/`
- Also add `mainEntityOfPage` field with `@type: WebPage` and `@id` set to the canonical URL — recommended by Google for BlogPosting

### About Page Expansion
- Expand the existing `/about` page (site/src/pages/about.md) — do not create a new page
- Add explicit expertise areas: AI agents, developer tooling, software architecture, Rust/TypeScript/Go
- Highlight open-source projects: casq (content-addressable storage), cairn (append-only event store), slog (structured logger)
- Link each project to its blog post and/or repo
- Keep the existing casual tone — match the current voice ("I spend my days building systems...")
- Keep the CC BY 4.0 license notice and AstroPaper attribution at the bottom

### Internal Cross-Linking
- Add inline contextual links within the body of agent-related posts where naturally relevant
- Each of the 9 agent posts must link to at least 2 other agent posts (per success criteria)
- Use natural contextual links, not a "Related Posts" widget or footer section
- Only agent posts are in scope — other posts are not required to cross-link
- The 9 agent posts are: building-smarter-ai-agents-with-ideas-from-philosophy, business-processes, curry-agents, linear-agentics, locking-down-agents, markov-chains-with-llms, markymarkov, mindmap, trust-1

### Claude's Discretion
- Exact placement of cross-links within post body (wherever the reference is most natural)
- Whether to add WebSite schema for the homepage (nice-to-have from Phase 5 deferred)
- Exact wording of expertise bullet points on about page

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Structured Data
- `site/src/layouts/Layout.astro` — Lines 37-55: existing BlogPosting JSON-LD (add publisher and mainEntityOfPage here)
- `.planning/phases/05-apply-edits-as-per-the-ai-seo-suggestions/05-CONTEXT.md` — Phase 5 decisions: pubDatetime as discriminator, og:type logic

### About Page
- `site/src/pages/about.md` — Current about page content (5 lines, needs expansion)
- `site/src/layouts/AboutLayout.astro` — Layout used by the about page

### Agent Posts (for cross-linking)
- `site/src/data/blog/building-smarter-ai-agents-with-ideas-from-philosophy.md`
- `site/src/data/blog/business-processes.md`
- `site/src/data/blog/curry-agents.md`
- `site/src/data/blog/linear-agentics.md`
- `site/src/data/blog/locking-down-agents.md`
- `site/src/data/blog/markov-chains-with-llms.md`
- `site/src/data/blog/markymarkov.md`
- `site/src/data/blog/mindmap.md`
- `site/src/data/blog/trust-1.md`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Layout.astro` structured data block (lines 37-55): Already conditionally emits BlogPosting when pubDatetime is truthy — just needs publisher and mainEntityOfPage fields added
- `SITE.author` and `SITE.profile` in config.ts: Source of truth for author name and URL

### Established Patterns
- Phase 5 decision: pubDatetime as the single discriminator for post vs non-post page logic
- JSON-LD uses spread syntax for optional fields: `...(modDatetime && { dateModified: ... })`

### Integration Points
- Publisher field: Added to the existing structuredData object in Layout.astro
- About page: Edit existing about.md markdown content (no layout changes needed)
- Cross-links: Edit markdown body of 9 blog post files (frontmatter unchanged)

</code_context>

<specifics>
## Specific Ideas

- Publisher should mirror the author object structure for consistency: `{ "@type": "Person", "name": "Björn Roberg", "url": "https://bjro.dev/" }`
- mainEntityOfPage: `{ "@type": "WebPage", "@id": canonicalURL }` where canonicalURL is already computed in Layout.astro
- About page project links should go to the introducing-* blog posts, not external repos (keeps traffic on-site)

</specifics>

<deferred>
## Deferred Ideas

- WebSite schema for homepage (nice-to-have from Phase 5)
- Person/ProfilePage schema for about page (nice-to-have)
- Cross-linking for non-agent posts (Phase 10 content strategy)

</deferred>

---

*Phase: 08-structured-data-e-e-a-t*
*Context gathered: 2026-03-23 via auto-selected defaults*
