# Roadmap: roobie.github.io Content Production

## Overview

Three phases build an AI-assisted writing workflow on top of a blog that already works. Phase 1 creates the persistent context and idea capture that every session depends on. Phase 2 delivers the end-to-end path from idea to published post and validates the workflow on real content. Phase 3 tightens the workflow with post-type awareness and tag normalization, adding optional tooling only where real friction has been identified.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Workflow Foundation** - CLAUDE.md and idea backlog in place, every AI session starts with full context
- [ ] **Phase 2: Core Content Workflow** - Complete end-to-end path from idea to published post, first AI-assisted post shipped
- [ ] **Phase 3: Workflow Enhancement** - Post-type templates and tag normalization sharpen the workflow based on real experience

## Phase Details

### Phase 1: Workflow Foundation
**Goal**: Every AI writing session starts with consistent context — voice, schema, conventions, and idea capture are in place before any content is produced
**Depends on**: Nothing (first phase)
**Requirements**: VOIC-02, MGMT-01, MGMT-02
**Success Criteria** (what must be TRUE):
  1. CLAUDE.md exists at the repo root and loads automatically into every Claude Code session with blog voice, frontmatter schema, attribution format, and pointers to exemplary existing posts
  2. A structured idea backlog file exists where a new post idea can be captured in under two minutes with topic, angle, and related posts
  3. The idea backlog can be reviewed and prioritized without any external tool — it is a readable, structured markdown file
**Plans**: TBD

### Phase 2: Core Content Workflow
**Goal**: Users can take a post idea from the backlog to a committed, published markdown file using a validated AI-assisted workflow
**Depends on**: Phase 1
**Requirements**: SCAF-01, SCAF-02, VOIC-01, PUBL-01
**Success Criteria** (what must be TRUE):
  1. User can create a new blog post file with valid, schema-conforming frontmatter and `draft: true` set, in the correct directory, without manual field lookup
  2. A writing session can reference 2-3 existing posts for voice consistency without the user having to manually locate and paste them
  3. User can promote a draft to published by running a single documented step that sets `draft: false`, `pubDatetime`, and `modDatetime` correctly
  4. At least one complete AI-assisted post has been produced and committed through the full workflow
**Plans**: TBD

### Phase 3: Workflow Enhancement
**Goal**: Post-type awareness and tag normalization reduce friction and prevent quality regressions, based on friction discovered in real workflow use
**Depends on**: Phase 2
**Requirements**: SCAF-03, PUBL-02
**Success Criteria** (what must be TRUE):
  1. When starting a comparison, tutorial, or braindump post, a dedicated prompt template is available that shapes the outline and section structure for that format
  2. When generating frontmatter tags, the existing tag list is surfaced so new tags are only created when no existing tag fits
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Workflow Foundation | 0/? | Not started | - |
| 2. Core Content Workflow | 0/? | Not started | - |
| 3. Workflow Enhancement | 0/? | Not started | - |
| 6. Domain & Site Identity | 1/1 | Complete   | 2026-03-22 |
| 7. Tag Taxonomy & Post Metadata | 3/3 | Complete   | 2026-03-23 |
| 8. Structured Data & E-E-A-T | 0/? | Not started | - |
| 9. Technical SEO Polish | 0/? | Not started | - |
| 10. Content Strategy — Topic Authority | 0/? | Not started | - |

### Phase 4: Apply edits as per the frontend-designer's suggestions

**Goal:** Apply low-tech, content-focused UI/UX improvements from frontend design review -- typography, hero, card hierarchy, dark mode contrast, footer license, about bio, date format, and pagination
**Requirements**: Ad-hoc (design review)
**Depends on:** None (independent of content workflow phases)
**Plans:** 2/3 plans executed

Plans:
- [ ] 04-01-PLAN.md — Font system, dark mode border fix, date format, pagination config
- [ ] 04-02-PLAN.md — Hero rewrite, card tag pills, footer license, about page bio
- [ ] 04-03-PLAN.md — Visual verification checkpoint

### Phase 5: Apply edits as per the AI SEO suggestions

**Goal:** Fix structured data and Open Graph meta tags so BlogPosting JSON-LD only emits on post pages, og:type is present on all pages, and article-level OG tags improve AI discoverability
**Requirements**: Ad-hoc (AI SEO audit)
**Depends on:** Phase 4
**Plans:** 1 plan

Plans:
- [ ] 05-01-PLAN.md — Conditional structured data, og:type, article:author/tag, tags prop threading

### Phase 6: Domain & Site Identity

**Goal:** All canonical URLs, meta tags, sitemap, and robots.txt reference `bjro.dev` as the primary domain; site description signals AI and developer tooling expertise
**Requirements**: Ad-hoc (SEO audit — Critical)
**Depends on:** None
**Plans:** 1/1 plans complete

Plans:
- [ ] 06-01-PLAN.md — Update SITE.website/profile/desc in config.ts, fix robots.txt leading blank line, verify build output

**Success Criteria** (what must be TRUE):
  1. `SITE.website` in `config.ts` is `https://bjro.dev/` and all generated canonical tags, OG URLs, sitemap entries, and robots.txt reference that domain
  2. `SITE.desc` contains keywords relevant to AI agents, developer tooling, and software architecture — not generic "philosophy, technology, and life"
  3. `SITE.profile` points to `https://bjro.dev/` (or an about page on that domain)
  4. `roobie.github.io` 301-redirects to `bjro.dev` (or redirect is documented as a manual step if infra is outside this repo)

### Phase 7: Tag Taxonomy & Post Metadata

**Goal:** Replace vague tags with search-relevant terms and bring all post descriptions and titles up to SEO standard
**Requirements**: Ad-hoc (SEO audit — High impact)
**Depends on:** None
**Plans:** 3/3 plans complete

Plans:
- [ ] 07-01-PLAN.md — Update frontmatter for 7 AI agent cluster posts (tags, descriptions, titles)
- [ ] 07-02-PLAN.md — Update frontmatter for 7 developer tools cluster posts (tags, descriptions, titles)
- [ ] 07-03-PLAN.md — Update frontmatter for 7 remaining posts (Linux, opinion, meta) + final validation

**Success Criteria** (what must be TRUE):
  1. No post uses the tags `computing`, `tool`, `discussion`, or `braindump` — each has been replaced with a more specific, search-relevant tag
  2. Every published post has a description between 120-160 characters that includes the post's primary keyword
  3. Every published post title communicates the topic and value — no single-word titles (e.g., `mise`, `Debian`) without a qualifying subtitle
  4. The tag set across all posts forms coherent topical clusters (e.g., `ai-agents`, `developer-tools`, `cli`, `software-architecture`)

### Phase 8: Structured Data & E-E-A-T

**Goal:** Strengthen structured data for rich results and add author credibility signals
**Requirements**: Ad-hoc (SEO audit — Medium impact)
**Depends on:** Phase 6 (needs correct domain in publisher URL)
**Plans:** TBD

**Success Criteria** (what must be TRUE):
  1. JSON-LD `BlogPosting` schema includes a `publisher` field with name and URL
  2. An `/about` page exists with author bio, areas of expertise (AI agents, dev tooling), and links to open-source projects (casq, cairn, slog)
  3. Agent-related posts (9+ posts) contain internal cross-links to related posts in the cluster

### Phase 9: Technical SEO Polish

**Goal:** Fix remaining low-severity technical SEO issues identified in audit
**Requirements**: Ad-hoc (SEO audit — Low impact)
**Depends on:** Phase 6
**Plans:** TBD

**Success Criteria** (what must be TRUE):
  1. `theme-color` meta tag has a valid color value or is removed
  2. Twitter Card meta tags use `name=` attribute instead of `property=`
  3. Sitemap includes `lastmod` dates derived from post `modDatetime` or `pubDatetime`
  4. `robots.txt` template has no leading blank line

### Phase 10: Content Strategy — Topic Authority

**Goal:** Publish content that fills gaps in topical coverage for AI agents and developer tooling
**Requirements**: Ad-hoc (SEO audit — Long-term)
**Depends on:** Phases 6, 7 (identity and taxonomy in place first)
**Plans:** TBD

**Success Criteria** (what must be TRUE):
  1. At least one comparison or roundup post is published (e.g., tool comparisons, agent orchestration approaches)
  2. An AI agents topic landing page or series index exists that aggregates all agent-related posts into a visible cluster
  3. Internal linking across the agent cluster is systematic — every agent post links to at least 2 other agent posts
