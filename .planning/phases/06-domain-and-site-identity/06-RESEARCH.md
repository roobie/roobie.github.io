# Phase 6: Domain & Site Identity - Research

**Researched:** 2026-03-22
**Domain:** Astro site identity config, canonical URL plumbing, Cloudflare Pages custom domain, GitHub Pages redirect
**Confidence:** HIGH

## Summary

The site already has a custom domain (`bjro.dev`) acquired and referenced in a blog post and a Wrangler config (`name: "bjro-dev"`), but `SITE.website` in `config.ts` still points to `https://roobie.github.io/`. Because Astro's `@astrojs/sitemap` integration, the robots.txt route (`robots.txt.ts`), and the canonical link tag in `Layout.astro` all derive URLs from `SITE.website` / `Astro.site`, changing that one value propagates the correct domain across every generated URL surface.

The deployment setup uses Cloudflare Workers via Wrangler (`bunx wrangler deploy`) rather than GitHub Pages. GitHub Pages is also configured (`.github/workflows/deploy.yml`) but appears to be a legacy or parallel path. The 301 redirect from `roobie.github.io` → `bjro.dev` is a GitHub repository setting (custom domain field), not something this repo's source code controls — it requires a manual infra step documented in the plan.

The `SITE.desc` currently reads "A place to gather thoughts on philosophy, technology, and life — powered by Astro." This does not reflect the actual content focus (AI agents, developer tooling, software architecture) and should be replaced with a description that signals those keywords.

**Primary recommendation:** Change `SITE.website`, `SITE.profile`, and `SITE.desc` in `site/src/config.ts`. Everything else (sitemap, robots.txt, canonical tags, OG URLs) propagates automatically through existing Astro plumbing.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| Ad-hoc (SEO audit — Critical) | `SITE.website` = `https://bjro.dev/`; canonical tags, OG URLs, sitemap, robots.txt all reference bjro.dev; `SITE.desc` signals AI/dev expertise; `SITE.profile` points to bjro.dev; roobie.github.io 301-redirects to bjro.dev | All four items trace to `config.ts` edits + a documented infra step for the GitHub redirect |
</phase_requirements>

## Standard Stack

### Core
| Library/Tool | Version | Purpose | Why Standard |
|---|---|---|---|
| `@astrojs/sitemap` | 3.7.1 (installed) | Auto-generates `sitemap-index.xml` using `Astro.site` | Already integrated; no action needed beyond updating `SITE.website` |
| `astro` `site` config | via `astro.config.ts` | Sets `Astro.site` globally; consumed by sitemap, RSS, and any `new URL(…, Astro.site)` call | Single source of truth for base URL |
| `robots.txt.ts` (Astro API route) | existing | Generates `/robots.txt` with sitemap reference via `new URL("sitemap-index.xml", site)` | Already correctly reads from `Astro.site` |
| `Layout.astro` canonical tag | existing | `<link rel="canonical" href={canonicalURL}>` — canonicalURL defaults to `new URL(Astro.url.pathname, Astro.url)` | Correctly computes per-page canonical from Astro's resolved URL |

### Supporting
| Tool | Purpose | When to Use |
|---|---|---|
| Wrangler (`wrangler.jsonc`) | Cloudflare Workers deploy; name already `bjro-dev` | Verify `bjro.dev` is configured as a custom domain in Cloudflare dashboard — not a code change |
| GitHub repository custom domain setting | Points `roobie.github.io` → `bjro.dev` with 301 | Manual infra step, document in plan as out-of-repo |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|---|---|---|
| Single `config.ts` edit | Per-page canonical overrides | More work, more error-prone — the single-source approach is correct |
| Cloudflare Redirect Rule | GitHub Pages custom domain | Either works; Cloudflare rule is more immediate, GitHub custom domain is simpler if GH Pages is the host |

## Architecture Patterns

### How URL Propagation Works in This Codebase

```
config.ts  →  SITE.website
                  ↓
           astro.config.ts  →  site: SITE.website  →  Astro.site
                                                            ↓
                                              @astrojs/sitemap  →  sitemap-index.xml
                                              robots.txt.ts     →  robots.txt Sitemap: line
                                              Layout.astro      →  RSS feed <link> href
```

`canonicalURL` in `Layout.astro` is computed from `Astro.url` (the runtime request URL), not from `SITE.website`, which means it will reflect whatever domain serves the page. On bjro.dev it will produce `https://bjro.dev/…` correctly without any additional code change.

### Pattern 1: Single-File Site Identity
**What:** All identity values (`website`, `desc`, `profile`, `author`) live in `site/src/config.ts` and are imported everywhere via `SITE`.
**When to use:** Always. This is the established pattern for this codebase.
**Example:**
```typescript
// site/src/config.ts
export const SITE = {
  website: "https://bjro.dev/",
  author: "Björn Roberg",
  profile: "https://bjro.dev/",
  desc: "Writing on AI agents, developer tooling, and software architecture — by Björn Roberg.",
  // ...
} as const;
```

### Pattern 2: robots.txt via Astro API Route
**What:** `robots.txt.ts` uses the `site` injected by Astro (which equals `SITE.website` via `astro.config.ts`) — no hardcoded domain.
**When to use:** No change needed. Updating `SITE.website` fixes robots.txt automatically.

### Pattern 3: GitHub Pages 301 Redirect (Manual Infra)
**What:** GitHub Pages supports a custom domain field in the repository settings. Setting it to `bjro.dev` causes GitHub to issue 301 redirects from `roobie.github.io` → `bjro.dev`.
**When to use:** Document as a manual step. This is outside the repo's source code.

### Anti-Patterns to Avoid
- **Hardcoding `bjro.dev` in individual `.astro` files:** `SITE.website` is the single source of truth; do not bypass it.
- **Adding a CNAME file to `public/`:** Only needed for GitHub Pages hosting; the site now deploys via Cloudflare Workers, where domain config lives in the dashboard.
- **Changing `canonicalURL` default in `Layout.astro`:** The current `new URL(Astro.url.pathname, Astro.url)` is correct — it reflects the serving domain dynamically.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Sitemap generation | Custom sitemap route | `@astrojs/sitemap` already installed | Handles filtering, lastmod, multi-sitemap indexing automatically |
| robots.txt | Static file in `public/` | `robots.txt.ts` API route already exists | Dynamic sitemap URL from `Astro.site`; static file would hardcode domain |
| Canonical URL logic | Per-page canonical computation | Astro's `Astro.url` runtime value | Already correct; no code change needed |

**Key insight:** This phase is almost entirely a configuration edit, not a code change. The plumbing already exists and correctly reads from `SITE.website`.

## Common Pitfalls

### Pitfall 1: Forgetting `SITE.profile`
**What goes wrong:** `SITE.profile` is used in the `article:author` OG tag and in the JSON-LD `BlogPosting` author URL. Leaving it as `https://roobie.github.io/` causes a mismatch after the domain change.
**Why it happens:** `profile` is a separate field from `website` and easy to overlook.
**How to avoid:** Update both `SITE.website` and `SITE.profile` in the same edit.
**Warning signs:** `<meta property="article:author" content="https://roobie.github.io/">` in page source after the change.

### Pitfall 2: robots.txt Leading Blank Line
**What goes wrong:** The current `getRobotsTxt` template string in `robots.txt.ts` starts with a newline (template literal after the backtick). Some crawlers reject robots.txt files with a leading blank line.
**Why it happens:** Template literal formatting.
**How to avoid:** Fix the template string to start immediately: `return \`User-agent: *\n…\`` — Phase 9 also lists this, but it can be bundled here.
**Warning signs:** `\n\nUser-agent:` at the top of the generated robots.txt.

### Pitfall 3: `SITE.desc` Missing Keyword Signal
**What goes wrong:** "philosophy, technology, and life" does not match any query a developer or AI researcher would use. It provides zero topical signal to crawlers or LLMs.
**Why it happens:** Default AstroPaper placeholder was never updated.
**How to avoid:** Write a description that includes: AI agents, developer tooling, software architecture, and the author's name. Keep it 120-160 characters.
**Warning signs:** The old text still appears in `<meta name="description">` after the change.

### Pitfall 4: GitHub Pages Custom Domain vs. Cloudflare Deploy
**What goes wrong:** The repo has both a GitHub Actions deploy workflow AND a Cloudflare Wrangler deploy. If GitHub Pages is still active and serving `roobie.github.io`, the redirect must be configured there. If Cloudflare is the authoritative host for `bjro.dev`, the redirect from the old GH Pages URL is a GitHub-side infra setting.
**Why it happens:** Two deployment targets co-exist.
**How to avoid:** Confirm which host is authoritative for `bjro.dev`. Based on `wrangler.jsonc` and `package.json deploy: "bunx wrangler deploy"`, Cloudflare Workers is the live host. The GitHub Pages workflow may be vestigial. Document this clearly in the plan.
**Warning signs:** `roobie.github.io` still serves the old content without redirect.

### Pitfall 5: `editPost.url` Hardcodes GitHub Path
**What goes wrong:** `editPost.url` in `config.ts` points to `https://github.com/roobie/roobie.github.io/edit/master/`. This is a GitHub edit link for posts and does not involve the domain — it should stay as-is. Do not confuse it with a canonical URL.
**Why it happens:** Easy to see the GitHub URL and wonder if it needs updating.
**How to avoid:** Leave `editPost.url` unchanged. It is a source-editing link, not a canonical URL.

## Code Examples

### Corrected `config.ts` (the only file that needs editing)
```typescript
// site/src/config.ts
export const SITE = {
  website: "https://bjro.dev/",
  author: "Björn Roberg",
  profile: "https://bjro.dev/",
  desc: "Writing on AI agents, developer tooling, and software architecture — by Björn Roberg.",
  title: "Cogitate",
  // ... rest unchanged
} as const;
```

### robots.txt leading-blank-line fix (bundle with this phase)
```typescript
// site/src/pages/robots.txt.ts
const getRobotsTxt = (sitemapURL: URL) => `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;
```
(Remove the newline between the opening backtick and `User-agent:`.)

### Verifying domain propagation after build
```bash
cd site && pnpm build
grep "bjro.dev" dist/sitemap-index.xml
grep "bjro.dev" dist/robots.txt
grep "bjro.dev" dist/index.html | head -5
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| Static `public/robots.txt` | `robots.txt.ts` API route | AstroPaper v5 pattern | Domain auto-derives from `Astro.site` |
| GitHub Pages only | Cloudflare Workers via Wrangler | This project's setup | Deploy is `bunx wrangler deploy`, not GH Actions build |
| Placeholder `SITE.desc` | Needs keyword-bearing description | Phase 6 target | Affects meta description, OG tags, and AI citation signal |

**Deprecated/outdated:**
- The GitHub Actions deploy workflow (`.github/workflows/deploy.yml`) appears to be vestigial if Cloudflare Workers is the live host. Needs confirmation but is out of scope for this phase — document as a note.

## Open Questions

1. **Is GitHub Pages still the active host or is Cloudflare Workers?**
   - What we know: `wrangler.jsonc` exists with `name: "bjro-dev"`, `package.json` has `deploy: "bunx wrangler deploy"`, GitHub Actions workflow also exists
   - What's unclear: Which one is actually serving `bjro.dev` live
   - Recommendation: The plan should instruct the implementer to verify via `curl -I https://bjro.dev` and check the `Server:` header. Either way, `SITE.website` must be updated.

2. **Should `SITE.profile` point to `https://bjro.dev/` or `https://bjro.dev/about`?**
   - What we know: The about page exists at `/about`; success criteria say "bjro.dev/ or an about page on that domain"
   - What's unclear: User preference
   - Recommendation: Use `https://bjro.dev/about` — it is more specific and provides a richer E-E-A-T signal as the author profile URL in JSON-LD.

## Validation Architecture

### Test Framework
| Property | Value |
|---|---|
| Framework | None — Astro build output inspection only |
| Config file | none |
| Quick run command | `cd site && pnpm build 2>&1 \| tail -5` |
| Full suite command | `cd site && pnpm build && grep -r "bjro.dev" site/dist/sitemap-index.xml site/dist/robots.txt` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|---|---|---|---|---|
| SC-1 | `SITE.website` = `https://bjro.dev/` and sitemap/robots reference it | smoke | `grep "bjro.dev" site/dist/sitemap-index.xml && grep "bjro.dev" site/dist/robots.txt` | ❌ Wave 0 (run after build) |
| SC-2 | `SITE.desc` contains AI/dev keywords | smoke | `grep -i "ai agents\|developer tooling\|software architecture" site/src/config.ts` | ❌ Wave 0 |
| SC-3 | `SITE.profile` points to bjro.dev | smoke | `grep "profile" site/src/config.ts \| grep "bjro.dev"` | ❌ Wave 0 |
| SC-4 | roobie.github.io redirect | manual | `curl -I https://roobie.github.io` — check for 301 to bjro.dev | manual-only (infra) |

### Sampling Rate
- **Per task commit:** `cd site && grep "website\|profile\|desc" site/src/config.ts`
- **Per wave merge:** `cd site && pnpm build && grep "bjro.dev" dist/sitemap-index.xml dist/robots.txt`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- No test framework needed — verification is grep-on-build-output
- [ ] Manual infra verification step documented: confirm roobie.github.io → bjro.dev redirect

## Sources

### Primary (HIGH confidence)
- Direct code inspection of `site/src/config.ts`, `site/astro.config.ts`, `site/src/layouts/Layout.astro`, `site/src/pages/robots.txt.ts` — all verified by reading files above
- Direct inspection of `site/wrangler.jsonc` confirming Cloudflare Workers deployment with name `bjro-dev`
- `@astrojs/sitemap` integration in `astro.config.ts` — confirms sitemap derives from `SITE.website` via `site: SITE.website`

### Secondary (MEDIUM confidence)
- Astro docs pattern: `site` property in `defineConfig` propagates to all integrations including `@astrojs/sitemap`
- GitHub Pages custom domain 301 behavior — standard GitHub feature, well-documented

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all relevant files read directly, no external assumptions
- Architecture: HIGH — URL propagation chain verified by reading source code
- Pitfalls: HIGH for code items (robots.txt blank line, profile field); MEDIUM for infra items (GitHub Pages vs Cloudflare)

**Research date:** 2026-03-22
**Valid until:** 2026-06-22 (stable — Astro config patterns are well-established)
