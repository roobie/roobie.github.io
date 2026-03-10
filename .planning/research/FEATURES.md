# Feature Research

**Domain:** AI-assisted blog content production workflow
**Researched:** 2026-03-10
**Confidence:** MEDIUM

## Context

This research covers features for adding content production workflows to an existing Astro blog
(roobie.github.io). The blog infrastructure is complete and working. The gap is the writing
workflow itself — going from "I have an idea" to a committed markdown file in `site/src/data/blog/`.

The author writes casual, direct technical content co-authored with AI models. Attribution is
transparent via the `author` frontmatter field (e.g., "Björn Roberg, Claude"). Posts range from
short braindumps to detailed technical comparisons with code examples.

The "user" here is a single author, not a team. There is no CMS, no publishing queue, no
approval chain. The workflow runs locally against markdown files in a git repo.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features a content production workflow must have or it doesn't function as a workflow.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Frontmatter generation | Every post requires valid frontmatter or the build fails (Zod schema enforced). Manual creation is friction-heavy and error-prone. | LOW | Must include: author (with AI model name), pubDatetime, title, slug, tags, description, draft flag |
| Post scaffolding | Creating a new post file with correct structure, filename conventions, and location (`site/src/data/blog/`) is prerequisite to any content work | LOW | Filename should match slug. Draft flag starts true. |
| Topic-to-outline conversion | Going from a topic/idea to a structured outline is the hardest cognitive step. A workflow without this is just typing in a text editor. | MEDIUM | Should produce H2/H3 structure matching the blog's actual style (see existing posts) |
| Drafting from outline | An outline without a draft is not content. Full section drafting is the core deliverable of the workflow. | MEDIUM | Must match casual/direct tone. Not corporate, not generic. |
| Voice/style consistency | The blog has a distinctive voice: casual, direct, like talking to a colleague. AI defaults to generic prose without explicit guidance. | MEDIUM | Needs a reusable style reference (examples from existing posts work better than abstract descriptions) |
| Draft → publish promotion | Moving a draft from `draft: true` to `draft: false` with correct `pubDatetime` and `modDatetime` timestamps is required before the post appears on the site | LOW | Needs timestamp handling (ISO 8601 with timezone) |

### Differentiators (Competitive Advantage)

Features that make this workflow faster, more consistent, or more aligned with the author's actual goals.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Idea backlog with context capture | Ideas captured with context (why it's interesting, angle, related posts) produce much better content than bare topic titles days later | LOW | A simple markdown file or YAML list in `.planning/` works. No tool needed beyond a text editor. |
| Post-type awareness | Different post formats (braindump, comparison, tutorial, opinion) have different structures. Prompts that know the type produce better first drafts. | MEDIUM | Existing posts reveal at least 4 types. Encode these as named templates or prompt variants. |
| Style reference from existing posts | Feeding 2-3 existing posts as examples produces dramatically better voice matching than any abstract description of tone | LOW | Reference posts like `curry-agents.md`, `mise.md`, `locking-down-agents.md`. This is high-leverage, low-cost. |
| AI model attribution automation | The `author` field format varies slightly (`"Björn Roberg, Claude"` vs `"Björn Roberg, GPT-51."`) — automation can enforce consistent format and prompt for which model was used | LOW | Small detail, noticeable when inconsistent |
| Iterative section editing | Drafting section-by-section with review at each step produces better output than one-shot full-post generation, especially for technical accuracy | MEDIUM | The "scaffolding prompt" pattern: each prompt builds on what the AI already produced |
| Tag normalization | Existing tags are `tool`, `computing`, `agents`, `discussion`, `braindump`. New posts should reuse existing tags where possible rather than proliferating synonyms. | LOW | Can be handled with a reference list in the prompt or a validation step post-generation |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem useful but create more problems than they solve for this specific context.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Fully automated end-to-end publishing | Sounds like maximum efficiency — idea in, post out, committed | Skips human review entirely. AI confidently fills gaps with plausible-sounding incorrect content, especially for technical posts. Tone mismatches are invisible without a read-through. The author's voice is the product's core value. | Keep human review as a mandatory step between draft and commit. Automate the scaffolding and drafting, not the final judgment. |
| SEO optimization features | Standard content tool feature — keyword density, meta tags, readability scores | This blog is not an SEO play. The author writes for technical peers, not search engines. SEO tooling adds friction and pulls the writing toward generic, keyword-stuffed prose. The description field exists for discoverability; that's enough. | Write a good description in frontmatter. Let the content speak for itself. |
| Content scheduling / publication queue | Teams need this. Looks like good workflow hygiene. | Single author, git-based workflow. A draft file IS the queue. Adding a separate scheduling layer duplicates the `draft: false` + `pubDatetime` mechanism already in the blog. | Use `draft: true` as the queue. Promote to published when ready by updating frontmatter. |
| Automated social media posting | "Complete the workflow" — publish post, auto-post to Twitter/LinkedIn | Distracts from content quality. Sharing is a separate decision requiring judgment about framing for each platform. Automating it reduces shareability. | Write sharing prompts as a separate, optional step in the workflow. Do not automate the actual posting. |
| CMS or web UI for content management | Visual interface seems friendlier than editing markdown directly | The entire value proposition of this blog is the markdown-in-git model. Adding a CMS layer introduces sync problems, two sources of truth, and dependency on an external service. The author already works in a code editor. | Stay in the editor. Improve the CLI/prompt workflow instead. |
| Grammar/spell-check integration | Polished prose is good. Linters seem like quality control. | The casual, direct voice is intentional. Heavy grammar tooling (Grammarly-style) homogenizes prose and fights the style. Flagging fragments and comma splices that are stylistic choices wastes time. | Trust the AI model's built-in language quality. Do a human read for factual accuracy and voice, not grammar. |

---

## Feature Dependencies

```
[Post Scaffolding]
    └──requires──> [Frontmatter Generation]

[Drafting from Outline]
    └──requires──> [Topic-to-Outline Conversion]
    └──requires──> [Voice/Style Consistency] (inputs needed before drafting)

[Draft → Publish Promotion]
    └──requires──> [Post Scaffolding] (the file must exist)

[Iterative Section Editing]
    └──enhances──> [Drafting from Outline]

[Style Reference from Existing Posts]
    └──enhances──> [Voice/Style Consistency]

[Post-Type Awareness]
    └──enhances──> [Topic-to-Outline Conversion]

[Tag Normalization]
    └──enhances──> [Frontmatter Generation]

[Idea Backlog with Context Capture]
    └──feeds──> [Topic-to-Outline Conversion]
```

### Dependency Notes

- **Post Scaffolding requires Frontmatter Generation:** A file without valid frontmatter fails the Zod schema validation at build time. These are the same step in practice.
- **Drafting requires Voice/Style Consistency inputs:** Style reference and tone guidance must be assembled before the drafting prompt is issued, not added as a post-hoc edit.
- **Iterative Section Editing enhances Drafting:** For technical posts especially, section-by-section with review is strictly better than one-shot. For short braindumps, one-shot is fine — the pattern should be optional, not mandatory.
- **Style Reference enhances Voice/Style Consistency:** Using actual post examples as context is more reliable than an abstract style description. This is low complexity, high payoff — implement first.
- **Post-Type Awareness enhances Topic-to-Outline:** Knowing whether a post is a comparison, tutorial, or braindump shapes the outline structure. Encode as named types with example structures.

---

## MVP Definition

### Launch With (v1)

Minimum viable workflow — enough to produce a post from idea to committed file.

- [ ] **Post scaffolding** — create a new markdown file with valid frontmatter, draft: true, correct location
- [ ] **Style reference prompt** — assembled prompt with 2-3 existing posts as examples, establishing voice
- [ ] **Topic-to-outline conversion** — prompt that produces a working H2/H3 outline for a given topic
- [ ] **Section drafting** — prompt sequence that drafts each section of the outline
- [ ] **Draft → publish promotion** — update draft flag, set pubDatetime, set modDatetime

These five capabilities cover the complete end-to-end path from idea to published post.

### Add After Validation (v1.x)

Add when the basic workflow has been used for several posts and friction points are identified.

- [ ] **Post-type templates** — separate prompt/structure variants per post type (comparison, tutorial, braindump), add when same-type posts are being produced repeatedly
- [ ] **Idea backlog** — structured capture format when there are enough pending ideas that they are being forgotten or losing context between sessions
- [ ] **Tag normalization helper** — reference list of existing tags embedded in the frontmatter prompt, add when tag proliferation becomes visible in the blog

### Future Consideration (v2+)

Defer until there is evidence of need.

- [ ] **Multi-post consistency checking** — ensuring new posts don't contradict existing ones, relevant once the post archive is large enough that the author can't hold it all in memory
- [ ] **AI model comparison prompt sets** — prompts tuned for different models (Claude vs GPT variants), relevant when the author uses multiple models regularly enough to want optimized prompts per model

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Post scaffolding + frontmatter generation | HIGH | LOW | P1 |
| Voice/style consistency via existing post examples | HIGH | LOW | P1 |
| Topic-to-outline conversion | HIGH | MEDIUM | P1 |
| Section drafting | HIGH | MEDIUM | P1 |
| Draft → publish promotion | HIGH | LOW | P1 |
| Post-type awareness | MEDIUM | MEDIUM | P2 |
| Idea backlog with context capture | MEDIUM | LOW | P2 |
| Tag normalization | LOW | LOW | P2 |
| AI model attribution automation | LOW | LOW | P2 |
| Iterative section editing pattern | MEDIUM | LOW | P2 |
| Multi-post consistency checking | LOW | HIGH | P3 |
| Per-model prompt optimization | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

This is a personal workflow, not a product competing in a market. The relevant comparison
is against how technical bloggers currently produce AI-assisted content.

| Feature | Full-Stack AI Writing Tools (Jasper, etc.) | Manual AI Prompting (ChatGPT web UI) | This Workflow |
|---------|---------------------------------------------|---------------------------------------|---------------|
| Voice consistency | Style guides via web UI, team-oriented | Ad-hoc, re-established each session | Reusable prompts + example posts, local files |
| Frontmatter / metadata | Not applicable (not markdown-native) | Manual copy-paste | Generated as part of scaffolding |
| Post-type awareness | Template library in web UI | User must specify in prompt | Named types with prompt variants |
| Local markdown integration | Poor (SaaS-first) | Poor (copy-paste to editor) | Native — workflow produces markdown files directly |
| Human review gate | Often bypassed (publish button in tool) | Natural break (copy-paste forces a review) | Explicit step between draft and commit |
| Attribution tracking | Not designed for this | Manual | Automated via frontmatter field |

---

## Sources

- [AI Content Workflow Automation: Complete Guide 2026](https://www.trysight.ai/blog/ai-content-workflow-automation)
- [AI Agents for Technical Writing (January 2026)](https://buildwithfern.com/post/technical-writing-ai-agents-devin-cursor-claude-code)
- [How I Use AI to Write and Publish Blog Posts](https://www.mattwarren.co/2026/01/how-i-use-ai-to-write-and-publish-blog-posts/)
- [Building a Content Pipeline: From Idea to Published Post](https://dasroot.net/posts/2026/01/building-content-pipeline-idea-published-post/)
- [The Missing Layer in Most AI Workflows: Human Review](https://humansusingai.com/insight/everyone/the-missing-layer-in-ai-human-review/)
- [How to Maintain Consistent Brand Voice with AI](https://aiforcontentmarketing.ai/how-to-maintain-consistent-brand-voice-with-ai/)
- [Mastering Prompt Engineering for a Consistent Brand Voice](https://www.arsturn.com/blog/prompt-engineering-for-consistent-brand-voice-in-content)
- [The best AI blog prompts to write blog posts faster in 2026](https://www.eesel.ai/blog/ai-blog-prompts-to-write-blog-posts-faster)
- [A practical guide to AI technical blog writing](https://www.eesel.ai/blog/ai-technical-blog-writing)
- Existing blog posts in `site/src/data/blog/` (primary source for voice/style analysis)

---
*Feature research for: AI-assisted blog content production workflow (roobie.github.io)*
*Researched: 2026-03-10*
