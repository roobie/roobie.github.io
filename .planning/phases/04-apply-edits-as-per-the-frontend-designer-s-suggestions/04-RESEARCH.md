# Phase 4: Apply Edits as per Frontend-Designer's Suggestions — Research

**Researched:** 2026-03-16
**Domain:** AstroPaper v5 / Astro 5 / Tailwind CSS 4 — config, CSS, and content edits
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Typography
- Add a proportional font for body/prose text (keep monospace Google Sans Code for code blocks and optionally the site title)
- Candidate body fonts: Source Serif 4, Literata, or Atkinson Hyperlegible — pick one that pairs well with the existing monospace
- Use Astro's experimental fonts API (already in use for Google Sans Code)

#### Homepage Hero
- Remove the "Welcome to my personal blog..." boilerplate phrasing
- Remove the README link (leads to a dead end)
- Remove the "Social Links:" label — icons are self-explanatory
- Write a more personality-driven tagline

#### Post Cards (index + listing pages)
- Make description text smaller or lower-contrast for visual hierarchy (title > date > description)
- Add tag pills (first 2-3 tags) below the description on post cards

#### About Page
- Add a real bio: what the author works on, what they think about, why they write
- Keep it short (3-5 sentences)

#### Color / Contrast
- Dark mode border color `#ab4b08` is too low-contrast against `#212737` background
- Bump to approximately `#c05a10` or use `--muted` for borders

#### Footer / License
- Resolve contradiction: footer says "All rights reserved" but About page says CC BY 4.0
- Make license stance consistent (likely: prose is CC BY 4.0, state that clearly)

#### Specifics
- Date format: change from `"D MMM, YYYY"` (e.g. "12 Mar, 2026") to `"D MMM YYYY"` (no comma)
- Bump `postPerPage` from 4 to 8
- Bump `postPerIndex` from 4 to 6
- Tag pills on cards should be small, inline, using the existing Tag component or similar styling

### Claude's Discretion
- Exact font choice from the candidate list
- Exact wording of the new hero tagline (should reflect philosophy + technology + life themes)
- Exact bio content for About page
- Styling details for tag pills on cards

### Deferred Ideas (OUT OF SCOPE)
- None — all suggestions are in scope for this phase
</user_constraints>

---

## Summary

This phase applies a focused set of no-new-dependency UI/UX improvements to the Cogitate blog (AstroPaper v5 / Astro 5.17.1 / Tailwind CSS 4). Every change is either config, CSS, or content — no new packages need to be installed beyond possibly fetching an additional Google Font via the existing experimental fonts API.

The work divides cleanly into eight independent sub-tasks: (1) add a proportional body font, (2) rewrite the homepage hero, (3) improve post card description hierarchy and add tag pills, (4) write the About bio, (5) fix the dark-mode border contrast, (6) align footer copyright with CC BY 4.0 license, (7) fix the date format, and (8) bump pagination config values. All eight can be executed in any order with zero risk of conflicts because they touch different files.

**Primary recommendation:** Work in this order — config changes first (font, pagination, date format), then CSS (border contrast), then component changes (Card tags, footer), then content (hero, About) — to verify the build remains clean at each stage.

---

## Standard Stack

### Core (already installed, no additions needed)

| Library | Version (installed) | Purpose | Role in this phase |
|---------|---------------------|---------|-------------------|
| astro | 5.17.1 | Site framework | Experimental fonts API, build |
| tailwindcss | 4.1.18 | Utility CSS | CSS variable theming, typography |
| @tailwindcss/typography | 0.5.19 | Prose styling | `.app-prose` font override |
| dayjs | 1.11.19 | Date formatting | Date format string change |

### No New Dependencies

All changes are achievable with the current stack. The proportional font is loaded via the same `fontProviders.google()` mechanism already wired for Google Sans Code — no new npm packages.

---

## Architecture Patterns

### How the Font System Works

The project uses Astro's experimental fonts API (still `experimental.fonts` in 5.17.1, confirmed by the working `astro.config.ts`). The pattern is:

1. Register font in `astro.config.ts` `experimental.fonts[]` array — gives it a `cssVariable`.
2. In `Layout.astro` `<head>`, add a `<Font cssVariable="..." preload={...} />` element.
3. In `global.css` `@theme inline {}` block, wire the CSS variable to a Tailwind token (e.g. `--font-body: var(--font-source-serif-4)`).
4. Apply via Tailwind utility class or direct CSS.

The body font should NOT replace `--font-app` (which drives the whole site including nav/UI chrome). Instead, add a separate `--font-body` token and apply it only to `.app-prose` in `typography.css`, and optionally to the hero paragraph and card description text.

### Font Recommendation: Source Serif 4

**Rationale (Claude's discretion):** Source Serif 4 pairs better with a geometric/humanist monospace like Google Sans Code than Atkinson Hyperlegible (which is sans-serif, creating less differentiation) or Literata (which is optimized for e-readers and feels heavier at small sizes). Source Serif 4's optical sizes and variable weight axis give good control at blog prose sizes (16-18px). It is available on Google Fonts.

**Confidence:** MEDIUM — based on typography convention knowledge; visual validation required after implementation.

### Project Structure — Files Touched Per Change

```
site/
├── astro.config.ts           # font registration
├── src/
│   ├── config.ts             # postPerPage, postPerIndex
│   ├── styles/
│   │   ├── global.css        # --border dark mode, --font-body token
│   │   └── typography.css    # font-family on .app-prose
│   ├── components/
│   │   ├── Card.astro        # description hierarchy + tag pills
│   │   ├── Datetime.astro    # date format string
│   │   └── Footer.astro      # copyright/license text
│   ├── layouts/
│   │   └── Layout.astro      # <Font /> element for new font
│   └── pages/
│       ├── index.astro       # hero rewrite
│       └── about.md          # bio content
```

### Pattern: Adding a Second Google Font

```typescript
// astro.config.ts — add to experimental.fonts array
// Source: working pattern in the existing config (HIGH confidence)
{
  name: "Source Serif 4",
  cssVariable: "--font-source-serif-4",
  provider: fontProviders.google(),
  fallbacks: ["Georgia", "serif"],
  weights: [300, 400, 500, 600],
  styles: ["normal", "italic"],
}
```

```astro
// Layout.astro <head> — add alongside existing Font element
<Font
  cssVariable="--font-source-serif-4"
  preload={[{ subset: "latin", weight: 400, style: "normal" }]}
/>
```

```css
/* global.css @theme inline block — add new token */
--font-body: var(--font-source-serif-4);
```

```css
/* typography.css — apply to prose content */
.app-prose {
  font-family: var(--font-body);
  /* ... existing rules ... */
}
```

### Pattern: Tag Pills on Card.astro

The existing `Tag.astro` component renders a `<li>` with an anchor styled as an underlined tag link — it is designed for the tag listing page and is too large/heavy for inline card pills. The card pills should be lighter inline elements.

Two valid approaches:
1. Import the existing `Tag` component with `size="sm"` and render the tags array inline — the smallest overhead.
2. Write inline JSX in `Card.astro` directly (avoids importing a list-item component and wrapping it oddly).

**Recommendation:** Use a simple inline approach in Card.astro directly — a `<ul>` of `<li>` elements styled with small text, rounded border, and muted color. This avoids misusing the `Tag` component (which wraps its anchor in a `<li>` for tag pages) and keeps card styling self-contained. Limit to first 2-3 tags from the `data.tags` array.

```astro
<!-- Card.astro — after <p>{description}</p> -->
{tags && tags.length > 0 && (
  <ul class="mt-1 flex flex-wrap gap-1">
    {tags.slice(0, 3).map(tag => (
      <li>
        <a
          href={`/tags/${slugifyStr(tag)}/`}
          class="inline-block rounded border border-border px-1.5 py-0.5 text-xs text-foreground/70 hover:border-accent hover:text-accent"
        >
          {tag}
        </a>
      </li>
    ))}
  </ul>
)}
```

Note: `tags` must be extracted from `data` in the component destructuring. The `slugifyStr` utility is already imported.

### Pattern: Description Visual Hierarchy

Current card renders `<p>{description}</p>` with default text size and full opacity. To lower it visually:

```astro
<!-- Reduce opacity and size for visual hierarchy -->
<p class="text-sm opacity-70">{description}</p>
```

This matches the existing `Datetime.astro` approach of using `opacity-80` for date metadata — a consistent visual language.

### Pattern: Dark Mode Border Fix

```css
/* global.css — html[data-theme="dark"] block */
html[data-theme="dark"] {
  --background: #212737;
  --foreground: #eaedf3;
  --accent: #ff6b01;
  --muted: #343f60;
  --border: #c05a10;   /* was #ab4b08 — bumped for contrast */
}
```

Contrast check: `#c05a10` on `#212737` ≈ 3.2:1 (WCAG AA for large text / decorative borders). The `--muted` value `#343f60` is an alternative if color-agnostic borders are preferred.

**Recommendation:** Use `#c05a10` (warmer, consistent with the orange accent palette) rather than `--muted` (which is cool-blue and would look disconnected from the orange accent).

### Pattern: Footer License Fix

Current `Footer.astro` outputs `"Copyright © {year} | All rights reserved."` — contradicts the About page's CC BY 4.0 statement. Change to:

```astro
<span>Copyright &#169; {currentYear}</span>
<span class="hidden sm:inline">&nbsp;|&nbsp;</span>
<span>
  Content licensed under{" "}
  <a
    href="https://creativecommons.org/licenses/by/4.0/"
    class="underline decoration-dashed underline-offset-4 hover:text-accent"
    target="_blank"
    rel="noopener noreferrer"
  >
    CC BY 4.0
  </a>
</span>
```

This is consistent with the About page and removes the misleading "All rights reserved."

### Pattern: Date Format Fix

```typescript
// Datetime.astro line 34 — change format string
const date = datetime.format("D MMM YYYY"); // was "D MMM, YYYY"
```

Dayjs format string reference (HIGH confidence — standard dayjs tokens): `D` = day of month, `MMM` = abbreviated month, `YYYY` = 4-digit year.

### Pattern: Pagination Config

```typescript
// config.ts
postPerIndex: 6,  // was 4
postPerPage: 8,   // was 4
```

These fields are read directly in `index.astro` (`SITE.postPerIndex`) and in the pagination pages (`SITE.postPerPage`). No other changes needed.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Font loading optimization | Custom link/preload tags | Astro `<Font>` component — handles subsetting, preload, fallback generation |
| Tag slug generation | Custom string transform | `slugifyStr` from `@/utils/slugify` — already imported in Card.astro |
| Date formatting | Custom format function | dayjs format string — already in Datetime.astro |
| Dark/light mode CSS | JS class toggling | CSS custom properties with `[data-theme=dark]` selector — already the pattern |

---

## Common Pitfalls

### Pitfall 1: Replacing `--font-app` Instead of Adding `--font-body`

**What goes wrong:** If you change `--font-app` to point to Source Serif 4, all UI chrome (nav, buttons, search, header) gets the serif font — looks broken.
**How to avoid:** Add a separate `--font-body` Tailwind token and apply it only to `.app-prose` and specific prose containers. Keep `--font-app` pointing to Google Sans Code.

### Pitfall 2: Forgetting the `<Font>` Component in Layout.astro

**What goes wrong:** Font is registered in `astro.config.ts` but the CSS variable is never loaded — font falls back to serif system font but the CSS variable is undefined.
**How to avoid:** The `<Font cssVariable="--font-source-serif-4" preload={...} />` element in `Layout.astro` is mandatory. The pattern is already present for Google Sans Code — follow it exactly.

### Pitfall 3: Tag Pills Using `Tag.astro` Incorrectly

**What goes wrong:** `Tag.astro` renders a `<li>` element — if you use it inside a `<ul>` in Card.astro it works structurally, but the visual style (large text, dashed underline border) doesn't suit small inline card pills.
**How to avoid:** Write the pill markup inline in `Card.astro` — lighter and more controlled.

### Pitfall 4: `tags` Not Destructured in Card.astro

**What goes wrong:** `data.tags` is available but the component only destructures `{ title, description, ...props }` from `data`. Adding tag pills requires also destructuring `tags` from `data`.
**How to avoid:** Update the destructuring: `const { title, description, tags, ...props } = data;`

### Pitfall 5: Build Fails on TypeScript Strict Checks

**What goes wrong:** `tags` is optional in the schema (`string[] | undefined`). Accessing `tags.slice(...)` without a guard causes a TypeScript error.
**How to avoid:** Gate the tag pill block with `{tags && tags.length > 0 && (...)}`.

### Pitfall 6: About Page is Markdown, Not Astro

**What goes wrong:** Treating `about.md` like an Astro component and adding JSX.
**How to avoid:** The bio is plain Markdown content inside `about.md`. The CC BY 4.0 link is already there as Markdown syntax. Just write natural prose.

---

## Code Examples

### Add Second Font in astro.config.ts

```typescript
// Source: existing working pattern in astro.config.ts (HIGH confidence)
experimental: {
  preserveScriptOrder: true,
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
    },
    {
      name: "Source Serif 4",
      cssVariable: "--font-source-serif-4",
      provider: fontProviders.google(),
      fallbacks: ["Georgia", "serif"],
      weights: [300, 400, 500, 600],
      styles: ["normal", "italic"],
    },
  ],
},
```

### Wire Font Token in global.css

```css
/* global.css @theme inline block */
@theme inline {
  --font-app: var(--font-google-sans-code);
  --font-body: var(--font-source-serif-4);   /* NEW */
  --color-background: var(--background);
  /* ... rest unchanged ... */
}
```

### Apply Body Font to Prose in typography.css

```css
/* typography.css */
.app-prose {
  @apply prose;
  font-family: var(--font-body);   /* NEW — overrides inherited font-app */
  /* ... rest unchanged ... */
}
```

### Hero Rewrite (index.astro — suggested content)

Remove the two `<p>` blocks and the `"Social Links:"` label div. Keep the `<h1>`, the RSS icon, and the `<Socials />` component.

```astro
<section id="hero" class:list={["pt-8 pb-6", "border-b border-border"]}>
  <h1 class="my-4 inline-block text-4xl font-bold sm:my-8 sm:text-5xl">
    Björn's cogitations
  </h1>
  <a target="_blank" href="/rss.xml" class="inline-block" aria-label="rss feed" title="RSS Feed">
    <IconRss width={20} height={20} class="scale-125 stroke-accent stroke-3 rtl:-rotate-90" />
    <span class="sr-only">RSS Feed</span>
  </a>

  <p class="mt-4">
    Thoughts on building software, reasoning about systems, and the occasional
    philosophical detour. Written to think out loud.
  </p>

  {SOCIALS.length > 0 && (
    <div class="mt-4">
      <Socials />
    </div>
  )}
</section>
```

Note: The exact tagline wording is Claude's discretion — the above is a starting draft. It should reflect philosophy + technology + life per CONTEXT.md.

### About Page Bio (about.md — suggested content)

```markdown
---
layout: ../layouts/AboutLayout.astro
title: "About"
---

I'm Björn Roberg, a software developer based in Sweden. I spend my days building
systems that have to work reliably, and my spare time wondering why they don't.
I write here to slow down my thinking — to examine ideas about technology,
epistemology, and how we reason about complex things. If any of it is useful to
you, great; if it starts a conversation, even better.

Content in this blog is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
unless otherwise indicated.

This blog is powered by [AstroPaper](https://github.com/satnaing/astro-paper).
```

Note: The exact bio wording is Claude's discretion. The above is a starting draft. The CC BY 4.0 line already exists in `about.md` — move it below the bio or keep it where it is.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — this is a content/static site |
| Config file | None |
| Quick run command | `cd /home/jani/devel/roobie.github.io/site && pnpm build` |
| Full suite command | `cd /home/jani/devel/roobie.github.io/site && pnpm build` (includes `astro check` TypeScript validation) |

No automated test suite exists. Validation for this phase is:
1. `astro check` (TypeScript) passes — included in `pnpm build`
2. `pnpm lint` passes — ESLint
3. `pnpm format:check` passes — Prettier
4. Visual inspection of dev server for font rendering, card tag pills, hero text, and dark mode contrast

### Phase Requirements Map

No formal requirement IDs were assigned to this phase (added ad-hoc from design review). Mapping by change area:

| Change | Validation Method |
|--------|------------------|
| Font addition | Build succeeds; font visible in browser |
| Hero rewrite | `index.astro` renders without README link or "Social Links:" label |
| Card description hierarchy | `opacity-*` class present in rendered HTML |
| Card tag pills | Tags visible on index page, link to correct tag pages |
| About bio | Text present in rendered `/about/` page |
| Dark border contrast | DevTools color picker: `#c05a10` on `#212737` |
| Footer license | "CC BY 4.0" link present, "All rights reserved" absent |
| Date format | No comma in rendered dates (e.g. "16 Mar 2026") |
| Pagination config | `/posts/` page shows 8 posts per page |

### Wave 0 Gaps

None — no test infrastructure required. All validation is build-time + visual.

---

## Open Questions

1. **Source Serif 4 vs Literata vs Atkinson Hyperlegible**
   - What we know: All three are on Google Fonts; Source Serif 4 has a variable weight axis; Atkinson Hyperlegible is sans-serif (reduces contrast with monospace UI font)
   - What's unclear: How Source Serif 4 renders at the actual blog prose size on the target display
   - Recommendation: Implement Source Serif 4 first; if it feels too bookish, swap to Literata (same swap procedure, one config line)

2. **Footer: inline CC link or separate line**
   - What we know: Footer is compact; adding a hyperlink in a small footer row may feel cluttered
   - What's unclear: Whether the author prefers the license statement in footer or only on the About page
   - Recommendation: Footer can say `Content: CC BY 4.0` as a short text with a link; About page keeps the longer statement

3. **Tag pill limit: 2 vs 3**
   - What we know: CONTEXT.md says "first 2-3 tags"; most posts likely have 2-5 tags
   - Recommendation: Use 3 as the default (`tags.slice(0, 3)`) — easy to reduce if it looks crowded

---

## Sources

### Primary (HIGH confidence)
- Existing `astro.config.ts` in repo — live working example of `experimental.fonts` API with `fontProviders.google()`
- Existing `global.css` — confirmed `--font-app` / `@theme inline` pattern
- Existing `Card.astro`, `Datetime.astro`, `Footer.astro`, `Tag.astro` — direct code inspection
- `site/package.json` — confirmed Astro 5.17.1, tailwindcss 4.1.18, @tailwindcss/typography 0.5.19, dayjs 1.11.19

### Secondary (MEDIUM confidence)
- [Astro Experimental Fonts API Docs](https://docs.astro.build/en/reference/experimental-flags/fonts/) — confirmed multiple fonts array, cssVariable pattern, Font component preload
- [Source Serif 4 — Google Fonts](https://fonts.google.com/specimen/Source+Serif+4) — confirmed availability on Google Fonts
- [Atkinson Hyperlegible — Google Fonts](https://fonts.google.com/specimen/Atkinson%2BHyperlegible) — confirmed availability; note: sans-serif

### Tertiary (LOW confidence — not required for this phase)
- General typography pairing conventions (training knowledge) — font recommendation rationale

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all confirmed via direct file inspection
- Architecture patterns: HIGH — all patterns derived from existing code in the repo
- Pitfalls: HIGH — derived from direct code analysis of actual files
- Font choice recommendation: MEDIUM — typography convention; visual validation required

**Research date:** 2026-03-16
**Valid until:** 2026-06-16 (stable stack; Astro experimental fonts may graduate to stable before then — behavior unchanged either way)
