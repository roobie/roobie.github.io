---
phase: 08-structured-data-e-e-a-t
verified: 2026-03-23T12:00:00Z
status: passed
score: 14/14 must-haves verified
re_verification: false
---

# Phase 8: Structured Data & E-E-A-T Verification Report

**Phase Goal:** Strengthen structured data for rich results and add author credibility signals
**Verified:** 2026-03-23
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

Success Criteria from ROADMAP.md Phase 8:

| #  | Truth                                                                                             | Status     | Evidence                                                                                  |
|----|---------------------------------------------------------------------------------------------------|------------|-------------------------------------------------------------------------------------------|
| 1  | JSON-LD BlogPosting schema includes a publisher field with name and URL                           | VERIFIED   | `publisher: { "@type": "Person", name: SITE.author, url: SITE.website }` at Layout.astro:54-58 |
| 2  | An /about page exists with author bio, expertise (AI agents, dev tooling), and project links      | VERIFIED   | about.md has intro bio, "What I work on" section, and "Open-source projects" section      |
| 3  | Agent-related posts (9+ posts) contain internal cross-links to related posts in the cluster       | VERIFIED   | All 9 agent posts confirmed >= 2 /posts/ cross-links to cluster posts                    |

**Score: 3/3 success criteria verified**

---

### Required Artifacts

**Plan 08-01 artifacts:**

| Artifact                              | Expected                                          | Status     | Details                                                             |
|---------------------------------------|---------------------------------------------------|------------|---------------------------------------------------------------------|
| `site/src/layouts/Layout.astro`       | BlogPosting JSON-LD with publisher + mainEntityOfPage | VERIFIED | `publisher` (Person, SITE.author, SITE.website) at lines 54-58; `mainEntityOfPage` (WebPage, canonicalURL) at lines 59-62 |
| `site/src/pages/about.md`             | Expanded about page with expertise + project links | VERIFIED  | Contains "AI agents", "developer tooling", casq/cairn/slog links to /posts/introducing-* |

**Plan 08-02 artifacts (5 agent posts):**

| Artifact                                                                    | Expected                      | Status     | /posts/ link count |
|-----------------------------------------------------------------------------|-------------------------------|------------|--------------------|
| `site/src/data/blog/building-smarter-ai-agents-with-ideas-from-philosophy.md` | >= 2 agent cluster cross-links | VERIFIED  | 4 total (3 agent cluster) |
| `site/src/data/blog/business-processes.md`                                  | >= 2 agent cluster cross-links | VERIFIED  | 2                  |
| `site/src/data/blog/curry-agents.md`                                        | >= 2 agent cluster cross-links | VERIFIED  | 2                  |
| `site/src/data/blog/linear-agentics.md`                                     | >= 2 agent cluster cross-links | VERIFIED  | 2                  |
| `site/src/data/blog/locking-down-agents.md`                                 | >= 2 agent cluster cross-links | VERIFIED  | 2                  |

**Plan 08-03 artifacts (4 agent posts):**

| Artifact                                        | Expected                      | Status    | /posts/ link count |
|-------------------------------------------------|-------------------------------|-----------|---|
| `site/src/data/blog/markov-chains-with-llms.md` | >= 2 agent cluster cross-links | VERIFIED  | 2 |
| `site/src/data/blog/markymarkov.md`             | >= 2 agent cluster cross-links | VERIFIED  | 2 |
| `site/src/data/blog/mindmap.md`                 | >= 2 agent cluster cross-links | VERIFIED  | 2 |
| `site/src/data/blog/trust-1.md`                 | >= 2 agent cluster cross-links | VERIFIED  | 2 |

---

### Key Link Verification

**Plan 08-01 key links:**

| From                            | To                             | Via                              | Status   | Details                                              |
|---------------------------------|--------------------------------|----------------------------------|----------|------------------------------------------------------|
| `site/src/layouts/Layout.astro` | SITE.author and SITE.website   | direct usage of imported SITE    | WIRED    | `name: SITE.author` and `url: SITE.website` confirmed at lines 56-57 |

**Plan 08-02 / 08-03 key links — cross-link slug correctness:**

All 9 posts use `/posts/{slug}` format with correct slugs per the slug reference table. Spot checks confirmed:

- `business-processes.md` links to `/posts/linear-agentics` and `/posts/building-smarter-ai-agents-with-ideas-from-philosophy` — both correct slugs
- `locking-down-agents.md` links to `/posts/linear-agentics` and `/posts/cloud-llms-in-prod` — both correct slugs
- `trust-1.md` links to `/posts/locking-down-agents` and `/posts/linear-agentics` — both correct slugs
- `markymarkov.md` links to `/posts/markov-chains-and-llms-hybrid-architectures` and `/posts/context-context-context` — both correct (non-obvious file-to-slug mappings honoured)

No "Related Posts" or "See Also" headings found in any of the 9 agent posts.

---

### Requirements Coverage

The phase declared ad-hoc requirement IDs in plan frontmatter. REQUIREMENTS.md uses a different ID space (SCAF-*, VOIC-*, etc.) and does not define Ad-hoc-1/2/3 formally — these are SEO audit action items tracked in ROADMAP.md Phase 8 directly.

| Requirement  | Source Plan | Description                                           | Status    | Evidence                                                    |
|--------------|-------------|-------------------------------------------------------|-----------|-------------------------------------------------------------|
| Ad-hoc-1     | 08-01       | BlogPosting JSON-LD publisher field                   | SATISFIED | publisher field present in Layout.astro lines 54-58         |
| Ad-hoc-2     | 08-01       | About page with expertise + project links             | SATISFIED | about.md contains expertise section and project links       |
| Ad-hoc-3     | 08-02, 08-03| Agent posts cross-linked (all 9 posts, >= 2 links each) | SATISFIED | All 9 agent posts verified >= 2 /posts/ cross-links         |

No orphaned requirements: REQUIREMENTS.md does not map any standard IDs to Phase 8.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | — | — | No anti-patterns found |

Scanned `site/src/layouts/Layout.astro` and `site/src/pages/about.md` for TODO/FIXME/PLACEHOLDER/placeholder/coming soon — none found.

---

### Human Verification Required

The following items could benefit from human review but are not blocking — automated checks pass:

#### 1. Google Rich Results Test

**Test:** Submit any blog post URL (e.g., `https://bjro.dev/posts/locking-down-agents`) to the [Rich Results Test](https://search.google.com/test/rich-results)
**Expected:** BlogPosting result shows publisher name ("Björn Roberg"), publisher URL (bjro.dev), and mainEntityOfPage without errors or warnings
**Why human:** Requires live URL or HTML submission to external validation tool; can't replicate programmatically

#### 2. About page rendering

**Test:** Visit `/about` in the browser
**Expected:** Both "What I work on" and "Open-source projects" sections render correctly; project links are clickable and resolve to valid post pages
**Why human:** Visual rendering and link resolution require a live browser

---

### Gaps Summary

No gaps. All phase 8 must-haves are satisfied:

- JSON-LD `publisher` and `mainEntityOfPage` fields are present and correctly wired to `SITE.author` and `SITE.website` from config
- About page has the required expertise areas (AI agents, developer tooling, software architecture, Rust/TypeScript/Go) and project links (casq, cairn, slog) pointing to on-site blog posts
- All 9 agent posts contain at least 2 contextual inline cross-links to other posts in the agent cluster, using correct `/posts/{slug}` URLs — none use widget-style "Related Posts" sections

---

_Verified: 2026-03-23_
_Verifier: Claude (gsd-verifier)_
