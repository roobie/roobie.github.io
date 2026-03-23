# Phase 8: Structured Data & E-E-A-T - Research

**Researched:** 2026-03-23
**Domain:** JSON-LD structured data (schema.org), E-E-A-T signals, internal linking
**Confidence:** HIGH

## Summary

Phase 8 is a targeted content and markup editing phase with three independent workstreams: (1) adding two JSON-LD fields to the existing `structuredData` object in `Layout.astro`, (2) expanding 15 lines of content in `about.md`, and (3) inserting contextual inline links into the bodies of 9 blog posts. No new components, routes, or build infrastructure is involved. All decisions are locked in CONTEXT.md.

The JSON-LD work is trivial TypeScript object surgery — the existing `structuredData` block already uses spread syntax for optional fields, and the two new fields (`publisher`, `mainEntityOfPage`) follow identical patterns. The about page expansion is pure markdown prose with no layout changes. The cross-linking work is the most laborious part: 9 posts each need at least 2 natural inline links to other posts in the cluster, requiring careful reading of each post to find contextually appropriate anchor points.

**Primary recommendation:** Implement in three isolated plans — JSON-LD (1 file), about page (1 file), cross-links (9 files). The cross-link plan requires a pre-computed link matrix to guide the implementer.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Publisher Schema
- Add `publisher` field to the existing BlogPosting JSON-LD in Layout.astro
- Publisher type: `Person` (personal blog, not an organization)
- Publisher name: `Björn Roberg`
- Publisher URL: `https://bjro.dev/`
- Also add `mainEntityOfPage` field with `@type: WebPage` and `@id` set to the canonical URL — recommended by Google for BlogPosting

#### About Page Expansion
- Expand the existing `/about` page (site/src/pages/about.md) — do not create a new page
- Add explicit expertise areas: AI agents, developer tooling, software architecture, Rust/TypeScript/Go
- Highlight open-source projects: casq (content-addressable storage), cairn (append-only event store), slog (structured logger)
- Link each project to its blog post and/or repo
- Keep the existing casual tone — match the current voice ("I spend my days building systems...")
- Keep the CC BY 4.0 license notice and AstroPaper attribution at the bottom

#### Internal Cross-Linking
- Add inline contextual links within the body of agent-related posts where naturally relevant
- Each of the 9 agent posts must link to at least 2 other agent posts (per success criteria)
- Use natural contextual links, not a "Related Posts" widget or footer section
- Only agent posts are in scope — other posts are not required to cross-link
- The 9 agent posts are: building-smarter-ai-agents-with-ideas-from-philosophy, business-processes, curry-agents, linear-agentics, locking-down-agents, markov-chains-with-llms, markymarkov, mindmap, trust-1

### Claude's Discretion
- Exact placement of cross-links within post body (wherever the reference is most natural)
- Whether to add WebSite schema for the homepage (nice-to-have from Phase 5 deferred)
- Exact wording of expertise bullet points on about page

### Deferred Ideas (OUT OF SCOPE)
- WebSite schema for homepage (nice-to-have from Phase 5)
- Person/ProfilePage schema for about page (nice-to-have)
- Cross-linking for non-agent posts (Phase 10 content strategy)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| Ad-hoc-1 | JSON-LD `BlogPosting` schema includes a `publisher` field with name and URL | Layout.astro structuredData block at lines 37-55; spread pattern already used for optional fields |
| Ad-hoc-2 | An `/about` page exists with author bio, areas of expertise (AI agents, dev tooling), and links to open-source projects (casq, cairn, slog) | site/src/pages/about.md is 15 lines; AboutLayout.astro requires no changes |
| Ad-hoc-3 | Agent-related posts (9+ posts) contain internal cross-links to related posts in the cluster | All 9 posts read; link matrix documented in Cross-Link Matrix section below |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| schema.org | N/A (vocabulary) | Structured data vocabulary | Google's preferred vocabulary for rich results |
| JSON-LD | inline script | Structured data format | Google's recommended format (over Microdata/RDFa) |

No npm packages are added in this phase. All changes are to existing Astro/Markdown files.

### Existing Infrastructure (already in place)
| Asset | Location | Role |
|-------|----------|------|
| `structuredData` object | `Layout.astro` lines 37-55 | Emits BlogPosting JSON-LD when `pubDatetime` is truthy |
| `SITE.author` | `config.ts` line 2 | Source of truth: `"Björn Roberg"` |
| `SITE.profile` | `config.ts` line 3 | Source of truth: `"https://bjro.dev/"` |
| `SITE.website` | `config.ts` line 1 | Source of truth: `"https://bjro.dev/"` |
| `canonicalURL` | `Layout.astro` line 28 | Already computed; use as `@id` in `mainEntityOfPage` |
| `about.md` | `site/src/pages/about.md` | 15-line page; expand prose only |
| `AboutLayout.astro` | `site/src/layouts/AboutLayout.astro` | No changes needed |

## Architecture Patterns

### Pattern 1: Spread Syntax for Optional JSON-LD Fields (ESTABLISHED)
**What:** The existing `structuredData` object uses spread syntax to conditionally add fields. Both new fields are unconditional (always present when `pubDatetime` is truthy).
**When to use:** Both `publisher` and `mainEntityOfPage` should be added as plain object properties (no spread needed — they are always present on blog posts).

**Existing pattern (lines 37-55 of Layout.astro):**
```typescript
const structuredData = pubDatetime
  ? {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      image: `${socialImageURL}`,
      datePublished: pubDatetime.toISOString(),
      ...(modDatetime && { dateModified: modDatetime.toISOString() }),
      description: description,
      ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
      author: [
        {
          "@type": "Person",
          name: author,
          ...(profile && { url: profile }),
        },
      ],
    }
  : null;
```

**New fields to add (after the existing `author` array):**
```typescript
      publisher: {
        "@type": "Person",
        name: SITE.author,
        url: SITE.website,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${canonicalURL}`,
      },
```

**Note:** Use `SITE.author` and `SITE.website` directly (they are imported at the top of Layout.astro already). `canonicalURL` is already in scope as a `const` at line 28. Use template literal `${canonicalURL}` to coerce the URL object to string, consistent with how `socialImageURL` is handled at line 43.

### Pattern 2: About Page Markdown Structure
**What:** `about.md` uses frontmatter `layout` and `title` only. The body is plain markdown prose rendered by `AboutLayout.astro` inside `.app-prose`. No shortcodes or special syntax.
**When to use:** Add sections using standard markdown (paragraphs, bold, links). Do not use HTML.

**Current content (5 prose lines):**
```markdown
I'm Björn Roberg, a software developer based in Sweden. I spend my days building
systems that have to work reliably, and my spare time wondering why they don't.
I write here to slow down my thinking — to examine ideas about technology,
epistemology, and how we reason about complex things. If any of it is useful to
you, great; if it starts a conversation, even better.
```

**Expansion points:** Add expertise section and open-source project section between the existing intro paragraph and the license notice. Keep the license and AstroPaper attribution as the final two lines.

### Pattern 3: Internal Links in Markdown Posts
**What:** Markdown links use relative paths with the `/posts/` prefix. Example from `building-smarter-ai-agents-with-ideas-from-philosophy.md` "Where to Go Next" section (line 433):
```markdown
See [Locking down agents](/posts/locking-down-agents) for practical safety patterns.
```
**When to use:** All cross-links in the 9 agent posts should use `/posts/{slug}` format.

**Slug reference table (from frontmatter):**
| Post file | slug |
|-----------|------|
| building-smarter-ai-agents-with-ideas-from-philosophy.md | `building-smarter-ai-agents-with-ideas-from-philosophy` |
| business-processes.md | `notes-on-agentic-applications-in-business-processes` |
| curry-agents.md | `currying-agents` |
| linear-agentics.md | `linear-agentics` |
| locking-down-agents.md | `locking-down-agents` |
| markov-chains-with-llms.md | `markov-chains-and-llms-hybrid-architectures` |
| markymarkov.md | `markymarkov` |
| mindmap.md | `context-context-context` |
| trust-1.md | `cloud-llms-in-prod` |

### Anti-Patterns to Avoid
- **Using `SITE.profile` for publisher URL instead of `SITE.website`:** Both are `"https://bjro.dev/"` currently, but `publisher` should use `SITE.website` (the site's canonical URL) to mirror the pattern in CONTEXT.md specifics.
- **Coercing `canonicalURL` with `.toString()`:** Use template literal `${canonicalURL}` to match existing pattern in the file (line 43 uses `${socialImageURL}`).
- **Adding a "Related Posts" footer section to blog posts:** CONTEXT.md requires inline contextual links only — not widget-style related posts sections.
- **Creating a new about page:** The existing `site/src/pages/about.md` must be expanded in-place.
- **Changing AboutLayout.astro:** The layout renders markdown body unchanged; no layout edits are needed.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Publisher type for personal blog | Custom org wrapper | `Person` schema type directly | Google accepts Person as publisher; Organization is conventional but not required |
| Link discovery for cross-posts | Script to auto-generate links | Manual contextual links | Links must be semantically placed where the reference is natural to the reader |

## Cross-Link Matrix

This matrix documents the minimum required links (at least 2 per post) for the cross-linking plan. Based on reading all 9 posts, here are the natural thematic connections:

### Posts Already with Cross-Links (partial)
`building-smarter-ai-agents-with-ideas-from-philosophy.md` already has links in its "Where to Go Next" section:
- `/posts/locking-down-agents` (line 433)
- `/posts/introducing-casq` (line 435) — not an agent post, but present
- `/posts/notes-on-agentic-applications-in-business-processes` (line 437)

This post has 2 links to agent posts already. Verify it meets the requirement (links to `locking-down-agents` and `business-processes` cluster posts).

### Required Links by Post

**building-smarter-ai-agents-with-ideas-from-philosophy** (philosophy, BDI, epistemic norms)
- Already links to: `locking-down-agents`, `notes-on-agentic-applications-in-business-processes`
- Status: Already meets 2-link minimum — verify existing links are inline, not just footer

**notes-on-agentic-applications-in-business-processes** (Temporal, FSMs, MCP)
- Natural links to: `linear-agentics` (linear types relate to FSM state enforcement), `markov-chains-and-llms-hybrid-architectures` (FSMs discussed in both), `building-smarter-ai-agents-with-ideas-from-philosophy` (epistemic agent context)
- Add minimum 2 inline links

**currying-agents** (partial application, composable agents)
- Natural links to: `notes-on-agentic-applications-in-business-processes` (multi-stage pipelines), `building-smarter-ai-agents-with-ideas-from-philosophy` (progressive context building relates to BDI), `context-context-context` (context management)
- Add minimum 2 inline links

**linear-agentics** (linear types, agent safety, resource constraints)
- Natural links to: `locking-down-agents` (both are safety posts), `notes-on-agentic-applications-in-business-processes` (production safety)
- Add minimum 2 inline links

**locking-down-agents** (sandboxing, blast radius)
- Short post (~1 paragraph). Natural links to: `linear-agentics` (provable safety is the complement), `cloud-llms-in-prod` (trust boundary relates to blast radius)
- Add minimum 2 inline links (the post is short — links will need to go in the main paragraph)

**markov-chains-and-llms-hybrid-architectures** (Markov + LLM hybrid state machines)
- Natural links to: `notes-on-agentic-applications-in-business-processes` (FSMs for agents), `markymarkov` (MarkyMarkov is the practical tool from this theory), `building-smarter-ai-agents-with-ideas-from-philosophy` (state-based agent design)
- Add minimum 2 inline links

**markymarkov** (MarkyMarkov tool, Markov chain code guidance)
- Natural links to: `markov-chains-and-llms-hybrid-architectures` (theoretical basis), `context-context-context` (MINDMAP is a complementary context tool)
- Add minimum 2 inline links

**mindmap (context-context-context)** (MINDMAP format, agent context management)
- Natural links to: `building-smarter-ai-agents-with-ideas-from-philosophy` (belief stores and world models), `currying-agents` (context accumulation), `markymarkov` (complementary tool)
- Add minimum 2 inline links

**trust-1 (cloud-llms-in-prod)** (trust boundaries, data leakage to cloud LLMs)
- Natural links to: `locking-down-agents` (sandboxing is one mitigation), `linear-agentics` (provable safety and unforgeable credentials address the same class of problem)
- Add minimum 2 inline links

## Common Pitfalls

### Pitfall 1: Stringifying the `canonicalURL` URL object
**What goes wrong:** `canonicalURL` is typed as `URL | string` in Layout.astro (line 28 assigns `new URL(...)`). Embedding it directly in an object literal will produce `[object URL]` in the serialized JSON.
**Why it happens:** URL objects don't auto-stringify in object literals.
**How to avoid:** Use template literal: `"@id": \`${canonicalURL}\`` — consistent with how `socialImageURL` is handled at line 43.
**Warning signs:** JSON-LD output contains `[object URL]` in the `@id` field.

### Pitfall 2: Using `SITE.profile` instead of `SITE.profile` / `SITE.website` confusion
**What goes wrong:** `SITE.profile` and `SITE.website` are currently both `"https://bjro.dev/"`, so either works today, but they are semantically different — `profile` is the author URL, `website` is the site URL.
**How to avoid:** Per CONTEXT.md specifics, use `SITE.website` for publisher URL (the publisher is the site entity). Use `SITE.author` for publisher name.

### Pitfall 3: Broken slug references in cross-links
**What goes wrong:** File names do not always match slugs. Example: `business-processes.md` has slug `notes-on-agentic-applications-in-business-processes`. Using the filename as the URL will produce a 404.
**How to avoid:** Use the slug reference table in the Architecture Patterns section above. The `/posts/{slug}` URL pattern is used by the Astro site for all blog post routes.

### Pitfall 4: Over-expanding the about page
**What goes wrong:** Adding too much content or changing the casual, direct voice that characterizes the existing writing.
**How to avoid:** The existing intro paragraph sets the tone: short, direct, personally voiced. New sections should match this register. Bullet points for expertise are acceptable but should be terse.

### Pitfall 5: Adding JSON-LD to non-post pages
**What goes wrong:** The `publisher` and `mainEntityOfPage` fields are inside the `pubDatetime ? { ... } : null` ternary. They will only appear on blog post pages, which is correct.
**How to avoid:** No change needed — the conditional gate is already in place. Do not move these fields outside the ternary.

## Code Examples

### Publisher + mainEntityOfPage addition to structuredData

```typescript
// Source: Layout.astro lines 37-55 (existing pattern) + schema.org spec
const structuredData = pubDatetime
  ? {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      image: `${socialImageURL}`,
      datePublished: pubDatetime.toISOString(),
      ...(modDatetime && { dateModified: modDatetime.toISOString() }),
      description: description,
      ...(tags && tags.length > 0 && { keywords: tags.join(", ") }),
      author: [
        {
          "@type": "Person",
          name: author,
          ...(profile && { url: profile }),
        },
      ],
      publisher: {
        "@type": "Person",
        name: SITE.author,
        url: SITE.website,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${canonicalURL}`,
      },
    }
  : null;
```

### About page expanded structure (conceptual)

```markdown
---
layout: ../layouts/AboutLayout.astro
title: "About"
---

[existing intro paragraph — keep verbatim]

**What I work on**

[2-3 sentence expansion of expertise: AI agents, developer tooling, software architecture, Rust/TypeScript/Go]

**Open-source projects**

- [casq](/posts/introducing-casq) — content-addressable storage queue
- [cairn](/posts/introducing-cairn) — append-only event store
- [slog](/posts/introducing-slog) — structured logger

[Keep CC BY 4.0 license notice]

[Keep AstroPaper attribution]
```

### Inline cross-link example (markdown)

```markdown
// In locking-down-agents.md — appending to existing paragraph
...Running agents inside containers or VMs with limited filesystem access, scoped
credentials, and constrained networking shrinks the blast radius when (not if)
something goes wrong. For a type-system-level approach that makes resource limits
statically provable, see [Linear Types for Agent Safety](/posts/linear-agentics).
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `publisher: { "@type": "Organization" }` | `publisher: { "@type": "Person" }` for personal blogs | No formal change; contextual best practice | Google accepts both; Person is more accurate for solo blogs |
| Separate `author` and `publisher` objects | Can share the same Person object | N/A | For personal blogs, author and publisher are the same person; keeping them as separate objects is fine and explicit |

**Google's current documented position (2026):** No properties are technically *required* for BlogPosting JSON-LD to be valid. Recommended properties include `headline`, `image`, `datePublished`, `author`. `publisher` and `mainEntityOfPage` are recommended best practices that improve E-E-A-T signals but are not validated as errors if absent.

## Open Questions

1. **WebSite schema for homepage (Claude's discretion)**
   - What we know: Phase 5 deferred this; CONTEXT.md leaves it to Claude's discretion
   - What's unclear: Whether adding it in this phase is worth the scope creep
   - Recommendation: Do not add WebSite schema in this phase — keep Phase 8 scoped to the three deliverables. Defer to Phase 10 or a separate quick task.

2. **locking-down-agents.md is very short (~1 paragraph)**
   - What we know: The post is 19 lines total, single paragraph. Adding 2 inline links requires embedding them in that paragraph or adding a brief follow-up sentence.
   - What's unclear: Whether adding a closing sentence will feel natural or tacked-on
   - Recommendation: Add one link inline within the existing paragraph and one follow-up sentence at the end: "For a type-system approach to the same problem, see [Linear Types for Agent Safety](/posts/linear-agentics)."

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None — no automated test suite configured for this Astro project |
| Config file | none |
| Quick run command | `cd site && pnpm build` (type-checks and builds) |
| Full suite command | `cd site && pnpm build && pnpm lint` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| Ad-hoc-1 | JSON-LD output contains publisher and mainEntityOfPage fields | manual | `cd site && pnpm build` then inspect built HTML | ✅ build exists |
| Ad-hoc-2 | /about page renders expertise and project links | manual smoke | `cd site && pnpm build` then inspect site/dist/about/index.html | ✅ build exists |
| Ad-hoc-3 | Agent posts contain internal links to other agent posts | manual | grep each post file for `/posts/` links | ✅ files exist |

### Sampling Rate
- **Per task commit:** `cd site && pnpm build` — verifies TypeScript type safety and that JSON-LD object compiles
- **Per wave merge:** `cd site && pnpm build && pnpm lint`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
None — no test framework setup needed. Validation is build-time type checking plus manual inspection of built HTML.

**JSON-LD spot-check command (after build):**
```bash
grep -o '"@type":"BlogPosting"[^}]*' site/dist/posts/*/index.html | head -5
```
Or more readably, inspect any built post's `<script type="application/ld+json">` tag.

## Sources

### Primary (HIGH confidence)
- `site/src/layouts/Layout.astro` lines 37-55 — existing structuredData implementation; confirmed spread pattern and available variables
- `site/src/config.ts` — `SITE.author`, `SITE.profile`, `SITE.website` values confirmed
- `site/src/pages/about.md` — current content confirmed (5 lines, casual voice)
- All 9 agent post .md files — read and mapped for cross-link opportunities
- `site/src/layouts/AboutLayout.astro` — confirmed no changes needed

### Secondary (MEDIUM confidence)
- [Google Article Structured Data documentation](https://developers.google.com/search/docs/appearance/structured-data/article) — confirmed `publisher` and `mainEntityOfPage` are recommended (not required); confirmed Person type is accepted for author/publisher
- [schema.org/BlogPosting](https://schema.org/BlogPosting) — vocabulary reference

### Tertiary (LOW confidence)
- General web search results on BlogPosting JSON-LD best practices — confirmed community consensus on Person vs Organization for personal blogs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; confirmed all existing assets
- Architecture: HIGH — existing code patterns fully read and understood
- Pitfalls: HIGH — all identified from direct code inspection, not assumption
- Cross-link matrix: MEDIUM — based on reading post content; exact placement is Claude's discretion

**Research date:** 2026-03-23
**Valid until:** Stable — this phase edits static files with no external API dependencies. Research does not expire.
