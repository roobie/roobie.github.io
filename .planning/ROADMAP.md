# Roadmap: roobie.github.io Content Production

## Overview

Three phases build an AI-assisted writing workflow on top of a blog that already works. Phase 1 creates the persistent context and idea capture that every session depends on. Phase 2 delivers the end-to-end path from idea to published post and validates the workflow on real content. Phase 3 tightens the workflow with post-type awareness and tag normalization, adding optional tooling only where real friction has been identified.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Workflow Foundation** - CLAUDE.md and idea backlog in place, every AI session starts with full context
- [ ] **Phase 2: Core Content Workflow** - Complete end-to-end path from idea to published post, first AI-assisted post shipped
- [ ] **Phase 3: Workflow Enhancement** - Post-type templates and tag normalization sharpen the workflow based on real experience

## Phase Details

### Phase 1: Workflow Foundation
**Goal**: Every AI writing session starts with consistent context — voice, schema, conventions, and idea capture are in place before any content is produced
**Depends on**: Nothing (first phase)
**Requirements**: VOIC-02, MGMT-01, MGMT-02
**Success Criteria** (what must be TRUE):
  1. CLAUDE.md exists at the repo root and loads automatically into every Claude Code session with blog voice, frontmatter schema, attribution format, and pointers to exemplary existing posts
  2. A structured idea backlog file exists where a new post idea can be captured in under two minutes with topic, angle, and related posts
  3. The idea backlog can be reviewed and prioritized without any external tool — it is a readable, structured markdown file
**Plans**: TBD

### Phase 2: Core Content Workflow
**Goal**: Users can take a post idea from the backlog to a committed, published markdown file using a validated AI-assisted workflow
**Depends on**: Phase 1
**Requirements**: SCAF-01, SCAF-02, VOIC-01, PUBL-01
**Success Criteria** (what must be TRUE):
  1. User can create a new blog post file with valid, schema-conforming frontmatter and `draft: true` set, in the correct directory, without manual field lookup
  2. A writing session can reference 2-3 existing posts for voice consistency without the user having to manually locate and paste them
  3. User can promote a draft to published by running a single documented step that sets `draft: false`, `pubDatetime`, and `modDatetime` correctly
  4. At least one complete AI-assisted post has been produced and committed through the full workflow
**Plans**: TBD

### Phase 3: Workflow Enhancement
**Goal**: Post-type awareness and tag normalization reduce friction and prevent quality regressions, based on friction discovered in real workflow use
**Depends on**: Phase 2
**Requirements**: SCAF-03, PUBL-02
**Success Criteria** (what must be TRUE):
  1. When starting a comparison, tutorial, or braindump post, a dedicated prompt template is available that shapes the outline and section structure for that format
  2. When generating frontmatter tags, the existing tag list is surfaced so new tags are only created when no existing tag fits
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Workflow Foundation | 0/? | Not started | - |
| 2. Core Content Workflow | 0/? | Not started | - |
| 3. Workflow Enhancement | 0/? | Not started | - |

### Phase 4: Apply edits as per the frontend-designer's suggestions

**Goal:** Apply low-tech, content-focused UI/UX improvements from frontend design review -- typography, hero, card hierarchy, dark mode contrast, footer license, about bio, date format, and pagination
**Requirements**: Ad-hoc (design review)
**Depends on:** None (independent of content workflow phases)
**Plans:** 3 plans

Plans:
- [ ] 04-01-PLAN.md — Font system, dark mode border fix, date format, pagination config
- [ ] 04-02-PLAN.md — Hero rewrite, card tag pills, footer license, about page bio
- [ ] 04-03-PLAN.md — Visual verification checkpoint
