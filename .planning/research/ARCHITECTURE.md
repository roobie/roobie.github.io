# Architecture Research

**Domain:** AI-assisted content production for static site blog
**Researched:** 2026-03-10
**Confidence:** MEDIUM

## Standard Architecture

### System Overview

The content production workflow sits entirely outside the Astro build pipeline.
It operates as a pre-build layer: produce markdown files, then the existing
site infrastructure takes over automatically.

```
┌──────────────────────────────────────────────────────────────────┐
│                   CONTENT PRODUCTION LAYER                        │
│  (Human + AI collaboration — happens before Astro build)          │
├──────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Ideation   │  │   Outlining  │  │   Drafting   │            │
│  │   (human)    │→ │   (AI+human) │→ │   (AI+human) │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                              ↓                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  Published   │  │   Frontmatter│  │    Review    │            │
│  │  .md file    │← │   Assembly   │← │   + Polish   │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│         │                                                         │
│         └── written to site/src/data/blog/                        │
└──────────────────────────────────────────────────────────────────┘
         ↓ (git commit triggers)
┌──────────────────────────────────────────────────────────────────┐
│                   EXISTING SITE INFRASTRUCTURE                    │
│  (No changes required — already works)                            │
├──────────────────────────────────────────────────────────────────┤
│  Astro Build → Zod Validation → HTML Generation → GitHub Pages    │
└──────────────────────────────────────────────────────────────────┘
```

The integration point is a single directory: `site/src/data/blog/`.
Anything the production workflow writes there is automatically picked up by
the existing Astro content collection and routed, paginated, tagged, and indexed.

### Component Responsibilities

| Component | Responsibility | Where It Lives |
|-----------|----------------|----------------|
| Idea store | Capture and organise post ideas and topic backlog | `.planning/ideas/` or scratch file |
| Context brief | Describe the post topic, angle, target audience, key points | Passed to AI in prompt |
| AI drafting session | Iterative conversation that produces a full draft | Claude (interactive, no tooling needed) |
| Human review pass | Tone, accuracy, voice alignment, factual check | Editor opens file in text editor |
| Frontmatter assembler | Populate title, slug, pubDatetime, tags, description, author | Human fills fields (or AI suggests, human confirms) |
| Output file | Final markdown placed in correct location | `site/src/data/blog/{slug}.md` |
| Draft flag | `draft: true` in frontmatter while work in progress | Frontmatter field, excluded from build by `postFilter` |

## Recommended Project Structure

The content production workflow adds one directory to the repo root alongside the
existing `site/` directory. Nothing inside `site/` changes.

```
roobie.github.io/
├── site/                         # Existing — unchanged
│   └── src/data/blog/            # Drop zone: final .md files go here
├── .planning/
│   ├── PROJECT.md                # Existing
│   ├── codebase/                 # Existing
│   ├── research/                 # This research
│   └── ideas/                    # NEW: post idea backlog
│       ├── backlog.md            # Running list of post ideas with notes
│       └── {topic}/              # Optional: per-topic research notes
└── CLAUDE.md                     # NEW: project instructions for AI sessions
```

### Structure Rationale

- **`.planning/ideas/`:** Separates "ideas being considered" from "posts being written".
  A simple markdown backlog is sufficient — no database, no issue tracker needed.
- **`CLAUDE.md`:** A project-level instruction file read by Claude Code at session
  start. Encodes tone, style, frontmatter requirements, and author conventions so
  every session starts with consistent context. This is the single most impactful
  structural addition. (Source: Aaron Held's blog workflow, klaude-blog template)
- **`site/src/data/blog/`:** The existing Astro content collection. No structural
  changes needed — adding a `.md` file is all that is required to publish a post.

## Architectural Patterns

### Pattern 1: Scaffolded Prompt Chain

**What:** Rather than a single "write a blog post about X" prompt, break the
session into sequential phases: ideate → outline → draft sections → edit.
Each phase builds on the prior output and gives the author checkpoints to
redirect before investing more effort.

**When to use:** All posts. This is the baseline workflow.

**Trade-offs:** Slightly more deliberate than a single prompt, but produces
dramatically better results and preserves author voice throughout. Avoids
the "generic AI content" trap.

**Example session flow:**
```
1. "Here's a topic and rough angle: [X]. What are three possible structures?"
2. "Use structure 2. Expand into a section-by-section outline."
3. "Draft the intro and first section."
4. "The tone is too formal, rewrite section 1 more casually."
5. "Draft sections 2 and 3."
6. [Human writes conclusion or asks AI to draft it]
7. "Write frontmatter fields: title, description, tags."
```

### Pattern 2: Context Front-Loading via CLAUDE.md

**What:** A `CLAUDE.md` file at the repo root provides persistent project
context to every Claude Code session: writing style, tone, frontmatter schema,
existing post examples, author attribution format.

**When to use:** Always. This is the highest-leverage workflow investment.

**Trade-offs:** Requires upfront authoring, but eliminates repetitive context
setting at the start of every writing session. The file is versioned in git
alongside the posts it governs.

**CLAUDE.md should contain:**
- Blog tone description (casual, direct, colleague-not-corporate)
- Frontmatter schema with field explanations and examples
- Author attribution format (e.g., "Bjorn Roberg, Claude")
- Post file naming convention (`site/src/data/blog/{slug}.md`)
- A pointer to 2-3 exemplary existing posts for style reference
- What topics are in scope / out of scope

### Pattern 3: Draft Flag as Progress Gate

**What:** New posts start with `draft: true` in frontmatter. The existing
`postFilter()` utility already excludes drafts from the live site. This lets
work-in-progress posts live in the repo and be viewed locally (`npm run dev`)
without being published.

**When to use:** Always start as draft. Remove the flag only when the post is
ready to publish.

**Trade-offs:** Zero implementation cost — this feature already exists in the
codebase. Provides a clean staging state without needing a separate branch
per post (though branches remain an option for longer series).

### Pattern 4: Existing Post as Style Reference

**What:** Include one or two paths to existing posts in the prompt when starting
a new draft, instructing the AI to match their tone and structure.

**When to use:** When establishing a new topic area or after any gap in writing
activity.

**Trade-offs:** Requires reading existing files into context (token cost), but
produces more stylistically consistent output than prompting from abstract
tone descriptions alone.

## Data Flow

### Content Production Flow

```
[Idea in backlog]
    ↓
[Human initiates session: topic + angle]
    ↓
[CLAUDE.md loaded by Claude Code — context established]
    ↓
[Scaffolded prompts: outline → draft → revise]
    ↓
[Draft written to site/src/data/blog/{slug}.md]
[Frontmatter: draft: true, author: "Bjorn Roberg, Claude"]
    ↓
[Human reviews locally via `npm run dev`]
    ↓
[Human edits: tone, facts, personal anecdotes added]
    ↓
[Frontmatter finalized: draft removed, pubDatetime set]
    ↓
[git commit → GitHub Actions → GitHub Pages deploy]
    ↓
[Astro build: Zod validates frontmatter, generates routes]
    ↓
[Post live at /posts/{slug}/]
```

### Key Data Flows

1. **CLAUDE.md → AI session:** Project context flows from the instruction file
   into every Claude session at startup. This is passive (Claude Code reads it
   automatically) and requires no runtime tooling.

2. **Existing posts → style reference:** Reading 1-2 existing `.md` files into
   the prompt context. One-shot, at session start.

3. **Draft → production:** The `draft: true` frontmatter field is the only gate
   between an in-progress post and a live post. Removing the field and committing
   is the publish action.

4. **No new build pipeline:** The existing GitHub Actions workflow handles
   everything after commit. No new CI steps are needed.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Claude (Anthropic) | Interactive terminal session (Claude Code) | No API key plumbing needed for manual workflow — just use the tool interactively |
| GitHub Actions | Existing — triggered on push to master | No changes required |
| GitHub Pages | Existing deploy target | No changes required |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| AI session ↔ file system | Claude Code writes `.md` files directly | File is the only artifact exchanged |
| Content production ↔ Astro build | `site/src/data/blog/` directory | Drop zone interface — clean boundary |
| Draft state ↔ live site | `draft: true` frontmatter field | Gate already implemented in `postFilter.ts` |
| Style guide ↔ AI | `CLAUDE.md` project instructions file | Versioned in git, read at session start |

## Anti-Patterns

### Anti-Pattern 1: One Giant Prompt

**What people do:** Send a single prompt "write a 1500-word blog post about X in
the style of Y" and accept the output.

**Why it's wrong:** Produces generic, over-polished content that doesn't sound
like the author. No checkpoints to redirect tone or structure. Results in a
post that reads as AI content, not a human-AI collaboration.

**Do this instead:** Use the scaffolded prompt chain (Pattern 1). Ideate, outline,
draft in sections, edit. Each handoff is a decision point.

### Anti-Pattern 2: No Persistent Context

**What people do:** Re-describe the blog, tone, and frontmatter schema at the
start of each writing session from memory.

**Why it's wrong:** Inconsistent instructions produce inconsistent output. Also
tedious. The author is doing work the machine should do.

**Do this instead:** Write `CLAUDE.md` once. It loads automatically.

### Anti-Pattern 3: Committing AI Output Unreviewed

**What people do:** Accept the AI's draft as final and commit without a human
review pass.

**Why it's wrong:** LLMs hallucinate technical details. Subtle factual errors
erode reader trust. The casual, direct voice of the blog requires a human to
add personal perspective and remove corporate filler.

**Do this instead:** Use `draft: true` as a required gate. Every post requires
at least one human review pass before the draft flag is removed.

### Anti-Pattern 4: Separate Toolchain for Content

**What people do:** Build a separate CMS, admin UI, or CLI tool to manage the
content production workflow.

**Why it's wrong:** The existing file system + git + Astro content collection is
already a complete CMS. Adding another layer increases maintenance overhead with
no benefit for a solo blog.

**Do this instead:** Work directly with `.md` files in the repo. The existing
infrastructure handles everything downstream.

## Suggested Build Order

This is a content workflow, not a software system, so "build order" maps to
what to establish before writing the first post.

| Step | What | Why First |
|------|------|-----------|
| 1 | Write `CLAUDE.md` | All writing sessions depend on it. One-time effort, permanent leverage. |
| 2 | Create `.planning/ideas/backlog.md` | Captures the topic backlog that drives everything else. |
| 3 | Run first scaffolded session on a simple topic | Validates the workflow, produces a concrete post, surfaces gaps in CLAUDE.md. |
| 4 | Refine `CLAUDE.md` based on what was missing | Iterate the context document from real experience. |
| 5 | Establish tagging conventions | Tags already work in the site; consistent use requires a written convention. |

Steps 1 and 2 have no dependencies and can happen in the same sitting.
Step 3 depends on both. Steps 4 and 5 depend on step 3.

## Sources

- Aaron Held: [Streamlining Blog Writing with Claude Code](https://www.aaronheld.com/post/streamlining-blog-writing-with-claude-code/) — practical five-stage workflow with static site (Hugo), directly analogous to this project. MEDIUM confidence (single source, real-world practitioner).
- nickwinder/klaude-blog: [GitHub](https://github.com/nickwinder/klaude-blog) — Astro + Claude Code blog automation template with `.claude/` directory pattern. MEDIUM confidence (open source reference implementation).
- Martin Fowler: [Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html) — authoritative analysis of human-in-the-loop patterns. HIGH confidence (official publication).
- Comet: [Human-in-the-Loop Review Workflows](https://www.comet.com/site/blog/human-in-the-loop/) — HITL architecture pattern analysis. MEDIUM confidence.
- Zapier: [Using AI for blog writing](https://zapier.com/blog/blog-writing-ai/) — scaffolded prompt chain pattern documented. MEDIUM confidence.

---
*Architecture research for: AI-assisted content production, roobie.github.io*
*Researched: 2026-03-10*
