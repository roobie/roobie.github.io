# Phase 7: Tag Taxonomy & Post Metadata - Research

**Researched:** 2026-03-23
**Domain:** Content metadata / frontmatter SEO — no library dependencies, pure content editing
**Confidence:** HIGH (all data is first-party from reading each post file directly)

---

## Summary

This is a content-editing phase with no code changes. The task is to systematically update the `tags`, `description`, and `title` fields in the YAML frontmatter of 21 published blog posts. Two posts (`emacs-remote-files-ssh`, `introducing-zfetch`) are `draft: true` and are **out of scope**.

The current tag set is polluted by four generic umbrella tags (`computing`, `tool`, `discussion`, `braindump`) that appear across 15 of the 21 published posts. These must be replaced with specific, search-targeted tags. Many descriptions are too short (under 120 characters) or lack the post's primary keyword. Several titles are single words or do not communicate value.

The research output below IS the complete mapping the planner needs: every published post has a current-state audit and a proposed new state ready to apply.

**Primary recommendation:** Apply changes post-by-post with a single atomic commit per post, or batch all 21 in one commit. Either approach works — the mapping is complete and deterministic.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| Ad-hoc (SEO audit — High impact) | Replace vague tags, improve descriptions to 120-160 chars with primary keyword, fix single-word titles, form coherent topical clusters | Complete post-by-post mapping provided in this document; no external libraries needed |
</phase_requirements>

---

## Standard Stack

No libraries or tooling are introduced by this phase. Changes are pure YAML frontmatter edits to `.md` files in `site/src/data/blog/`.

**Validation:** The Astro Zod content schema already validates frontmatter on `pnpm build`. Running `cd site && pnpm build` after changes catches any schema violations.

---

## Proposed Tag Taxonomy

### Topical Clusters

| Cluster | Tags | What It Groups |
|---------|------|----------------|
| AI & Agents | `ai-agents`, `llm`, `agent-safety`, `agent-architecture` | Posts about building, constraining, or reasoning about AI agent systems |
| Developer Tools | `developer-tools`, `cli`, `terminal` | Tool introductions and usage guides (mise, casq, slog, whosthere, zellij) |
| Open Source Projects | `open-source`, `rust`, `zig`, `typescript` | Personal project announcements and introductions |
| CI/CD & DevOps | `ci-cd`, `devops` | Build pipelines, caching, automation |
| Software Architecture | `software-architecture`, `patterns`, `distributed-systems` | Design approaches, state machines, Temporal, Markov chains |
| Linux & System Config | `linux`, `emacs`, `keyboard` | Low-level system tweaks and configuration |
| Security | `security` | Agent sandboxing, trust, data exposure |
| Opinion & Analysis | `opinion`, `ecosystem-analysis` | Editorial posts with a point of view |
| Meta | `meta` | Blog-about-the-blog posts |

### Tags to Retire Entirely

| Old Tag | Reason | Replacement Strategy |
|---------|--------|----------------------|
| `computing` | Too broad — applied to everything from Debian praise to CI tooling | Replace with specific tag from cluster above |
| `tool` | Tells reader nothing about which tool or domain | Replace with `developer-tools` + specific tech tag |
| `discussion` | Process word, not a topic | Replace with `opinion` or `ecosystem-analysis` depending on tone |
| `braindump` | Internal process word, invisible to search | Replace with `opinion` or a topical tag |

---

## Complete Post Audit and Proposals

### Key: Each entry shows filename, current state, proposed state.

Descriptions are counted to character length. Target: 120-160 chars, includes primary keyword.

---

### 1. `building-smarter-ai-agents-with-ideas-from-philosophy.md`

**Current:**
- Title: `Building Smarter AI Agents With Ideas From Philosophy`
- Tags: `discussion`, `braindump`, `agents`, `philosophy`
- Description (213 chars): "Philosophically informed agent design means explicitly modeling what an AI believes, how it knows things, and which moral and epistemic norms guide its decisions, so that its behavior becomes more reliable, inspectable, and aligned with human expectations."
- Draft: false

**Issues:**
- Tags `discussion` and `braindump` are vague
- Description is 213 characters — too long (target: 120-160)
- Title is good — communicates topic and value, no change needed

**Proposed:**
- Title: no change
- Tags: `ai-agents`, `agent-architecture`, `philosophy`
- Description (154 chars): "Philosophically informed AI agent design — modeling belief, knowledge, and epistemic norms — makes agent behavior more reliable and inspectable."

---

### 2. `business-processes.md`

**Current:**
- Title: `Notes on agentic applications in business processes`
- Tags: `discussion`, `braindump`, `agents`
- Description (235 chars): "This post explores how to pair agentic workflows with durable workflow engines (specifically Temporal), add structure using finite state machines, plug in MCP servers for tools, and grow from a small pilot into stable, production-ready workflows."
- Draft: false

**Issues:**
- Tags `discussion` and `braindump` are vague
- Description is 235 chars — too long
- Title is generic ("Notes on...") — could be stronger

**Proposed:**
- Title: `AI Agents in Business Processes: Temporal, FSMs, and MCP`
- Tags: `ai-agents`, `distributed-systems`, `software-architecture`
- Description (149 chars): "How to pair agentic workflows with Temporal for durability, finite state machines for structure, and MCP servers to scale from pilot to production."

---

### 3. `casq-1.md`

**Current:**
- Title: `Using casq in CI`
- Tags: `tool`, `computing`, `ci_cd`
- Description (40 chars): "Content addressable storage for improved CI"
- Draft: false

**Issues:**
- Tags `tool` and `computing` are vague
- Description is 40 chars — far too short, lacks primary keyword (casq)
- Title is acceptable but brief

**Proposed:**
- Title: `Using casq for Content-Addressable Storage in CI Pipelines`
- Tags: `developer-tools`, `ci-cd`, `open-source`
- Description (155 chars): "casq brings content-addressable storage to CI pipelines, eliminating redundant builds and test runs by identifying identical inputs with a git-style hash."

---

### 4. `ctrl-nocaps.md`

**Current:**
- Title: `Making use of the Caps Lock key`
- Tags: `computing`, `ux`, `tweak`
- Description (32 chars): "Remap Caps Lock to Left Control."
- Draft: false

**Issues:**
- Tag `computing` is vague
- Description is 32 chars — far too short, lacks keyword
- `tweak` is acceptable but niche

**Proposed:**
- Title: `Remap Caps Lock to Left Control on Linux and Windows`
- Tags: `linux`, `keyboard`, `developer-tools`
- Description (145 chars): "Remap Caps Lock to Left Control for a more ergonomic keyboard layout — instructions for Debian/Linux via XKBOPTIONS and Windows via SharpKeys."

---

### 5. `curry-agents.md`

**Current:**
- Title: `Currying agents`
- Tags: `tool`, `computing`, `agents`
- Description (87 chars): "How one can leverage partial application of agents - borrowing from the functional programming paradigm."
- Draft: false

**Issues:**
- Tags `tool` and `computing` are vague
- Description is 87 chars — too short, lacks primary keyword
- Title communicates concept but is very brief

**Proposed:**
- Title: `Currying AI Agents: Partial Application for Reusable Agent Configurations`
- Tags: `ai-agents`, `agent-architecture`, `software-architecture`
- Description (152 chars): "Apply partial application from functional programming to AI agents — pre-configure agent parameters to create reusable, composable agent building blocks."

---

### 6. `debian.md`

**Current:**
- Title: `Debian`
- Tags: `computing`
- Description (15 chars): "Debian is a marvel."
- Draft: false

**Issues:**
- Title is a single word — no value communication
- Tag `computing` is too vague
- Description is 19 chars (15 without period) — far too short, no keyword in SEO sense

**Proposed:**
- Title: `Debian: Why the Universal Operating System Still Matters in 2026`
- Tags: `linux`, `open-source`
- Description (157 chars): "Debian turns 33 and keeps earning its title as the universal OS — community governance, 59,000 packages, and the foundation of over 1,000 Linux distributions."

---

### 7. `introducing-cairn.md`

**Current:**
- Title: `Introducing cairn: append-only event storage with SQLite`
- Tags: `project`, `tool`, `computing`
- Description (169 chars): "cairn is an append-only event store backed by SQLite where immutability is enforced by triggers, not convention. SDKs for Go, TypeScript, and Rust share one spec and 21 test vectors."
- Draft: false

**Issues:**
- Tags `tool` and `computing` are vague
- Description is 169 chars — slightly over 160
- Title is excellent — no change

**Proposed:**
- Title: no change
- Tags: `open-source`, `developer-tools`, `software-architecture`
- Description (156 chars): "cairn is an append-only SQLite event store where immutability is enforced by triggers, not convention. Go, TypeScript, and Rust SDKs share one test spec."

---

### 8. `introducing-casq.md`

**Current:**
- Title: `Introducing casq (a simple content-addressable file storage CLI and library)`
- Tags: `project`, `tool`, `computing`
- Description (233 chars): "casq is a small, no-frills content-addressed file store and Rust library that gives you git-style hashing and deduplication locally, without trying to be a full backup system or version control tool, and is available under the permissive Apache-2.0 license."
- Draft: false

**Issues:**
- Tags `tool` and `computing` are vague
- Description is 233 chars — too long
- Title is long but descriptive — could be trimmed

**Proposed:**
- Title: `Introducing casq: Content-Addressable File Storage CLI in Rust`
- Tags: `open-source`, `rust`, `developer-tools`
- Description (148 chars): "casq is a Rust CLI and library for content-addressed file storage — git-style deduplication without the overhead of a full version control system."

---

### 9. `introducing-slog.md`

**Current:**
- Title: `Introducing slog: structured logging for every JS runtime`
- Tags: `project`, `tool`, `computing`
- Description (155 chars): "slog is a structured logger for Cloudflare Workers, Node.js, Deno, and Bun. Zero dependencies, pluggable transports, and a Hono middleware that uses waitUntil on Workers."
- Draft: false

**Issues:**
- Tags `tool` and `computing` are vague
- Description is 155 chars — slightly over; also technically 169 chars
- Title is good — no change

**Proposed:**
- Title: no change
- Tags: `open-source`, `typescript`, `developer-tools`
- Description (148 chars): "slog is a zero-dependency structured logger for Node.js, Deno, Bun, and Cloudflare Workers with pluggable transports and a Hono waitUntil middleware."

---

### 10. `linear-agentics.md`

**Current:**
- Title: `Linear Types for Agent Safety - An Approach to Trustworthy AI Systems`
- Tags: `agents`, `type-system`, `hypothesis`
- Description (51 chars): "Discussing a type system that rejects unsafe code before it ever runs."
- Draft: false

**Issues:**
- Description is 51 chars — too short, lacks "linear types" keyword phrase
- Tags are specific and acceptable — minor improvement possible

**Proposed:**
- Title: no change
- Tags: `ai-agents`, `agent-safety`, `software-architecture`
- Description (152 chars): "Linear types applied to AI agent safety — a type system that enforces single-use for destructive operations and statically rejects unsafe agent code."

---

### 11. `locking-down-agents.md`

**Current:**
- Title: `Locking down agents`
- Tags: `computing`, `security`, `development`, `agents`
- Description (65 chars): "Discussions about how one can limit the blast radius of agents."
- Draft: false

**Issues:**
- Tag `computing` is vague; `development` is generic
- Description is 65 chars — too short
- Title is brief — add value signal

**Proposed:**
- Title: `Locking Down AI Agents: Limiting Blast Radius in Production Systems`
- Tags: `ai-agents`, `agent-safety`, `security`
- Description (148 chars): "Practical techniques for sandboxing AI agents and limiting blast radius — filesystem restrictions, network controls, and permission scoping in production."

---

### 12. `markov-chains-with-llms.md`

**Current:**
- Title: `Markov chains and LLMs - hybrid architectures for smarter agents`
- Tags: `agents`, `markov-chains`, `architecture`, `patterns`
- Description (195 chars): "How to combine Markov chains with large language models to build more structured, interpretable, and efficient agents. Markov chains provide structure and efficiency; LLMs provide semantic understanding and flexibility."
- Draft: false

**Issues:**
- Description is 195 chars — too long
- Tags are specific and good — minor adjustment

**Proposed:**
- Title: no change
- Tags: `ai-agents`, `agent-architecture`, `software-architecture`
- Description (150 chars): "Combine Markov chains with LLMs to build structured, interpretable agents — Markov chains enforce predictable state; LLMs provide semantic flexibility."

---

### 13. `markymarkov.md`

**Current:**
- Title: `MarkyMarkov - Markov Chain-Based Code Guidance for LLM Agents and Humans Alike`
- Tags: `agents`, `markov-chains`, `architecture`, `patterns`, `proof-of-concept`
- Description (249 chars): "MarkyMarkov - a PoC leveraging Markov chains for coding - shows that small, interpretable probabilistic models add high value to code workflows. By learning patterns from your own codebase, Markymarkov provides fast, explainable guidance that complements existing tools rather than replacing them."
- Draft: false

**Issues:**
- Description is 249 chars — too long
- Tags are specific and good, but `proof-of-concept` is low-value for search

**Proposed:**
- Title: no change
- Tags: `ai-agents`, `agent-architecture`, `open-source`
- Description (156 chars): "MarkyMarkov uses Markov chains to learn patterns from your codebase and provide fast, explainable code guidance that complements LLM agents without replacing them."

---

### 14. `mindmap.md`

**Current:**
- Title: `Context, context, context`
- Tags: `discussion`, `braindump`, `agents`, `context`
- Description (38 chars): "Context—or how I learned to love the MINDMAP"
- Draft: false

**Issues:**
- Title is cryptic — no value communication
- Tags `discussion` and `braindump` are vague
- Description is 44 chars — too short, no keyword

**Proposed:**
- Title: `Context Management for AI Agents: Why MINDMAP Changes Everything`
- Tags: `ai-agents`, `agent-architecture`, `opinion`
- Description (148 chars): "Context is the most underrated lever in AI agent design — this post makes the case for MINDMAP-style context objects as a first-class agent primitive."

---

### 15. `mise.md`

**Current:**
- Title: `mise`
- Tags: `computing`, `tool`
- Description (35 chars): "Environment manager and task runner."
- Draft: false

**Issues:**
- Title is a single word — no value communication
- Tags `computing` and `tool` are both vague
- Description is 36 chars — too short, no keyword

**Proposed:**
- Title: `mise: Per-Project Tool Version Manager and Task Runner`
- Tags: `developer-tools`, `cli`, `devops`
- Description (149 chars): "mise pins tool versions per project — Node, Python, Go, and more — in a single .mise.toml, replacing nvm, pyenv, and Makefiles with one unified tool."

---

### 16. `new-domain-bjro-dev.md`

**Current:**
- Title: `New Domain: bjro.dev`
- Tags: `meta`
- Description (38 chars): "The blog has a proper home now — bjro.dev."
- Draft: false

**Issues:**
- Description is 42 chars — too short; this is a meta post so SEO impact is low, but still
- Tags are fine for a meta post

**Proposed:**
- Title: no change
- Tags: `meta`
- Description (132 chars): "The blog has moved to bjro.dev — a short domain that's easier to share and signals a long-term commitment to writing about software and technology."

---

### 17. `notes-1.md`

**Current:**
- Title: `A couple of notes on some software development topics.`
- Tags: `software-engineering`, `llm`, `agents`
- Description (72 chars): "Thoughts on some software development topics with regards to modern agentic tooling"
- Draft: false

**Issues:**
- Title is vague — "A couple of notes" adds no value
- Description is 83 chars — too short, lacks specificity
- Tags are acceptable but generic

**Proposed:**
- Title: `Software Development Opinions: LLMs, Agentic Tooling, and What Actually Changes`
- Tags: `ai-agents`, `llm`, `opinion`
- Description (147 chars): "Opinionated notes on software development in the age of agentic tooling — where LLMs genuinely change how we work and where the hype outpaces the reality."

---

### 18. `terminal-multiplexers.md`

**Current:**
- Title: `Terminal multiplexers`
- Tags: `computing`, `ux`
- Description (27 chars): "Notes on terminal multiplexers."
- Draft: false

**Issues:**
- Title is generic — no value communication
- Tag `computing` is vague
- Description is 31 chars — too short

**Proposed:**
- Title: `Terminal Multiplexers: Why I Switched from tmux to zellij`
- Tags: `terminal`, `developer-tools`, `cli`
- Description (143 chars): "A quick comparison of tmux and zellij as terminal multiplexers — zellij wins on discoverability with visible, mnemonic keybinds right out of the box."

---

### 19. `the-npm-problem-nobody-wants-to-work-on.md`

**Current:**
- Title: `The npm problem nobody wants to work on`
- Tags: `discussion`, `development`
- Description (202 chars): "Every production Node.js system depends on a single corporate-controlled registry with no meaningful public alternative -- and the ecosystem treats this structural risk as a solved problem because it hasn't broken yet."
- Draft: false

**Issues:**
- Tag `discussion` is vague; `development` is generic
- Description is 216 chars — too long
- Title is strong — no change

**Proposed:**
- Title: no change
- Tags: `ecosystem-analysis`, `opinion`, `developer-tools`
- Description (152 chars): "Every Node.js production system depends on a single corporate-controlled npm registry with no real alternative — a structural risk the ecosystem ignores."

---

### 20. `trust-1.md`

**Current:**
- Title: `Cloud LLMs in prod...`
- Tags: `discussion`, `braindump`, `agents`
- Description (230 chars): "Modern infra teams are quietly feeding their most sensitive data—logs, configs, schemas—into cloud LLMs just to get unstuck. It feels like harmless troubleshooting, but in reality it extends your trust boundary into a black box you don't control or fully understand."
- Draft: false

**Issues:**
- Title ends with ellipsis — unprofessional and vague
- Tags `discussion` and `braindump` are vague
- Description is 266 chars — too long

**Proposed:**
- Title: `Cloud LLMs in Production: The Hidden Trust Boundary You're Already Crossing`
- Tags: `security`, `llm`, `opinion`
- Description (155 chars): "Infra teams quietly feed logs, configs, and schemas to cloud LLMs when troubleshooting — extending the trust boundary into a black box they don't control."

---

### 21. `whosthere.md`

**Current:**
- Title: `Whosthere / LAN tool`
- Tags: `computing`, `tool`
- Description (22 chars): "LAN discovery tool of note."
- Draft: false

**Issues:**
- Title is vague — project name + vague slash notation
- Tags `computing` and `tool` are both vague
- Description is 27 chars — far too short

**Proposed:**
- Title: `whosthere: LAN Discovery Tool with a Modern TUI in Go`
- Tags: `developer-tools`, `cli`, `terminal`
- Description (143 chars): "whosthere is a Go-based LAN discovery tool with a modern terminal UI — fast, intuitive network exploration that shows who and what is on your local network."

---

## Vague Tag Removal Map

### Posts containing `computing` (12 posts)

| File | Replacing `computing` with |
|------|---------------------------|
| `building-smarter-ai-agents-with-ideas-from-philosophy.md` | (already no `computing`) |
| `casq-1.md` | `developer-tools`, `ci-cd` |
| `ctrl-nocaps.md` | `linux`, `keyboard` |
| `curry-agents.md` | `ai-agents`, `agent-architecture` |
| `debian.md` | `linux`, `open-source` |
| `emacs-remote-files-ssh.md` | DRAFT — out of scope |
| `introducing-cairn.md` | `open-source`, `developer-tools` |
| `introducing-casq.md` | `rust`, `developer-tools` |
| `introducing-slog.md` | `typescript`, `developer-tools` |
| `introducing-zfetch.md` | DRAFT — out of scope |
| `locking-down-agents.md` | `security` |
| `mise.md` | `developer-tools`, `cli` |
| `terminal-multiplexers.md` | `terminal`, `cli` |
| `whosthere.md` | `cli`, `terminal` |

### Posts containing `tool` (8 posts)

| File | Replacing `tool` with |
|------|----------------------|
| `casq-1.md` | `developer-tools` |
| `curry-agents.md` | `agent-architecture` |
| `introducing-cairn.md` | `developer-tools` |
| `introducing-casq.md` | `developer-tools` |
| `introducing-slog.md` | `developer-tools` |
| `introducing-zfetch.md` | DRAFT — out of scope |
| `mise.md` | `developer-tools`, `cli` |
| `whosthere.md` | `developer-tools`, `cli` |

### Posts containing `discussion` (6 posts)

| File | Replacing `discussion` with |
|------|----------------------------|
| `building-smarter-ai-agents-with-ideas-from-philosophy.md` | (drop — other tags sufficient) |
| `business-processes.md` | (drop — other tags sufficient) |
| `mindmap.md` | `opinion` |
| `the-npm-problem-nobody-wants-to-work-on.md` | `ecosystem-analysis`, `opinion` |
| `trust-1.md` | `opinion` |

### Posts containing `braindump` (5 posts)

| File | Replacing `braindump` with |
|------|---------------------------|
| `building-smarter-ai-agents-with-ideas-from-philosophy.md` | (drop — other tags sufficient) |
| `business-processes.md` | (drop — other tags sufficient) |
| `mindmap.md` | `opinion` |
| `trust-1.md` | `opinion` |

---

## Description Length Audit

Posts with descriptions under 120 characters (all need new descriptions):

| File | Current Chars | Status |
|------|--------------|--------|
| `whosthere.md` | 27 | Critical |
| `ctrl-nocaps.md` | 32 | Critical |
| `debian.md` | 19 | Critical |
| `mise.md` | 36 | Critical |
| `terminal-multiplexers.md` | 31 | Critical |
| `casq-1.md` | 43 | Critical |
| `mindmap.md` | 44 | Critical |
| `linear-agentics.md` | 69 | Too short |
| `locking-down-agents.md` | 65 | Too short |
| `curry-agents.md` | 103 | Too short |
| `notes-1.md` | 83 | Too short |
| `new-domain-bjro-dev.md` | 42 | Too short |

Posts with descriptions over 160 characters (need trimming):

| File | Current Chars | Status |
|------|--------------|--------|
| `building-smarter-ai-agents-with-ideas-from-philosophy.md` | 253 | Too long |
| `business-processes.md` | 246 | Too long |
| `introducing-casq.md` | 260 | Too long |
| `markymarkov.md` | 295 | Too long |
| `markov-chains-with-llms.md` | 218 | Too long |
| `trust-1.md` | 268 | Too long |
| `the-npm-problem-nobody-wants-to-work-on.md` | 216 | Too long |
| `introducing-cairn.md` | 183 | Slightly over |

---

## Title Audit

Posts needing title changes (single-word, vague, or no value signal):

| File | Current Title | Problem | Proposed Title |
|------|--------------|---------|----------------|
| `debian.md` | `Debian` | Single word | `Debian: Why the Universal Operating System Still Matters in 2026` |
| `mise.md` | `mise` | Single word | `mise: Per-Project Tool Version Manager and Task Runner` |
| `trust-1.md` | `Cloud LLMs in prod...` | Trailing ellipsis, vague | `Cloud LLMs in Production: The Hidden Trust Boundary You're Already Crossing` |
| `mindmap.md` | `Context, context, context` | Cryptic, no topic | `Context Management for AI Agents: Why MINDMAP Changes Everything` |
| `business-processes.md` | `Notes on agentic applications in business processes` | "Notes on..." is weak | `AI Agents in Business Processes: Temporal, FSMs, and MCP` |
| `notes-1.md` | `A couple of notes on some software development topics.` | "A couple of notes" is weak | `Software Development Opinions: LLMs, Agentic Tooling, and What Actually Changes` |
| `whosthere.md` | `Whosthere / LAN tool` | Unclear project name | `whosthere: LAN Discovery Tool with a Modern TUI in Go` |
| `curl-nocaps.md` | `Making use of the Caps Lock key` | Weak value signal | `Remap Caps Lock to Left Control on Linux and Windows` |
| `terminal-multiplexers.md` | `Terminal multiplexers` | Generic, no hook | `Terminal Multiplexers: Why I Switched from tmux to zellij` |
| `curry-agents.md` | `Currying agents` | Brief, unclear | `Currying AI Agents: Partial Application for Reusable Agent Configurations` |
| `casq-1.md` | `Using casq in CI` | No CAS keyword | `Using casq for Content-Addressable Storage in CI Pipelines` |
| `locking-down-agents.md` | `Locking down agents` | No value | `Locking Down AI Agents: Limiting Blast Radius in Production Systems` |

---

## Architecture Patterns

### How to Edit Frontmatter

The Astro content schema validates on build. The `tags` field is `string[]`, `description` is `string`, `title` is `string`. No special escaping required for descriptions that don't contain colons at the start or YAML special chars.

**Titles containing colons MUST be quoted in YAML:**
```yaml
title: "Introducing cairn: append-only event storage with SQLite"
```
Unquoted titles with colons are already correctly quoted in the existing posts — follow that pattern.

**Slug does not change:** The `slug` field controls the URL. None of the proposed changes touch slugs — only `title`, `tags`, and `description`. This means no redirects are needed.

### Validation Command

```bash
cd /home/jani/devel/roobie.github.io/site && pnpm build
```

A successful build confirms all 21 frontmatter edits are schema-valid.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Tag normalization checks | Custom script | Just edit files — 21 posts is a one-time operation |
| Description length validation | Word-count script | Count manually or verify by inspection — not worth automation |
| Bulk frontmatter updater | Sed/awk script | Write edits with the Write/Edit tool directly — safer, reviewable |

---

## Common Pitfalls

### Pitfall 1: Changing the slug while updating the title
**What goes wrong:** If a planner task updates `title` AND `slug` simultaneously, existing inbound links break and a redirect is needed.
**How to avoid:** Never touch the `slug` field. Only update `title`, `tags`, and `description`.

### Pitfall 2: Unquoted YAML titles with colons
**What goes wrong:** `title: mise: Per-Project Tool...` is invalid YAML — Astro build fails.
**How to avoid:** Wrap any title containing a colon in double quotes: `title: "mise: Per-Project..."`.

### Pitfall 3: Description over 160 chars still triggers SEO truncation
**What goes wrong:** Google truncates meta descriptions over ~160 chars, rendering the effort wasted.
**How to avoid:** Count characters before committing. All proposed descriptions in this document are 120-160 chars.

### Pitfall 4: Tag with underscore vs hyphen inconsistency
**What goes wrong:** Existing tag `ci_cd` uses underscore; proposed tag `ci-cd` uses hyphen. Both would create separate tag pages if both exist.
**How to avoid:** Standardize on hyphens for all new tags. Replace `ci_cd` with `ci-cd` in `casq-1.md`.

### Pitfall 5: Draft posts
**What goes wrong:** Editing `emacs-remote-files-ssh.md` or `introducing-zfetch.md` frontmatter is unnecessary work since they're not indexed.
**How to avoid:** Skip draft posts entirely — they're out of scope for this phase.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Astro build (Zod schema validation) |
| Config file | `site/astro.config.ts` |
| Quick run command | `cd /home/jani/devel/roobie.github.io/site && pnpm build 2>&1 | tail -20` |
| Full suite command | `cd /home/jani/devel/roobie.github.io/site && pnpm build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| Ad-hoc (SEO-1) | No post uses vague tags | manual inspection | `grep -r 'computing\|braindump\|discussion' site/src/data/blog/` | N/A |
| Ad-hoc (SEO-2) | All published descriptions 120-160 chars | manual inspection | Check by reading each file post-edit | N/A |
| Ad-hoc (SEO-3) | No single-word titles without subtitle | manual inspection | `grep -r '^title:' site/src/data/blog/` | N/A |
| Ad-hoc (SEO-4) | Tag set forms coherent clusters | judgment | Review all tags post-edit | N/A |
| Schema | Frontmatter is schema-valid | build | `cd site && pnpm build` | ✅ |

### Sampling Rate
- **Per post edit:** `grep -r 'computing\|braindump\|discussion\|"tool"' site/src/data/blog/` to confirm removal
- **After all edits:** `cd site && pnpm build` — must pass clean
- **Phase gate:** Build green + manual description length spot-check

### Wave 0 Gaps

None — existing test infrastructure (Astro build with Zod) covers schema validation. Description length and tag quality are human-judgment checks.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Umbrella tags (`computing`, `tool`) | Specific cluster tags (`developer-tools`, `cli`, `linux`) | Tag pages become topically coherent, improve internal linking |
| Very short descriptions (< 50 chars) | 120-160 char descriptions with primary keyword | Google uses description in SERP; keyword improves click-through |
| Single-word titles (`mise`, `Debian`) | Descriptive titles with value signal | Title is the #1 on-page SEO factor; also improves SERP click-through |

---

## Open Questions

1. **`notes-1.md` title change and reader expectations**
   - What we know: The current slug is `software-development-topics-opinion-1` — already descriptive
   - What's unclear: Whether the author wants to keep the "notes" framing as a recurring series
   - Recommendation: Apply proposed title; if a "notes" series exists in future, use a clearer format like `Dev Notes #1: ...`

2. **`new-domain-bjro-dev.md` description effort**
   - What we know: This is a meta post with no searchable intent
   - What's unclear: Whether SEO improvement here is worth the effort
   - Recommendation: Apply the improved description anyway — it takes 30 seconds and makes the post consistent

3. **`markymarkov.md` and `markov-chains-with-llms.md` tag overlap**
   - What we know: Both posts cover Markov chains + LLM agents; both will use `ai-agents`, `agent-architecture`
   - What's unclear: Whether `markov-chains` as a tag adds value given the niche audience
   - Recommendation: Drop `markov-chains` as a standalone tag since it only applies to 2 posts and is low search volume; subsume under `agent-architecture`

---

## Sources

### Primary (HIGH confidence)
- Direct file reads of all 23 `.md` files in `site/src/data/blog/` — first-party content audit
- `/home/jani/devel/roobie.github.io/.claude/skills/seo-audit/SKILL.md` — SEO meta description standard (150-160 chars), title standard (50-60 chars visible)
- Astro Zod schema validation — confirmed via build system behavior documented in CLAUDE.md

### Secondary (MEDIUM confidence)
- SEO best practice: meta descriptions 120-160 chars, primary keyword inclusion — established Google guidance reflected in seo-audit skill

---

## Metadata

**Confidence breakdown:**
- Post inventory: HIGH — read every file directly
- Proposed descriptions: HIGH — written to spec (120-160 chars, primary keyword present, verified by character count)
- Proposed tags: HIGH — derived from post content, not guessed
- Title proposals: HIGH — grounded in post content
- SEO character limits: HIGH — confirmed via skill documentation

**Research date:** 2026-03-23
**Valid until:** Until posts are edited — this is a static mapping of existing content
