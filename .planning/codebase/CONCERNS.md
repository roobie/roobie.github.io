# Codebase Concerns

**Analysis Date:** 2026-03-10

## Tech Debt

**Theme Preference Persistence:**
- Issue: Theme preference is never actually persisted to localStorage despite having infrastructure for it. Line 28 in `src/scripts/theme.ts` has `localStorage.setItem(THEME, themeValue)` commented out, meaning user theme choice is lost on page reload.
- Files: `src/scripts/theme.ts` (line 28), `src/layouts/Layout.astro` (line 145)
- Impact: Poor user experience—users cannot maintain preferred theme across sessions. Theme will always reset to system preference or default.
- Fix approach: Uncomment the `localStorage.setItem()` call and ensure it's called whenever `setPreference()` is triggered.

**Dead Code - sessionStorage Usage:**
- Issue: Multiple components reference `sessionStorage.setItem("backUrl", ...)` but all calls are commented out: `src/pages/search.astro` (line 55), `src/pages/index.astro`, `src/layouts/Main.astro`. The BackButton tries to retrieve this value but it's never set.
- Files: `src/components/BackButton.astro` (line 28), `src/pages/search.astro` (line 55), `src/pages/index.astro`, `src/layouts/Main.astro`
- Impact: Back button navigation tracking is broken—users cannot return to their previous search or navigation point.
- Fix approach: Either implement proper sessionStorage management across navigation or remove the feature entirely.

**Font Loading Error Handling:**
- Issue: `src/utils/loadGoogleFont.ts` throws generic "Failed to download dynamic font" errors without fallback or graceful degradation. If font loading fails during build, the entire OG image generation fails silently.
- Files: `src/utils/loadGoogleFont.ts` (lines 21, 26)
- Impact: Dynamic OG image generation can fail completely, breaking social media preview generation without clear diagnostic output.
- Fix approach: Add retry logic, detailed error logging, and graceful fallback to system fonts for OG image generation.

**Unhandled Promise in Pagefind Initialization:**
- Issue: `src/pages/search.astro` initializes Pagefind inside `requestIdleCallback` without error handling. If Pagefind fails to load, the error is silently swallowed.
- Files: `src/pages/search.astro` (lines 31-88)
- Impact: Search feature silently fails in production if Pagefind module fails to load, users see blank search page.
- Fix approach: Add try-catch around the dynamic import and provide user-visible fallback UI if search initialization fails.

**Build Step Side Effects:**
- Issue: Build script in `package.json` (line 7) manually copies pagefind output with `cp -r dist/pagefind public/` after build. This is fragile and platform-dependent (will fail on Windows).
- Files: `package.json` (line 7)
- Impact: Build fails on Windows or WSL without GNU cp available. Deployment pipeline broken for non-Unix systems.
- Fix approach: Use cross-platform build tooling (Node.js fs APIs or dedicated build orchestration).

## Security Considerations

**Hardcoded Analytics and Tracking Scripts:**
- Risk: Custom analytics script loaded from `cog-script.bjorn-roberg.workers.dev` (line 173-175 in `src/layouts/Layout.astro`) with no integrity checking or fallback. If Cloudflare Worker is compromised, site could be injected with malicious code.
- Files: `src/layouts/Layout.astro` (lines 173-175)
- Current mitigation: None. Script loaded from third-party origin with defer attribute.
- Recommendations: Add Subresource Integrity (SRI) hash to the script tag, or use CSP nonce to limit scope. Consider self-hosting analytics if possible.

**Missing Content Security Policy:**
- Risk: No CSP headers or meta tags defined. Site accepts inline scripts and dynamically loads external resources (`@pagefind/default-ui`, fonts, analytics).
- Files: All files loading external resources
- Current mitigation: None
- Recommendations: Define restrictive CSP in Astro config or HTTP headers, at minimum require `script-src 'self'` with exceptions for trusted third parties via nonce.

**localStorage Access in Inline Scripts:**
- Risk: Theme and navigation state stored in localStorage without JSON validation. Malformed localStorage entries could cause script errors or unexpected behavior.
- Files: `src/layouts/Layout.astro` (line 145), `src/scripts/theme.ts` (line 12), `src/components/BackButton.astro` (line 28)
- Current mitigation: None. Direct string comparisons against localStorage values.
- Recommendations: Add validation/try-catch around localStorage access to prevent XSS if storage is polluted.

## Performance Bottlenecks

**Dynamic OG Image Generation at Build Time:**
- Problem: `src/pages/posts/[...slug]/index.png.ts` generates an OG image for every blog post during build (17 posts currently). Uses Resvg (native binary) and Satori for SVG rendering—slow.
- Files: `src/utils/generateOgImages.ts`, `src/pages/posts/[...slug]/index.png.ts`
- Cause: Sequential async operations in `loadGoogleFonts()` (Promise.all is good, but font fetching from Google Fonts API is network-bound). Resvg rendering is CPU-bound.
- Improvement path: Cache generated OG images, generate them on-demand at runtime instead of build-time, or pre-generate only for popular posts.

**Full-Page Search Index Rebuild:**
- Problem: Pagefind rebuilds complete search index on every build. With Astro static generation, this happens frequently during development.
- Files: `package.json` (line 7 - build script runs pagefind)
- Cause: Pagefind is designed for static site generation; requires re-indexing after build.
- Improvement path: Conditional indexing (only on production builds), or switch to client-side search library for better DX.

**Scroll Event Listener Without Cleanup:**
- Problem: `src/layouts/PostDetails.astro` (line 192) and `src/components/BackToTopButton.astro` (line 77) attach scroll event listeners globally without cleanup. On page transition, listeners accumulate.
- Files: `src/layouts/PostDetails.astro` (lines 167-286), `src/components/BackToTopButton.astro` (line 77)
- Cause: Inline scripts marked with `data-astro-rerun` re-execute on every page transition but listeners aren't removed from previous execution.
- Improvement path: Use event delegation or modern Astro transitions API to avoid re-registering listeners.

**Inline Script Execution on Every View Transition:**
- Problem: Multiple inline scripts marked `is:inline data-astro-rerun` execute on every page transition (progress bar creation, heading link injection, copy button attachment). These do DOM manipulation repeatedly.
- Files: `src/layouts/PostDetails.astro` (lines 167-286)
- Impact: Layout thrashing and repeated DOM queries on every navigation.
- Improvement path: Use Astro's lifecycle hooks (`astro:page-load`) instead of inline re-running scripts.

## Fragile Areas

**Heading Link Generation Logic:**
- Files: `src/layouts/PostDetails.astro` (lines 209-228)
- Why fragile: Assumes all headings have IDs (set by Shiki/markdown renderer). If ID generation changes, links silently fail. No error handling if heading doesn't have an ID.
- Safe modification: Add validation that heading.id exists before creating link; fallback to generating a synthetic ID if missing.
- Test coverage: No test coverage for heading link generation.

**Copy-to-Clipboard Implementation:**
- Files: `src/layouts/PostDetails.astro` (lines 231-280)
- Why fragile: Uses `navigator.clipboard.writeText()` without checking if clipboard API is available (fails in non-HTTPS contexts). Assumes code block structure is consistent (querySelector searching for nested `<code>`).
- Safe modification: Check `navigator.clipboard` availability; use fallback approach (textarea + document.execCommand) for older browsers.
- Test coverage: No tests for clipboard functionality.

**Progress Bar CSS Calculation:**
- Files: `src/layouts/PostDetails.astro` (lines 189-207)
- Why fragile: Uses `document.documentElement.scrollHeight - document.documentElement.clientHeight` to calculate scroll range. Can be unreliable if page height changes dynamically (e.g., lazy-loaded images). No debouncing on frequent updates.
- Safe modification: Use ResizeObserver to detect layout changes; validate scroll calculations.
- Test coverage: None.

**Date Parsing in Post Filter:**
- Files: `src/utils/postFilter.ts` (line 7)
- Why fragile: `new Date(data.pubDatetime)` assumes ISO format. If frontmatter has invalid date, results in NaN. No error handling for invalid dates.
- Safe modification: Use z.date() validation from zod ensures date is valid at content load time, but add defensive check in postFilter.
- Test coverage: Limited—only type-checked, not tested at runtime.

**Theme Detection Race Condition:**
- Files: `src/layouts/Layout.astro` (lines 142-169), `src/scripts/theme.ts` (lines 24-25, 71-72)
- Why fragile: Inline script in Layout runs early to prevent FOUC, but main theme script in `src/scripts/theme.ts` runs later. If they run out of order or before DOM is ready, `document.firstElementChild` can be null. Line 72 calls `reflectPreference()` but doesn't check if body element is ready.
- Safe modification: Ensure inline script and external script are coordinated; use DOMContentLoaded or similar guard.
- Test coverage: None; browser behavior only.

## Test Coverage Gaps

**Zero Automated Testing:**
- What's not tested: Entire codebase has no test files. No unit tests for utilities, no integration tests for page generation, no E2E tests for user flows.
- Files: All source files under `src/`
- Risk: Refactoring utilities (e.g., `getPath`, `slugify`, date filtering) could break silently. OG image generation changes could fail without detection.
- Priority: High—recommend setting up Jest or Vitest for at least utility functions.

**No Tests for Build Artifacts:**
- What's not tested: Dynamic route generation (`getStaticPaths()`), OG image generation endpoints, RSS feed generation.
- Files: `src/pages/posts/[...slug]/index.png.ts`, `src/pages/rss.xml.ts`, `src/pages/og.png.ts`
- Risk: Changes to these routes could result in broken image URLs or malformed RSS feeds without catching it in CI.
- Priority: High—add integration tests for build output validation.

**No Tests for Date/Timezone Logic:**
- What's not tested: Post filtering by publish date, scheduled post handling, timezone conversion in `src/utils/postFilter.ts`.
- Files: `src/utils/postFilter.ts`, `src/utils/getSortedPosts.ts`, `src/layouts/PostDetails.astro`
- Risk: Timezone-aware date logic is error-prone. Scheduled posts could appear unexpectedly or not appear when expected.
- Priority: Medium—add unit tests for date comparisons.

**No Type-Level Testing:**
- What's not tested: TypeScript types are checked at compile time but not at runtime. If Zod schema changes, consuming code might not be updated correctly.
- Files: `src/content.config.ts` (schema definition), all components using post data
- Risk: Runtime type mismatches if content schema evolves without updating consumers.
- Priority: Medium—strengthen with runtime schema validation or strict type tests.

## Scaling Limits

**Static Build for Every Change:**
- Current capacity: Supports 17 blog posts. Build time reasonable, but would degrade with hundreds of posts.
- Limit: Each post generates OG image (CPU-bound). 100+ posts = build time >5 minutes.
- Scaling path: Move to on-demand OG image generation (e.g., API route), implement incremental builds, or split blog into multiple sites.

**Search Index Size:**
- Current capacity: Pagefind index in `public/pagefind/` reasonable for 17 posts.
- Limit: 1000+ posts would result in multi-MB index, slowing client-side search initialization.
- Scaling path: Consider server-side search (Algolia, MeiliSearch) or lazy-load search index only when search page is visited.

## Known Bugs

**Theme Button State Not Synced on Page Transition:**
- Symptoms: On initial page load, theme button aria-label is set correctly. On Astro view transition to another page, aria-label isn't always updated correctly if theme was just changed.
- Files: `src/scripts/theme.ts` (line 35), Layout inline script re-runs
- Trigger: 1. Load page 2. Click theme button 3. Navigate to another page with view transition 4. Check theme button aria-label
- Workaround: Refresh page or wait for auto-sync from system preference change listener.

**Back Button Href Never Updated:**
- Symptoms: Back button always links to "/" because sessionStorage.setItem is commented out.
- Files: `src/components/BackButton.astro` (line 28)
- Trigger: Navigate to /search or /tags, then click back button—goes to home instead of previous page.
- Workaround: None—user must use browser back button instead.

## Dependencies at Risk

**@resvg/resvg-js Native Binding:**
- Risk: Native dependency for rendering SVG to PNG. Requires native compilation during install. Can fail on uncommon architectures or CI environments.
- Impact: Build fails if native binary doesn't compile (no JavaScript fallback).
- Files: `site/package.json` (line 18), `src/utils/generateOgImages.ts`
- Migration plan: Replace with pure-JavaScript SVG-to-PNG library (e.g., canvg + canvas) or generate OG images server-side instead.

**@pagefind/default-ui TypeScript Support:**
- Risk: Missing types—file `src/pages/search.astro` line 32 has `@ts-expect-error` comment acknowledging missing types. Breaks type safety.
- Impact: Search UI could change API between versions without TypeScript catching it.
- Files: `src/pages/search.astro` (line 32)
- Migration plan: Either find type definitions package or consider alternative search UI library with better TypeScript support.

**Outdated Tailwind CSS Integration:**
- Risk: `astro.config.ts` line 39 has `@ts-ignore` comment: "This will be fixed in Astro 6 with Vite 7 support". Code relies on a workaround that may break when Astro 6 releases.
- Impact: Build fails unexpectedly when updating to Astro 6.
- Files: `site/astro.config.ts` (lines 38-41)
- Migration plan: Track Astro 6 release and test with Vite 7 support; remove workaround.

---

*Concerns audit: 2026-03-10*
