# Project Research Summary

**Project:** AI-assisted blog content production workflow (roobie.github.io)
**Domain:** Content production tooling for personal technical blog
**Researched:** 2026-03-10
**Confidence:** MEDIUM (HIGH on stack/pitfalls, MEDIUM on features/architecture)

## Executive Summary

This project adds an AI-assisted content production workflow to an already-complete Astro blog. The blog infrastructure (Astro 5, Tailwind, GitHub Pages, pnpm) is fully operational and must not be modified. The gap is the writing workflow itself — there is no structured path from "I have an idea" to a committed, published markdown file. Research confirms that the right approach for this specific context is a lightweight, file-native workflow built around Claude Code as the interactive AI session tool, a `CLAUDE.md` project instruction file as persistent context, and a scaffolded prompt chain (ideate → outline → draft sections → review → publish) as the workflow pattern. No CMS, no separate CLI tool, and no automation beyond AI-assisted drafting is needed or recommended.

The recommended stack adds minimal dependencies to the repo root (outside `site/`): `@anthropic-ai/sdk`, `gray-matter`, `zod`, `commander`, `ora`, and `chalk`. However, for an MVP, even these are optional — the workflow can start with zero new code and instead rely on Claude Code interactive sessions guided by `CLAUDE.md`. The key insight from architecture research is that the integration point is a single directory (`site/src/data/blog/`) and a single frontmatter field (`draft: true`), both of which already exist. The workflow's job is to produce good markdown files; everything downstream is already handled.

The most critical risks are not technical. Hallucinated technical claims, gradual voice drift toward generic AI prose, and treating the AI as a ghostwriter rather than a co-author are the failure modes that damage a personal technical blog most severely and most permanently. All three can be prevented through workflow design: a verification checklist before each post publishes, a voice reference document loaded into every writing session, and an explicit rule that the human must supply a thesis and original angle before AI writes anything.

---

## Key Findings

### Recommended Stack

The content production tooling must live outside `site/` to avoid polluting the Astro build. The Anthropic TypeScript SDK (`@anthropic-ai/sdk@^0.78.0`) with `claude-sonnet-4-6` is the clear choice: it is the official client, handles full Claude 4.x features including prompt caching, and aligns with the existing attribution convention ("Björn Roberg, Claude"). The project already runs Node 22 and TypeScript 5.9.3 — no new runtime is required. `zod@^3.24` is already used in `site/src/content.config.ts` for frontmatter validation and should be reused in scripts.

**Core technologies:**
- `@anthropic-ai/sdk@^0.78.0`: Anthropic API client — official, full Claude 4.x support, prompt caching
- `claude-sonnet-4-6` model: Content generation — best speed/intelligence tradeoff, $3/$15/MTok, Jan 2026 training cutoff
- `gray-matter@^4.0.3`: Frontmatter parsing/writing — battle-tested, used internally by Astro
- `zod@^3.24`: Generated frontmatter validation — already in use in `site/`, prevents build failures
- `commander@^14.0.3`: CLI subcommands for multi-command workflow (generate, draft, outline, edit)
- `tsx` (via npx): Run TypeScript scripts without a build step — simpler than ts-node or compiled JS
- `chalk@^5.6.2` + `ora@^8.x`: Terminal UX for long API calls — ESM-only, correct for Node 22

For an MVP, only the SDK, gray-matter, and zod are strictly required. Commander and the UX libraries are for a polished multi-command tool.

See `.planning/research/STACK.md` for full details including version compatibility and alternatives considered.

### Expected Features

The workflow must cover the complete path from idea to published post. All five table-stakes features are interdependent: scaffolding requires frontmatter generation; drafting requires outline and voice reference; publish promotion requires a valid draft file.

**Must have (table stakes, v1):**
- Post scaffolding with frontmatter generation — file with valid frontmatter and `draft: true`, correct location
- Voice/style consistency via existing post examples — feed 2-3 existing posts in every drafting session
- Topic-to-outline conversion — scaffolded prompts from idea to H2/H3 outline
- Section drafting — prompt sequence that produces a full draft section by section
- Draft-to-publish promotion — update draft flag, set `pubDatetime` and `modDatetime` correctly

**Should have (v1.x, after workflow validation):**
- Post-type templates — separate prompt variants for comparison, tutorial, and braindump formats
- Idea backlog with context capture — structured markdown file for pending ideas with angles preserved
- Tag normalization — existing tag list embedded in frontmatter prompt to prevent proliferation

**Defer (v2+):**
- Multi-post consistency checking — only relevant when archive is too large to hold in memory
- Per-model prompt optimization — only relevant if multiple models are used regularly

**Anti-features to avoid entirely:** fully automated publishing, SEO optimization, content scheduling queue, social media automation, CMS layer, grammar linters.

See `.planning/research/FEATURES.md` for the full prioritization matrix and dependency graph.

### Architecture Approach

The workflow sits entirely outside the Astro build pipeline as a pre-build layer. The only integration point is `site/src/data/blog/` (drop zone for completed markdown files) and the `draft: true` frontmatter field (the gate between in-progress and live). No new build steps, no CI changes, and no modifications to `site/` are required.

The two highest-leverage structural changes are: (1) creating `CLAUDE.md` at the repo root with tone, frontmatter schema, attribution format, naming conventions, and pointers to 2-3 exemplary existing posts — this loads automatically into every Claude Code session; (2) establishing the scaffolded prompt chain as the baseline workflow pattern rather than one-shot generation. Both have zero ongoing maintenance cost and prevent the most common failure modes.

**Major components:**
1. `CLAUDE.md` (repo root) — persistent context for every AI session; encodes voice, frontmatter schema, conventions
2. `.planning/ideas/backlog.md` — idea backlog with topic, angle, and related posts captured at ideation time
3. Scaffolded prompt chain — the workflow itself: ideate, outline, draft sections, review, finalize frontmatter
4. `site/src/data/blog/{slug}.md` — output artifact; the only interface between workflow and site infrastructure
5. `draft: true` frontmatter gate — existing feature; separates in-progress from published, no implementation cost

See `.planning/research/ARCHITECTURE.md` for the full data flow diagram and anti-pattern analysis.

### Critical Pitfalls

1. **Hallucinated technical claims** — AI confidently fabricates version numbers, API behavior, and benchmarks. Prevention: treat every specific technical assertion as unverified; verify against primary sources before publishing; run all code examples; ask the AI "what are you least confident about?" at draft completion.

2. **Voice drift toward generic AI prose** — each post drifts slightly toward corporate smoothness; the erosion is invisible post-by-post but obvious across the archive. Prevention: include a voice reference document (3-5 representative paragraphs from existing posts, not a style description) in every session; do a dedicated voice-check read after drafting, separate from accuracy review.

3. **Ghostwriter dynamic** — the human role degrades to approver; posts lack genuine insight or lived experience. Prevention: the human must supply a clear thesis and original angle before AI writes anything; any post where the author cannot identify a specific original contribution should not publish.

4. **Content debt from lowered publishing friction** — posts that would have failed the "worth writing by hand" bar get published because generation is easy. Prevention: apply the "would I write this by hand?" gate; check new topics against the archive for redundancy before starting.

5. **Frontmatter integrity failures** — AI-generated `pubDatetime` / `modDatetime` ISO strings are often wrong; invented tags fragment navigation; premature `draft: false` publishes unreviewed content. Prevention: supply dates manually; include the current tag list in every session; run `npm run build` locally before every push.

See `.planning/research/PITFALLS.md` for a full pre-publish checklist and recovery strategies.

---

## Implications for Roadmap

Based on the combined research, the work divides naturally into three phases that reflect the dependency order from FEATURES.md and the build order from ARCHITECTURE.md.

### Phase 1: Workflow Foundation

**Rationale:** `CLAUDE.md` is a prerequisite for every subsequent step — it provides the persistent context that makes all AI sessions consistent. Without it, every session reinvents voice, schema, and conventions. The idea backlog captures the topics that feed the actual workflow. These two deliverables have zero dependencies, maximum leverage, and no code required.

**Delivers:** A working AI writing session environment. Every Claude Code session from this point forward starts with full context automatically.

**Addresses:** Voice/style consistency (table stakes), idea backlog (P2 feature), tag normalization setup

**Avoids:** Voice drift (Pitfall 2), no-persistent-context anti-pattern, tag proliferation

**Specific tasks:**
- Write `CLAUDE.md` with tone description, frontmatter schema with examples, attribution format, naming conventions, pointers to 2-3 exemplary existing posts
- Create `.planning/ideas/backlog.md` with capture format (topic, angle, related posts, why it matters)
- Document the current tag taxonomy

**Research flag:** Standard patterns — well-documented by Aaron Held's blog workflow and the klaude-blog template. Skip research-phase.

---

### Phase 2: Core Content Workflow

**Rationale:** With CLAUDE.md in place, the scaffolded prompt chain can be developed and validated on a real post. This phase produces the end-to-end path from idea to published post and surfaces gaps in CLAUDE.md through real use.

**Delivers:** A complete, validated workflow: topic to outline to draft to review to published post. First AI-assisted post produced and committed.

**Addresses:** Post scaffolding, topic-to-outline, section drafting, draft-to-publish promotion (all P1 table-stakes features)

**Avoids:** One-giant-prompt anti-pattern, hallucinated technical claims (Pitfall 1), ghostwriter dynamic (Pitfall 3), frontmatter failures (Pitfall 5)

**Specific tasks:**
- Develop the scaffolded prompt sequence (ideation → outline → section drafting → frontmatter)
- Create a frontmatter template with explicit date handling (do not trust AI-generated ISO strings)
- Write the pre-publish checklist (factual claims, code execution, voice check, build check, differentiation check)
- Produce the first complete post through the workflow
- Refine CLAUDE.md based on gaps discovered in the first session

**Research flag:** Standard patterns — well-documented. Skip research-phase.

---

### Phase 3: Workflow Enhancement and Tooling

**Rationale:** After the manual workflow is validated across several posts, friction points will be identified. This phase addresses those friction points with lightweight tooling (optional CLI scripts) and adds the post-type awareness and tag normalization features that require real workflow experience to implement well.

**Delivers:** Optional CLI scripts for scaffolding and publish promotion; post-type prompt variants; tag normalization; the workflow refined by real experience.

**Addresses:** Post-type templates (P2), tag normalization (P2), AI model attribution automation (P2), iterative section editing pattern (P2)

**Uses:** `@anthropic-ai/sdk`, `gray-matter`, `zod`, `commander`, `tsx`, `chalk`, `ora` from STACK.md

**Avoids:** Building tooling before the workflow is validated (ARCHITECTURE.md anti-pattern: separate toolchain for content)

**Specific tasks:**
- Only build CLI scripts if manual workflow reveals genuine repetitive friction (scaffolding, publish promotion)
- Add post-type prompt variants (comparison, tutorial, braindump) based on actual posts written in Phase 2
- Embed current tag list in frontmatter prompts
- Add prompt caching via `cache_control` on system prompt if bulk generation sessions emerge

**Research flag:** CLI tooling details (commander subcommand structure, ESM/CJS interop) may benefit from a light research pass. API integration patterns are well-documented.

---

### Phase Ordering Rationale

- **CLAUDE.md before any code:** Architecture research is explicit that CLAUDE.md is the highest-leverage workflow investment, and it must precede the first writing session. Reversing this order means the first post is written without consistent context.
- **Manual workflow before automation:** Building CLI scripts before validating the manual workflow risks automating the wrong things. ARCHITECTURE.md warns explicitly against building a separate toolchain before knowing what friction actually exists.
- **Features grouped by dependency:** FEATURES.md dependency graph shows post scaffolding and voice consistency must be in place before drafting; drafting must work before post-type templates add value.
- **Pitfall prevention baked in early:** The three critical pitfalls (hallucination, voice drift, ghostwriter dynamic) all require workflow-level prevention, not tooling-level prevention. They must be addressed in Phase 1-2, not deferred to Phase 3.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (CLI tooling):** Commander subcommand structure for TypeScript ESM scripts, integration with `tsx` for a multi-file script project — worth a focused research pass when Phase 3 begins.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Workflow Foundation):** CLAUDE.md format and content is well-documented (Aaron Held, klaude-blog template, Claude Code docs). No novel decisions.
- **Phase 2 (Core Content Workflow):** Scaffolded prompt chain pattern is thoroughly documented across multiple analogous projects. Astro frontmatter schema is already fully defined.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Anthropic SDK version and model confirmed from official sources; zod and gray-matter versions from npm; chalk/commander MEDIUM (secondary sources) |
| Features | MEDIUM | Well-reasoned from first principles and analogous workflows; not validated against empirical user research, but this is a single-author personal workflow |
| Architecture | MEDIUM | Primary source (Aaron Held) is a single practitioner; klaude-blog is a reference implementation; Martin Fowler's HITL analysis is HIGH confidence but general |
| Pitfalls | HIGH | Well-documented failure modes across multiple independent sources; voice drift and hallucination are consensus findings, not single-source |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Post-type taxonomy:** The research identifies 4 post types (braindump, comparison, tutorial, opinion) from examining existing posts, but the exact prompt structures for each type need to be developed empirically in Phase 2.
- **Optimal CLAUDE.md length/structure:** There is no authoritative source for how detailed a CLAUDE.md should be. The right level of detail will emerge from Phase 1 and Phase 2 iteration — start sparse and add only what turns out to be missing.
- **When to add CLI tooling:** The threshold for "enough repetitive friction to justify a CLI script" is not researchable in advance. This will only become clear after the manual workflow has been used for several posts.
- **Prompt caching ROI:** Whether prompt caching on the system prompt is worth implementing depends on session frequency and system prompt length. Revisit in Phase 3 if bulk generation sessions occur.

---

## Sources

### Primary (HIGH confidence)
- [Anthropic TypeScript SDK releases](https://github.com/anthropics/anthropic-sdk-typescript/releases) — v0.78.0 confirmed current
- [Anthropic models overview](https://platform.claude.com/docs/en/about-claude/models/overview) — claude-sonnet-4-6 confirmed, pricing verified
- [Anthropic prompt caching docs](https://www.anthropic.com/news/prompt-caching) — caching mechanics and cost structure
- [Martin Fowler: Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html) — human-in-the-loop architecture patterns
- [kapa.ai: What Are AI Hallucinations?](https://www.kapa.ai/blog/ai-hallucination) — fabrication rate research (3-10%)
- Existing blog posts in `site/src/data/blog/` — voice and style analysis, frontmatter schema

### Secondary (MEDIUM confidence)
- [Aaron Held: Streamlining Blog Writing with Claude Code](https://www.aaronheld.com/post/streamlining-blog-writing-with-claude-code/) — analogous Hugo + Claude Code workflow
- [nickwinder/klaude-blog](https://github.com/nickwinder/klaude-blog) — Astro + Claude Code reference implementation
- [gray-matter npm](https://www.npmjs.com/package/gray-matter) — v4.0.3 confirmed
- [CXL: AI content and silent erosion of brand voice](https://cxl.com/blog/ai-content-and-the-silent-erosion-of-brand-voice/) — voice drift pattern
- [Comet: Human-in-the-Loop Review Workflows](https://www.comet.com/site/blog/human-in-the-loop/) — HITL architecture analysis
- AI content workflow sources (magai.co, beomniscient.com, entrepreneuraitools.com) — pitfall documentation

### Tertiary (MEDIUM confidence — secondary sources for version numbers)
- [commander npm/jsDocs](https://www.jsdocs.io/package/commander) — v14.0.3
- [chalk npm](https://www.npmjs.com/package/chalk) — v5.6.2
- [zod npm](https://www.npmjs.com/package/zod) — v3.24

---
*Research completed: 2026-03-10*
*Ready for roadmap: yes*
