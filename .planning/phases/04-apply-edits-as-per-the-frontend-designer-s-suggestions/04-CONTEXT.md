# Phase 4: Apply edits as per the frontend-designer's suggestions - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning
**Source:** Frontend design analysis conversation

<domain>
## Phase Boundary

This phase applies low-tech, content-focused UI/UX improvements to the Cogitate blog. All changes are config/content/CSS-level -- no new dependencies, no architectural changes. The blog uses AstroPaper v5 on Astro 5 with Tailwind CSS 4.

</domain>

<decisions>
## Implementation Decisions

### Typography
- Add a proportional font for body/prose text (keep monospace Google Sans Code for code blocks and optionally the site title)
- Candidate body fonts: Source Serif 4, Literata, or Atkinson Hyperlegible -- pick one that pairs well with the existing monospace
- Use Astro's experimental fonts API (already in use for Google Sans Code)

### Homepage Hero
- Remove the "Welcome to my personal blog..." boilerplate phrasing
- Remove the README link (leads to a dead end)
- Remove the "Social Links:" label -- icons are self-explanatory
- Write a more personality-driven tagline

### Post Cards (index + listing pages)
- Make description text smaller or lower-contrast for visual hierarchy (title > date > description)
- Add tag pills (first 2-3 tags) below the description on post cards

### About Page
- Add a real bio: what the author works on, what they think about, why they write
- Keep it short (3-5 sentences)

### Color / Contrast
- Dark mode border color `#ab4b08` is too low-contrast against `#212737` background
- Bump to approximately `#c05a10` or use `--muted` for borders

### Footer / License
- Resolve contradiction: footer says "All rights reserved" but About page says CC BY 4.0
- Make license stance consistent (likely: prose is CC BY 4.0, state that clearly)

### Claude's Discretion
- Exact font choice from the candidate list
- Exact wording of the new hero tagline (should reflect philosophy + technology + life themes)
- Exact bio content for About page
- Styling details for tag pills on cards

</decisions>

<specifics>
## Specific Ideas

- Date format: change from `"D MMM, YYYY"` (e.g. "12 Mar, 2026") to `"D MMM YYYY"` (no comma)
- Bump `postPerPage` from 4 to 8
- Bump `postPerIndex` from 4 to 6
- Tag pills on cards should be small, inline, using the existing Tag component or similar styling

</specifics>

<deferred>
## Deferred Ideas

- None -- all suggestions are in scope for this phase

</deferred>

---

*Phase: 04-apply-edits-as-per-the-frontend-designer-s-suggestions*
*Context gathered: 2026-03-16 via frontend design analysis*
