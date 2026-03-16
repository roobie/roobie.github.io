---
phase: 4
slug: apply-edits-as-per-the-frontend-designer-s-suggestions
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | astro check (TypeScript) + astro build (full pipeline) |
| **Config file** | site/astro.config.ts |
| **Quick run command** | `cd site && pnpm run build` |
| **Full suite command** | `cd site && pnpm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd site && pnpm run build`
- **After every plan wave:** Run `cd site && pnpm run build`
- **Before `/gsd:verify-work`:** Full build must succeed
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | Typography | build | `cd site && pnpm run build` | N/A | ⬜ pending |
| 04-02-01 | 02 | 1 | Hero rewrite | build | `cd site && pnpm run build` | N/A | ⬜ pending |
| 04-03-01 | 03 | 1 | Card improvements | build | `cd site && pnpm run build` | N/A | ⬜ pending |
| 04-04-01 | 04 | 1 | About page | build | `cd site && pnpm run build` | N/A | ⬜ pending |
| 04-05-01 | 05 | 1 | Dark mode contrast | build | `cd site && pnpm run build` | N/A | ⬜ pending |
| 04-06-01 | 06 | 1 | Footer/license | build | `cd site && pnpm run build` | N/A | ⬜ pending |
| 04-07-01 | 07 | 1 | Config tweaks | build | `cd site && pnpm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework installation needed -- `astro check` and `astro build` are sufficient for a content/CSS/config phase.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Body font renders proportional | Typography | Visual check | Run dev server, verify prose text uses serif font, code blocks use monospace |
| Dark mode borders visible | Contrast fix | Visual check | Toggle dark mode, verify section dividers are visible |
| Tag pills display on cards | Card improvements | Visual check | Check index page, verify tags appear below descriptions |
| Hero reads naturally | Hero rewrite | Subjective | Read homepage hero section, verify personality comes through |

---

## Validation Sign-Off

- [ ] All tasks have automated build verification
- [ ] Sampling continuity: build runs after every task
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
