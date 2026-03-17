# Phase 5: Apply edits as per the AI SEO suggestions - Research

**Researched:** 2026-03-16
**Domain:** Astro Layout structured data (JSON-LD) and Open Graph meta tags
**Confidence:** HIGH

## Summary

This phase is a targeted single-file edit to `site/src/layouts/Layout.astro`. The three fixes are all well-understood: conditionally guard the BlogPosting JSON-LD block, add the missing `og:type` meta tag, and add `article:author` / `article:tag` OG meta tags. All rely on the existing `pubDatetime` prop as the discriminator between post and non-post pages — a pattern already used elsewhere in the file (lines 89-103).

The only data gap is that `tags` is not currently passed from `PostDetails.astro` to `Layout.astro`. The Props type in Layout.astro does not include `tags`, and the `layoutProps` object built in PostDetails.astro does not include `tags`. This must be added as part of the fix — both the Props type declaration and the `layoutProps` construction need updating.

**Primary recommendation:** Make all three changes in Layout.astro with a single prop addition (`tags?: string[]`) to thread tags through from PostDetails.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- BlogPosting JSON-LD should only emit when `pubDatetime` is truthy
- Add `description` field to the BlogPosting structured data object
- Optionally add `keywords` from the post's tags array
- Add `og:type` = `"article"` for blog posts, `"website"` for non-post pages
- Add `article:author` (profile URL) for post pages
- Add `article:tag` (one `<meta>` per tag) for post pages
- All changes are in `site/src/layouts/Layout.astro`

### Claude's Discretion
- Whether to add WebSite schema for the homepage or Person/ProfilePage schema for the about page (nice-to-have, not required)
- Exact implementation approach for conditionally rendering structured data (could be done in Layout.astro with conditionals, or split into separate layout components)

### Deferred Ideas (OUT OF SCOPE)
- Strengthen post openings (substance first, preamble second) — per-post editorial work
- Query-matching headings on technical posts — per-post editorial work
- Enrich About page with expertise signals — content decision for the author
- Make tags more semantically specific — content taxonomy decision
</user_constraints>

## Standard Stack

### Core (no new dependencies)

| Item | Version | Purpose | Notes |
|------|---------|---------|-------|
| Astro Layout.astro | existing | Single file for all `<head>` meta | All changes live here |
| `pubDatetime` prop | existing | Discriminator: truthy = post page | Already used at lines 89-103 |
| `profile` prop | existing | Author URL for `article:author` | Already available in Props |
| `tags` prop | **new** | Source for `article:tag` and `keywords` | Must be added to Props and passed from PostDetails |

**Installation:** No new packages required.

## Architecture Patterns

### Current File Structure (Layout.astro)

```
Lines 1-49   Frontmatter: Props type, destructuring, structuredData object
Lines 50-120 <head>: meta tags, OG tags, article times, JSON-LD script
Lines 121+   <body>: slot, scripts
```

### Pattern 1: Conditional prop-based rendering (already established)
**What:** Astro inline conditionals `{ condition && (<tag />) }` gate optional markup
**When to use:** Any tag that only belongs on post pages
**Example (already in file, lines 89-96):**
```astro
{
  pubDatetime && (
    <meta
      property="article:published_time"
      content={pubDatetime.toISOString()}
    />
  )
}
```
Use the same pattern for `og:type`, `article:author`, and `article:tag`.

### Pattern 2: Ternary for always-emitted tag with conditional value
**What:** `og:type` must appear on every page — just with different values
**When to use:** Tags that are always present but have page-type-dependent values
**Example:**
```astro
<meta property="og:type" content={pubDatetime ? "article" : "website"} />
```

### Pattern 3: Conditional structuredData with spread
**What:** Only build the BlogPosting object when `pubDatetime` is truthy; otherwise emit no JSON-LD (or emit a minimal WebSite schema at discretion)
**Example:**
```astro
// In frontmatter:
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

```astro
// In template:
{
  structuredData && (
    <script
      type="application/ld+json"
      is:inline
      set:html={JSON.stringify(structuredData)}
    />
  )
}
```

### Pattern 4: Array iteration for repeated meta tags
**What:** `article:tag` requires one `<meta>` per tag — use `.map()` inside JSX
**Example:**
```astro
{
  pubDatetime &&
    tags?.map(tag => (
      <meta property="article:tag" content={tag} />
    ))
}
```

### Anti-Patterns to Avoid
- **Splitting into separate layout components:** Claude's discretion says this is an option, but CONTEXT.md says "all changes are in Layout.astro" — stay in the single file
- **Using template literals with toISOString():** The current `"${pubDatetime?.toISOString()}"` pattern on line 40 produces `"undefined"` when `pubDatetime` is undefined — the fix removes this by making it conditional
- **Wrapping JSON-LD in a conditional block without nulling structuredData:** If structuredData object is always constructed but JSON-LD block is conditionally rendered, TypeScript might complain about the null path — build `structuredData` as `null` when no `pubDatetime`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| JSON-LD serialization | Custom escaping | `JSON.stringify()` (already used) |
| tags prop propagation | Complex abstraction | Simple prop addition to Props type + layoutProps |

## Common Pitfalls

### Pitfall 1: `tags` not passed from PostDetails to Layout
**What goes wrong:** `article:tag` tags and `keywords` field in JSON-LD will be undefined even after adding the logic, because PostDetails.astro's `layoutProps` object does not include `tags`.
**Why it happens:** The existing `layoutProps` in PostDetails.astro (lines 59-68) only passes: title, author, description, pubDatetime, modDatetime, canonicalURL, ogImage, scrollSmooth.
**How to avoid:** Add `tags` to both the Layout.astro Props type and to `layoutProps` in PostDetails.astro.
**Warning signs:** Tags are undefined at runtime; `article:tag` metas don't render; TypeScript may warn.

### Pitfall 2: `"undefined"` string in datePublished
**What goes wrong:** Current line 40 — `datePublished: \`${pubDatetime?.toISOString()}\`` — produces the literal string `"undefined"` when `pubDatetime` is absent.
**Why it happens:** Template literal coerces `undefined` to the string `"undefined"`.
**How to avoid:** The conditional guard on `structuredData` (Pattern 3) eliminates this entirely. Do not use optional chaining inside a template literal for required fields.

### Pitfall 3: `og:type` placement relative to other OG tags
**What goes wrong:** OG parsers expect `og:type` early in the OG block. Placing it after `og:image` is technically valid but non-standard ordering.
**How to avoid:** Insert `og:type` immediately after `og:url` (line 85), before `og:image` (line 86). This matches the recommended Open Graph property ordering: title, type, image, url.

### Pitfall 4: ESLint `no-console` rule is a non-issue here
**What goes wrong:** Nothing — no console calls are introduced. But the linter must pass.
**How to avoid:** Run `cd site && pnpm lint` and `cd site && pnpm build` as verification steps.

## Code Examples

### Fix 1: Conditional structuredData in frontmatter
```astro
// Source: Layout.astro lines 35-49 (current), replaced with:
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

### Fix 2: og:type meta tag (insert after line 85, before og:image)
```astro
<!-- Open Graph / Facebook -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:type" content={pubDatetime ? "article" : "website"} />
<meta property="og:image" content={socialImageURL} />
```

### Fix 3: article:author and article:tag (insert after existing article:modified_time block)
```astro
{
  pubDatetime && profile && (
    <meta property="article:author" content={profile} />
  )
}
{
  pubDatetime &&
    tags?.map(tag => (
      <meta property="article:tag" content={tag} />
    ))
}
```

### Fix 4: Conditional JSON-LD script tag (replaces current unconditional block)
```astro
<!-- Google JSON-LD Structured data -->
{
  structuredData && (
    <script
      type="application/ld+json"
      is:inline
      set:html={JSON.stringify(structuredData)}
    />
  )
}
```

### Fix 5: Props type update in Layout.astro
```typescript
type Props = {
  title?: string;
  author?: string;
  profile?: string;
  description?: string;
  ogImage?: string;
  canonicalURL?: string;
  pubDatetime?: Date;
  modDatetime?: Date | null;
  scrollSmooth?: boolean;
  tags?: string[];   // ADD THIS
};
```

### Fix 6: layoutProps update in PostDetails.astro
```typescript
const layoutProps = {
  title: `${title} | ${SITE.title}`,
  author,
  description,
  pubDatetime,
  modDatetime,
  canonicalURL,
  ogImage,
  scrollSmooth: true,
  tags,   // ADD THIS
};
```

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| BlogPosting on all pages | BlogPosting only on posts | Fixes invalid `"datePublished": "undefined"` |
| No `og:type` | `og:type` = article/website | Required by Open Graph spec; used by all parsers |
| No `article:tag` | One `<meta>` per tag | Enables richer social card metadata |
| No `description` in JSON-LD | description from prop | Helps AI extract post summaries from structured data |

## Open Questions

1. **WebSite schema for homepage (discretion item)**
   - What we know: CONTEXT.md lists this as Claude's discretion
   - What's unclear: Whether the planner should include a task or leave it for a later phase
   - Recommendation: Leave it out of this phase. CONTEXT.md classifies the three listed fixes as Priority 1, 3, and 7 respectively. WebSite schema is "nice-to-have, not required." Keeping scope tight reduces risk.

2. **`keywords` field format in BlogPosting**
   - What we know: Schema.org's `BlogPosting` inherits `keywords` from `CreativeWork`; it accepts a comma-separated string or an array
   - What's unclear: Whether to use `tags.join(", ")` (string) or pass the raw array
   - Recommendation: Use `tags.join(", ")` — this is the most broadly compatible form and matches what Google's documentation shows for `keywords`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (Astro build + manual verification) |
| Config file | none — verification via build output inspection |
| Quick run command | `cd /home/jani/devel/roobie.github.io/site && pnpm build` |
| Full suite command | `cd /home/jani/devel/roobie.github.io/site && pnpm lint && pnpm build` |

### Phase Requirements to Test Map
| Behavior | Test Type | Automated Command | Verifiable? |
|----------|-----------|-------------------|-------------|
| BlogPosting JSON-LD absent on homepage | build + grep output HTML | `pnpm build` then inspect dist/index.html for BlogPosting | manual |
| BlogPosting JSON-LD present on post page | build + grep output HTML | inspect dist/posts/*/index.html for BlogPosting | manual |
| `"datePublished": "undefined"` absent everywhere | build + grep | `grep -r '"datePublished": "undefined"' dist/` should return empty | automated |
| `og:type` present on all pages | build + grep | `grep -r 'og:type' dist/` | automated |
| `article:author` present on post pages | build + grep | `grep -r 'article:author' dist/posts/` | automated |
| `article:tag` present on post pages with tags | build + grep | `grep -r 'article:tag' dist/posts/` | automated |
| Lint passes | lint | `cd site && pnpm lint` | automated |
| TypeScript passes | build | `cd site && pnpm build` (includes tsc) | automated |

### Sampling Rate
- **Per task commit:** `cd site && pnpm lint && pnpm build`
- **Per wave merge:** full build + manual spot-check of dist HTML
- **Phase gate:** Full build green before `/gsd:verify-work`

### Wave 0 Gaps
None — existing build pipeline covers all verification needs. No new test files needed.

## Sources

### Primary (HIGH confidence)
- Layout.astro source file (lines 1-188) — direct inspection of current implementation
- PostDetails.astro source file (lines 59-68) — confirmed `tags` is not in `layoutProps`
- Open Graph Protocol specification — `og:type` values `article` and `website`
- Schema.org BlogPosting — `description` and `keywords` fields verified against schema

### Secondary (MEDIUM confidence)
- ai-seo SKILL.md — project skill confirming schema markup improves AI visibility by 30-40%
- CONTEXT.md — locked decisions from AI SEO audit

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — direct file inspection, no external dependencies
- Architecture: HIGH — patterns already present in the file, extending them
- Pitfalls: HIGH — `tags` omission from layoutProps is a concrete finding from file inspection
- Implementation: HIGH — all code examples derived from existing patterns in the file

**Research date:** 2026-03-16
**Valid until:** Stable indefinitely (single-file edit, no external dependencies or ecosystem churn)
