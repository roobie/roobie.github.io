---
phase: 8
slug: structured-data-e-e-a-t
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Astro build + grep inspection |
| **Config file** | none |
| **Quick run command** | `cd site && pnpm build` |
| **Full suite command** | `cd site && pnpm build && pnpm lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd site && pnpm build`
- **After every plan wave:** Run `cd site && pnpm build && pnpm lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | Ad-hoc-1 | smoke | `grep "publisher" site/src/layouts/Layout.astro` | ✅ | ⬜ pending |
| 08-02-01 | 02 | 1 | Ad-hoc-2 | smoke | `grep -c "AI agents\|developer tooling\|casq\|cairn\|slog" site/src/pages/about.md` | ✅ | ⬜ pending |
| 08-03-01 | 03 | 1 | Ad-hoc-3 | smoke | `grep -c "/posts/" site/src/data/blog/{agent-post}.md` per post | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| JSON-LD renders correctly in built HTML | Ad-hoc-1 | Need to inspect built output script tag | Build, then `grep -A20 'application/ld+json' site/dist/client/posts/*/index.html \| head -30` |
| About page reads well and has correct links | Ad-hoc-2 | Content quality is judgment | Visit /about in browser or inspect built HTML |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
