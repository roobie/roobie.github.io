---
phase: 5
slug: apply-edits-as-per-the-ai-seo-suggestions
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-16
---

# Phase 5 — Validation Strategy

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
| 05-01-01 | 01 | 1 | Structured data + OG tags | build | `cd site && pnpm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework needed — `astro check` and `astro build` are sufficient.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| JSON-LD only on post pages | Structured data fix | Inspect HTML source | View source on homepage vs blog post, verify BlogPosting only on posts |
| og:type correct per page | OG meta tags | Inspect HTML source | Check homepage has og:type=website, post has og:type=article |
| article:tag rendered | OG article tags | Inspect HTML source | View post source, verify article:tag meta tags present |

---

## Validation Sign-Off

- [ ] All tasks have automated build verification
- [ ] Sampling continuity: build runs after every task
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
