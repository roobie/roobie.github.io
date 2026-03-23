---
phase: 7
slug: tag-taxonomy-and-post-metadata
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro build (Zod schema validation) |
| **Config file** | `site/astro.config.ts` |
| **Quick run command** | `grep -rE 'computing\|braindump\|discussion\|"tool"' site/src/data/blog/` |
| **Full suite command** | `cd site && pnpm build` |
| **Estimated runtime** | ~30 seconds (build time) |

---

## Sampling Rate

- **After every task commit:** Run `grep -rE 'computing\|braindump\|discussion' site/src/data/blog/` to confirm vague tag removal
- **After every plan wave:** Run `cd site && pnpm build` — must pass clean
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | SEO-1 | smoke | `grep -rEc 'computing\|braindump\|discussion' site/src/data/blog/ \| grep -v ':0$'` exits non-zero (no matches) | N/A | ⬜ pending |
| 07-01-02 | 01 | 1 | SEO-3 | smoke | `grep -rP '^title: "\w+"$' site/src/data/blog/` exits non-zero (no single-word titles) | N/A | ⬜ pending |
| 07-01-03 | 01 | 1 | Schema | build | `cd site && pnpm build` exits 0 | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Descriptions 120-160 chars with keyword | SEO-2 | Character count is judgment-based | Spot-check 5 random posts, verify description length and keyword presence |
| Tag clusters are coherent | SEO-4 | Taxonomy quality is subjective | Review full tag list, confirm topical grouping |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
