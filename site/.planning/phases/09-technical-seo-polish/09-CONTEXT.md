# Phase 9: Technical SEO Polish - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix three remaining low-severity technical SEO issues from the audit: remove invalid theme-color meta tag, correct Twitter Card meta tag attributes, and add lastmod dates to sitemap. The fourth audit item (robots.txt leading blank line) was already resolved in Phase 6.

</domain>

<decisions>
## Implementation Decisions

### Theme Color Meta Tag
- Remove the `<meta name="theme-color" content="" />` tag entirely from Layout.astro
- Rationale: empty value is invalid; the blog has light/dark mode so a static color would clash with one mode
- Do not replace with a dynamic per-theme value — unnecessary complexity

### Twitter Card Meta Tags
- Change all five Twitter meta tags from `property="twitter:*"` to `name="twitter:*"`
- The five tags are: twitter:card, twitter:url, twitter:title, twitter:description, twitter:image
- Located at Layout.astro lines 134-138

### Sitemap Lastmod
- Configure `@astrojs/sitemap` to include `lastmod` dates on sitemap entries
- Source: `modDatetime` if set, with `pubDatetime` as fallback
- This signals content freshness to search engines and helps crawl prioritization

### Already Resolved (No Action Needed)
- robots.txt leading blank line — fixed in Phase 6 (commit 62102d5)

### Claude's Discretion
- Exact implementation approach for passing lastmod to the sitemap integration (serialize function, entryLimit, etc.)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Layout Meta Tags
- `site/src/layouts/Layout.astro` — Lines 134-138 (Twitter meta tags), line 160 (theme-color)

### Sitemap Configuration
- `site/astro.config.ts` — Lines 21-23: `@astrojs/sitemap` integration config
- `site/src/content.config.ts` — Blog collection schema (modDatetime, pubDatetime fields)

### Prior Phase Work
- `.planning/phases/06-domain-and-site-identity/06-01-SUMMARY.md` — Confirms robots.txt blank line already fixed

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `@astrojs/sitemap` already installed and configured — just needs `serialize` option added
- Blog post schema already has `modDatetime` (optional Date) and `pubDatetime` (required Date) fields

### Established Patterns
- Phase 5/6: Layout.astro edits follow the existing conditional pattern with `pubDatetime` as discriminator
- Sitemap filter already in place: `filter: (page) => SITE.showArchives || !page.endsWith("/archives")`

### Integration Points
- Twitter meta tags: direct attribute change in Layout.astro (property → name)
- theme-color: delete one line in Layout.astro
- Sitemap lastmod: add `serialize` function to sitemap config in astro.config.ts, reading from content collection

</code_context>

<specifics>
## Specific Ideas

No specific requirements — standard implementations for all three fixes.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 09-technical-seo-polish*
*Context gathered: 2026-03-23*
