# Requirements: roobie.github.io Content Production

**Defined:** 2026-03-10
**Core Value:** Produce high-quality software & tech content with AI as a writing partner

## v1 Requirements

### Content Scaffolding

- [ ] **SCAF-01**: User can create a new blog post file with valid frontmatter and `draft: true` in `site/src/data/blog/`
- [ ] **SCAF-02**: Generated frontmatter conforms to existing Zod schema (author, pubDatetime, modDatetime, title, slug, featured, draft, tags, description)
- [ ] **SCAF-03**: Post-type templates available for comparison, tutorial, and braindump formats

### Voice & Style

- [ ] **VOIC-01**: Writing sessions reference existing posts for consistent casual/direct tone
- [ ] **VOIC-02**: CLAUDE.md instruction file captures blog voice, conventions, and frontmatter format

### Publishing

- [ ] **PUBL-01**: User can promote a draft post to published by flipping `draft: false` and setting correct `pubDatetime` and `modDatetime`
- [ ] **PUBL-02**: Tag normalization suggests existing tags to prevent tag proliferation

### Content Management

- [ ] **MGMT-01**: Idea backlog file captures pending post ideas with context and angles
- [ ] **MGMT-02**: Idea backlog is a structured markdown file that can be reviewed and prioritized

## v2 Requirements

### Content Workflow

- **FLOW-01**: Topic-to-outline conversion via structured prompt from idea to H2/H3 outline
- **FLOW-02**: Section-by-section drafting to produce full draft incrementally

### Quality

- **QUAL-01**: Multi-post consistency checking across the archive
- **QUAL-02**: Per-model prompt optimization for different AI co-authors

## Out of Scope

| Feature | Reason |
|---------|--------|
| Fully automated publishing | Human must review and approve every post |
| SEO optimization tooling | Blog already has SEO via Astro/structured data |
| Content scheduling queue | Overkill for a personal blog |
| Social media automation | Not part of the writing workflow |
| CMS layer | Markdown files are the CMS |
| Grammar linters | AI co-author handles prose quality |
| Site redesign or theme changes | Blog infrastructure works, focus is content |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCAF-01 | — | Pending |
| SCAF-02 | — | Pending |
| SCAF-03 | — | Pending |
| VOIC-01 | — | Pending |
| VOIC-02 | — | Pending |
| PUBL-01 | — | Pending |
| PUBL-02 | — | Pending |
| MGMT-01 | — | Pending |
| MGMT-02 | — | Pending |

**Coverage:**
- v1 requirements: 9 total
- Mapped to phases: 0
- Unmapped: 9

---
*Requirements defined: 2026-03-10*
*Last updated: 2026-03-10 after initial definition*
