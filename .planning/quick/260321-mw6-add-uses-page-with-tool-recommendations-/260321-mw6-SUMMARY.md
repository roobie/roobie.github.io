---
phase: quick
plan: 260321-mw6
subsystem: content/navigation
tags: [uses-page, affiliate, navigation, content]
dependency_graph:
  requires: []
  provides: [uses-page, nav-link-uses]
  affects: [site/src/pages/uses.md, site/src/components/Header.astro]
tech_stack:
  added: []
  patterns: [AboutLayout markdown page pattern]
key_files:
  created:
    - site/src/pages/uses.md
  modified:
    - site/src/components/Header.astro
decisions:
  - "Placeholder affiliate links used (PLACEHOLDER token) — user replaces with actual referral URLs"
  - "Only tools from self-hosted/privacy-focused and developer categories included — Swedish market and client SaaS tools excluded per plan"
metrics:
  duration: "~8 minutes"
  completed: "2026-03-21"
  tasks: 2
  files: 2
---

# Quick Task 260321-mw6: Add /uses Page with Tool Recommendations Summary

**One-liner:** /uses page with honest tool reviews (Simple Analytics, Hetzner, Cloudflare, self-hosted stack) and affiliate disclosures, plus Uses nav link between Tags and About.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create /uses page | cfc3263 | site/src/pages/uses.md |
| 2 | Add Uses nav link | 647810f | site/src/components/Header.astro |

## What Was Built

**Task 1 — /uses page (`site/src/pages/uses.md`)**

New markdown page using `AboutLayout.astro` (same pattern as `about.md`). Content sections:

- Intro: transparent disclosure policy
- Analytics: Simple Analytics ~300-word honest review with pros (no cookies, GDPR, lightweight, EU data), cons (limited funnels/events, smaller ecosystem), affiliate link with placeholder URL and explicit commission disclosure
- Hosting: Hetzner VPS section with referral link placeholder and €20 credit disclosure
- Developer Tools: Cloudflare (no affiliate, listed as-is)
- Self-hosted: Uptime Kuma, Vaultwarden, SearXNG (no affiliate links, informational)
- Last updated notice

Tone matches `about.md` — direct, no marketing speak, no superlatives.

**Task 2 — Header nav link (`site/src/components/Header.astro`)**

Added `<li class="col-span-2">` with `<a href="/uses">` using `isActive("/uses")` for active state highlighting. Inserted between the Tags and About items, exactly matching the existing nav item pattern.

## Verification

- `pnpm build` completes without errors both tasks
- `site/dist/client/uses/index.html` generated
- Built output contains "Simple Analytics"
- `Header.astro` contains `href="/uses"`

## Deviations from Plan

None — plan executed exactly as written.

## Action Required

Replace placeholder affiliate URLs before publishing:
- `https://referral.simpleanalytics.com/PLACEHOLDER` → actual Simple Analytics referral URL
- `https://hetzner.cloud/?ref=PLACEHOLDER` → actual Hetzner referral URL

## Self-Check: PASSED

- site/src/pages/uses.md: FOUND
- site/src/components/Header.astro: modified with /uses link
- Commit cfc3263: FOUND
- Commit 647810f: FOUND
