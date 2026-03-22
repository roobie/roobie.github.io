---
phase: 6
slug: domain-and-site-identity
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Astro build output inspection only |
| **Config file** | none |
| **Quick run command** | `cd site && grep "website\|profile\|desc" src/config.ts` |
| **Full suite command** | `cd site && pnpm build && grep "bjro.dev" dist/sitemap-index.xml dist/robots.txt` |
| **Estimated runtime** | ~30 seconds (build time) |

---

## Sampling Rate

- **After every task commit:** Run `cd site && grep "website\|profile\|desc" src/config.ts`
- **After every plan wave:** Run `cd site && pnpm build && grep "bjro.dev" dist/sitemap-index.xml dist/robots.txt`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | SC-1 | smoke | `grep "bjro.dev" site/dist/sitemap-index.xml && grep "bjro.dev" site/dist/robots.txt` | ❌ W0 | ⬜ pending |
| 06-01-02 | 01 | 1 | SC-2 | smoke | `grep -iE "ai agents\|developer tooling\|software architecture" site/src/config.ts` | ❌ W0 | ⬜ pending |
| 06-01-03 | 01 | 1 | SC-3 | smoke | `grep "profile" site/src/config.ts \| grep "bjro.dev"` | ❌ W0 | ⬜ pending |
| 06-01-04 | 01 | 1 | SC-4 | manual | `curl -I https://roobie.github.io` — check 301 to bjro.dev | manual-only | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- No test framework installation needed — verification is grep-on-build-output
- [ ] Manual infra verification step documented: confirm roobie.github.io → bjro.dev redirect

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| roobie.github.io 301 redirect | SC-4 | GitHub Pages infra setting, outside repo | Run `curl -I https://roobie.github.io` and verify `Location: https://bjro.dev/` header |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
