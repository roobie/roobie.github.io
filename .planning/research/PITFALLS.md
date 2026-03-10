# Pitfalls Research

**Domain:** AI-assisted personal tech blog content production
**Researched:** 2026-03-10
**Confidence:** HIGH (well-documented failure modes across multiple sources)

## Critical Pitfalls

### Pitfall 1: Hallucinated Technical Claims and Fabricated References

**What goes wrong:**
AI confidently states incorrect technical facts — wrong API behavior, fabricated benchmark numbers, non-existent library versions, or invented citations. In technical content this is catastrophic: readers apply the wrong information and lose trust in the author permanently. Between 3-10% of AI outputs contain complete fabrications (kapa.ai research).

**Why it happens:**
LLMs predict likely-sounding next tokens rather than verify facts. The model has no mechanism to distinguish "I know this" from "I'm pattern-matching plausibly here." Technical topics with less training data coverage are highest risk.

**How to avoid:**
Every factual claim, version number, benchmark, and library name in a draft must be verified against primary sources before publishing. Treat AI-generated technical assertions as unverified hypotheses, not facts. For code examples specifically: run them, don't assume them. Ask the AI to flag its own uncertainty ("what in this draft are you least confident about?") — models often know where they're guessing.

**Warning signs:**
- Specific version numbers or release dates without a source
- Benchmark comparisons with precise percentages
- Named studies or papers without verifiable URLs
- Code examples that haven't been executed
- Claims about library behavior that weren't personally tested

**Phase to address:**
Content production workflow setup phase — establish a verification checklist before any post publishes.

---

### Pitfall 2: Voice Drift — AI Erodes the Author's Distinct Style Over Time

**What goes wrong:**
Early posts sound like Bjorn. Six months in, all posts sound like "generic AI-polished tech blog." The casual, colleague-to-colleague directness gets replaced by corporate smoothness. Readers notice this even if they can't name it. The blog loses its personality, which is the primary reason a personal blog has readers at all.

**Why it happens:**
AI defaults to a middle register — competent, inoffensive, slightly formal. Without explicit counter-pressure in every session, it pulls content toward that default. Each post drifts slightly, and the drift compounds. There's no single "bad post" — the erosion is gradual and hard to spot in any individual piece.

**How to avoid:**
Maintain a voice reference document containing 3-5 representative paragraphs from existing posts that exemplify the correct tone. Include this in every writing session as a concrete example, not a list of adjectives. Review posts specifically for voice after drafting — a separate pass from accuracy review. Specific things to watch for and purge: "delve into", "it's worth noting", "in today's rapidly evolving landscape", hedging phrases that water down assertions, and any sentence that sounds like a LinkedIn post.

**Warning signs:**
- Post introductions that start with context-setting instead of a direct statement
- Sentences that could appear in any tech blog
- Missing the direct imperative style visible in existing posts like "Currying in LLM agents means..."
- Overuse of transition phrases ("Furthermore", "Additionally", "It's important to")
- Loss of the technical peer tone in favor of explainer-to-novice tone

**Phase to address:**
Early — establish voice reference and prompt templates in the workflow setup phase. Revisit after every 5-10 posts to catch drift.

---

### Pitfall 3: Treating AI as Ghostwriter Instead of Co-Author

**What goes wrong:**
The workflow becomes "ask AI for a draft, lightly edit, publish." The human contribution shrinks to selection and light cleanup. The result is content that lacks genuine insight, original perspective, or lived experience with the topic. These posts are recognizable as hollow — competent but empty. The "co-authored with AI" credit becomes misleading.

**Why it happens:**
AI makes drafting frictionless, so the path of least resistance is to let it do more and more. The author's role degrades from "contributor of ideas and expertise" to "final approver." This happens gradually, not in a single decision.

**How to avoid:**
The human must supply the core insight or angle before the AI writes anything. The workflow should be: (1) Bjorn forms a clear thesis or observation from real experience, (2) AI helps develop and structure it, (3) Bjorn verifies and augments with specifics only he knows. Any post where Bjorn cannot identify a specific original contribution beyond "I had this idea and AI wrote it" should not publish.

**Warning signs:**
- Posts where the topic was AI-suggested, not author-initiated
- Posts that lack any specific personal experience, war story, or concrete example
- Posts that read as summaries of documentation rather than perspectives on it
- The author cannot explain why they care about the topic

**Phase to address:**
Workflow definition phase — bake the "human supplies thesis first" constraint into the process.

---

### Pitfall 4: Content Debt From Lowered Publishing Friction

**What goes wrong:**
AI makes publishing easy enough that quality gates get skipped. The blog accumulates thin posts, redundant coverage of the same topics, and content that makes the author look less serious when read together. A post that would not have been published under higher-effort conditions gets published because "it was easy." Over time, the archive works against the blog's credibility.

**Why it happens:**
The cost-per-post drops dramatically with AI assistance. This sounds like a benefit but removes a natural quality filter: effort. Posts that wouldn't survive the work required to write them manually now survive the much-lower work required to generate them. The decision criteria don't update to compensate.

**How to avoid:**
Apply a "would I write this by hand?" standard as a final gate — not "did AI make this fast to write?" but "does this post earn its place?" Keep a list of published posts and check for topic overlap before starting a new one. Explicitly track thin posts as technical debt and plan to either improve or delete them.

**Warning signs:**
- Two posts covering materially the same topic
- Posts under ~400 words that don't have a compelling reason to be short
- Posts that exist because "AI generated a good draft" rather than because the author had something to say
- Rising publish frequency without rising quality

**Phase to address:**
Workflow definition phase — establish quality criteria that compensate for reduced effort cost.

---

## Moderate Pitfalls

### Pitfall 5: Stale Code Examples and Tool References

**What goes wrong:**
Technical posts with code examples or tool recommendations become incorrect as libraries update, APIs change, and tools are deprecated. AI training data has a cutoff, so it may generate examples based on older API versions. Published posts accumulate silent incorrectness over time.

**Prevention:**
Always note the version context when publishing code examples (e.g., "tested with Node 22, Astro 5"). When using AI to write code examples, explicitly tell it the current version and verify the output compiles/runs. Accept that some posts will become outdated and establish a lightweight update practice for high-traffic posts.

---

### Pitfall 6: Frontmatter Integrity Failures

**What goes wrong:**
The Zod-validated frontmatter schema in AstroPaper enforces required fields. AI-generated post drafts may have incorrect `pubDatetime` formats, invalid `tags` structures, placeholder values in `description`, or incorrect `slug` values. These cause build failures or silent SEO damage.

**Prevention:**
Define a canonical frontmatter template that AI sessions use as a starting point. Validate frontmatter before committing by running `astro build` or a schema check. Never trust AI-generated ISO date strings — supply the date explicitly.

---

### Pitfall 7: Context Loss in Long Writing Sessions

**What goes wrong:**
Multi-hour writing sessions for long posts lose earlier context as the conversation grows. The AI forgets constraints established at the start, drifts from the established angle, or repeats information it already wrote. Posts written in long sessions often have structural inconsistencies invisible within individual sections.

**Prevention:**
For posts over ~800 words, break writing into sessions with explicit re-establishment of context: paste the outline, key thesis, and voice reference at the start of each continuation session. Review the full draft as a unit after all sections are written, not section-by-section.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Skip fact-checking a claim that "sounds right" | Faster publishing | Credibility damage when caught; readers learn not to trust the blog | Never |
| Let AI suggest the topic | Lower creative friction | Topic selection drives toward AI-default coverage, not author expertise | Occasionally for brainstorming, never as sole driver |
| Publish without a voice-check pass | Saves review time | Gradual voice erosion that's expensive to reverse across the archive | Never |
| Reuse a similar outline without verifying differentiation | Post feels familiar to write | Keyword cannibalization, readers notice repetition | Never |
| Let AI write the intro cold without author angle | Fast start | Intro sets generic framing that infects the whole post | Never |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| AstroPaper frontmatter schema | Trusting AI to generate valid `pubDatetime` / `modDatetime` ISO strings | Supply dates manually; AI often omits timezone or uses wrong format |
| Tag system | AI invents new tags instead of using existing ones, fragmenting navigation | Provide the current tag list explicitly in every new post session |
| Astro build pipeline | Committing drafts with `draft: false` prematurely | Keep `draft: true` until explicitly ready; build locally before pushing |
| GitHub Actions CI | Pushing posts that fail Astro's Zod validation | Run `npm run build` locally before committing any new post |

## Performance Traps

Not applicable at personal blog scale. Roobie.github.io is a static site; performance concerns are at build time, not runtime, and Astro handles this well with no content-volume ceiling relevant to this project.

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Including AI-generated code examples without review | Example contains insecure patterns readers will copy-paste | Review all code examples for security properties before publishing |
| Copying AI-suggested commands (curl pipes, shell scripts) without verification | Posts instructing readers to run harmful commands | Test every command in examples in an isolated environment |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| AI-polished intros that bury the point | Readers who skim miss what the post is about | Open with the thesis, not context-setting |
| Excessive hedging language throughout | Post feels uncertain, reader confidence in author drops | Assert directly; hedge only when genuine uncertainty exists |
| Posts that explain too much background | Condescends to the technical audience this blog targets | Trust the reader; link out for fundamentals rather than explaining them inline |
| Long posts without subheadings or a summary | Hard to extract value quickly for busy readers | Use structural formatting that serves the skim-reader without breaking the read-through experience |

## "Looks Done But Isn't" Checklist

- [ ] **Factual claims:** Every specific technical assertion, version number, or benchmark has a verified source — check against primary docs, not AI's confidence
- [ ] **Code examples:** Every code block has been executed and produces the expected output
- [ ] **Voice check:** Read the draft aloud — does it sound like Bjorn talking to a technical colleague or like a blog post generator?
- [ ] **Author contribution:** Can Bjorn articulate one original insight or experience that is specifically his? If not, the post is not ready
- [ ] **Frontmatter:** `pubDatetime`, `slug`, `tags`, `author`, and `description` are all explicitly set and valid — do not trust AI defaults
- [ ] **Build check:** `npm run build` passes locally before pushing
- [ ] **Differentiation:** Is there an existing post covering this topic? If yes, does this post say something materially different?
- [ ] **Intro quality:** Does the first paragraph state what the post is about and why it matters, rather than providing generic context?

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Published post with factual error | MEDIUM | Correct the post, update `modDatetime`, add a correction note at the top of the post; don't delete |
| Voice drift across several posts | HIGH | Identify which posts drifted, either revise or accept as historical record; re-establish voice reference document before next post |
| Frontmatter build failure | LOW | Fix the invalid field locally, rebuild, recommit |
| Thin post published that shouldn't be | MEDIUM | Either expand with a genuine revision or mark `draft: true` to remove from the live site |
| Context loss mid-session producing incoherent draft | LOW | Start fresh session with outline and thesis re-established; do not try to repair a drifted long-context draft |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Hallucinated technical claims | Content workflow setup — establish verification checklist | Every post has a fact-check log or inline source links |
| Voice drift | Workflow setup — create voice reference doc and prompt template | Posts pass a voice-check reading; colleague review periodic |
| Ghostwriter dynamic | Workflow definition — enforce "human thesis first" rule | Each post has a documented original angle before AI session starts |
| Content debt | Workflow definition — define quality and differentiation criteria | Topic list checked against archive before starting any new post |
| Stale code examples | Per-post execution — run all examples at publish time | All code blocks have version annotations |
| Frontmatter failures | Per-post process — use frontmatter template, run build locally | CI passes on every push |

## Sources

- [AI Blog Writing: Common Problems and Solutions — magai.co](https://magai.co/ai-blog-writing-common-problems-and-solutions/)
- [5 Pitfalls of AI-Generated Content — Omniscient Digital](https://beomniscient.com/blog/pitfalls-ai-generated-content/)
- [AI Blog Post Workflow: Write Without Content Debt — entrepreneuraitools.com](https://www.entrepreneuraitools.com/ai-blog-post-workflow/)
- [How mindless use of AI content undermines your brand voice — CXL](https://cxl.com/blog/ai-content-and-the-silent-erosion-of-brand-voice/)
- [What Are AI Hallucinations? — kapa.ai](https://www.kapa.ai/blog/ai-hallucination)
- [How to Avoid Hallucinations: Editorial Fact-Check Workflow — skywork.ai](https://skywork.ai/blog/how-to-avoid-hallucinations-ai-writing-fact-check-guide/)
- [Google AI Content Penalties — February 2026 Truth — maintouch.com](https://maintouch.com/blogs/does-google-penalize-ai-generated-content)
- [How Context Windows Shape Your AI Writing Over Time — Medium/Higher Neurons](https://medium.com/higher-neurons/how-context-windows-shape-your-ai-writing-over-time-30c75ec5f9df)
- [Using AI for content consistency: Dos and don'ts — Optimizely](https://www.optimizely.com/insights/blog/ai-for-content-consistency/)

---
*Pitfalls research for: AI-assisted personal tech blog (roobie.github.io)*
*Researched: 2026-03-10*
