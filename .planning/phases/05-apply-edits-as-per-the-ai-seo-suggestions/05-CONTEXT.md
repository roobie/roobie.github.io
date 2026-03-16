# Phase 5: Apply edits as per the AI SEO suggestions - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning
**Source:** AI SEO audit conversation

<domain>
## Phase Boundary

This phase applies AI search optimization improvements to make the Cogitate blog more discoverable and citable by AI systems (Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini). All changes are code/content-level in the existing Astro site. No new dependencies needed.

</domain>

<decisions>
## Implementation Decisions

### Structured Data Fix (Priority 1)
- BlogPosting JSON-LD is currently emitted on ALL pages (including homepage, about, tags, search) — it should only emit on actual blog post pages
- When `pubDatetime` is undefined (non-post pages), the current code outputs `"datePublished": "undefined"` which is invalid
- Fix: Only emit BlogPosting JSON-LD when `pubDatetime` is truthy
- Add `description` field to the BlogPosting structured data object
- Optionally add `keywords` from the post's tags array

### Missing og:type Meta Tag (Priority 3)
- Add `<meta property="og:type" content="article" />` for blog posts
- Add `<meta property="og:type" content="website" />` for non-post pages

### Article OG Tags (Priority 7)
- Add `article:author` (the author's profile URL) for post pages
- Add `article:tag` (one per tag) for post pages

### Claude's Discretion
- Whether to add WebSite schema for the homepage or Person/ProfilePage schema for the about page (nice-to-have, not required)
- Exact implementation approach for conditionally rendering structured data (could be done in Layout.astro with conditionals, or split into separate layout components)

</decisions>

<specifics>
## Specific Ideas

- The structured data fix is in `site/src/layouts/Layout.astro` lines 35-49 (the `structuredData` object and its JSON-LD script tag)
- The og:type tag should be added near the existing OG meta tags around line 82-86
- article:author and article:tag should be added near the existing article:published_time/modified_time tags around lines 88-103
- All changes are in Layout.astro — this is a single-file fix

</specifics>

<deferred>
## Deferred Ideas (Content-Level, Not Code)

These are editorial recommendations from the audit that don't belong in a code phase:
- Strengthen post openings (substance first, preamble second) — per-post editorial work
- Query-matching headings on technical posts — per-post editorial work
- Enrich About page with expertise signals — content decision for the author
- Make tags more semantically specific — content taxonomy decision

</deferred>

---

*Phase: 05-apply-edits-as-per-the-ai-seo-suggestions*
*Context gathered: 2026-03-16 via AI SEO audit*
