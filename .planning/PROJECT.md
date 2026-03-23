# roobie.github.io

## What This Is

A personal tech blog by Bjorn Roberg, hosted at bjro.dev (deployed via Cloudflare Workers). Built with Astro (AstroPaper theme) and Tailwind CSS. The blog covers software engineering, AI agents, dev tools, security, and programming concepts. Posts are co-authored with AI models.

## Core Value

Produce high-quality software & tech content with AI as a writing partner — blog posts, drafts, edits, technical articles, and idea exploration.

## Requirements

### Validated

- ✓ Static blog with Astro SSG on GitHub Pages — existing
- ✓ Markdown-based blog posts with frontmatter schema — existing
- ✓ Tag-based content organization and navigation — existing
- ✓ RSS feed and sitemap generation — existing
- ✓ Full-text search via Pagefind — existing
- ✓ Dynamic OG image generation — existing
- ✓ Light/dark theme support — existing
- ✓ SEO and structured data (JSON-LD, Open Graph) — existing
- ✓ GitHub Actions CI/CD deployment — existing
- ✓ Domain identity: bjro.dev as canonical domain, AI/dev tooling description — Validated in Phase 6: Domain & Site Identity
- ✓ SEO-optimized tag taxonomy and post metadata across all 21 published posts — Validated in Phase 7: Tag Taxonomy & Post Metadata
- ✓ BlogPosting JSON-LD with publisher/mainEntityOfPage, expanded about page, agent cluster cross-links — Validated in Phase 8: Structured Data & E-E-A-T

### Active

- [ ] AI-assisted blog post writing (full articles on chosen topics)
- [ ] Draft review and editing (polish existing drafts)
- [ ] Technical tutorial and guide creation
- [ ] Idea brainstorming and post outlining

### Out of Scope

- Site redesign or theme changes — the blog works, focus is on content
- Backend or dynamic features — it's a static site by design
- Non-tech content — blog stays focused on software & tech

## Context

The blog has ~19 existing posts covering topics like AI agents (currying agents, linear agentics, locking down agents), dev tools (mise, terminal multiplexers), functional programming concepts applied to AI, security, and general computing (Debian). Posts are stored as markdown files in `site/src/data/blog/`.

Author field credits both Bjorn and the AI model used (e.g., "Bjorn Roberg, Claude" or "Bjorn Roberg, GPT-51"). The writing style is casual and direct — like talking to a colleague. Posts range from short opinion pieces to detailed technical comparisons with code examples and tables.

Content lives in `site/src/data/blog/*.md` with frontmatter including: author, pubDatetime, modDatetime, title, slug, featured, draft, tags, description.

## Constraints

- **Content format**: Markdown files with Zod-validated frontmatter schema
- **Location**: All posts go in `site/src/data/blog/`
- **Tone**: Casual and direct, not corporate or overly polished
- **Attribution**: AI co-authorship credited in the author frontmatter field

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Content-only project scope | Blog infrastructure works well, focus effort on what matters — writing | — Pending |
| AI as co-author, not ghostwriter | Transparent about AI involvement, credited in author field | ✓ Good |

---
*Last updated: 2026-03-23 after Phase 8 completion*
