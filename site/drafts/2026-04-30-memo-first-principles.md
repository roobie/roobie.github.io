---
title: "The Simplest Prompting Trick Nobody Isolated"
date: 2026-04-30
status: handoff
tags: [prompting, LLM, mental-models, first-principles, metacognition]
provenance:
  paper: "Towards Generalist Prompting for Large Language Models by Mental Models (arXiv:2402.18252v1, Feb 2024)"
  authors: "Haoxiang Guan, Jiyan He, Shuxin Zheng, En-Hong Chen, Weiming Zhang, Nenghai Yu (USTC)"
  related: "Principles Framework (github.com/miltonian/principles) — first-principles agent generation"
  analysis: "First-principles deconstruction performed 2026-04-29, PA repo session"
---

<!-- HANDOFF DOC — not a finished post. Carries full analytical substrate for
     BR to shape into voice. See "disposition" section at bottom for open
     questions and suggested post structure. -->


## Source material

### The paper: MeMo (Mental Models prompting)

Guan et al. (USTC, Feb 2024) propose **MeMo**, a prompting method that
lets LLMs self-select their reasoning strategy per problem instead of
imposing a fixed one (like Chain-of-Thought or Step-Back).

**Concrete shape.** MeMo is a static prompt prefix (~300 words) with two
components:

1. **Definition block (~100 words)** — paraphrases Charlie Munger's
   latticework idea: use cognitive frameworks from multiple disciplines,
   don't rely on a single model, integrate knowledge into theory not
   isolated facts.

2. **Three worked exemplars (~200 words)** — each shows a problem followed
   by "Identify applicable mental models:" with 1-2 named frames and a
   rationale sentence:
   - Dance lights timing problem → "Step-by-Step Thinking" + "Reflection"
   - Physics charge problem → "First Principles Thinking" + "Mathematical Reasoning"
   - Monoamine Oxidase candy bar → "Chemical Knowledge" + "Cause and Effect"

At inference the LLM emits "Mental Model(s):" (names 1-2 frames), reasons
within them, then answers. No task-specific examples, no fine-tuning, no
retrieval. The exemplars teach the *format* of self-routing, not the target
domain.

**Results.** Tested on GPT-3.5, GPT-4, Llama-2 70B across logical reasoning
(StrategyQA, FOLIO), STEM (MMLU CS/Math/EE), and commonsense (BIG-bench
Cause & Effect, Figure of Speech). MeMo matches or approaches the best
specialist method on nearly every benchmark without task-specific prompt
design. Highlights:

- +13% on MMLU CS over Direct Query (GPT-3.5)
- +6% on StrategyQA over Direct Query (GPT-4)
- +10.2% on Figure of Speech over Direct Query (GPT-3.5)
- Only loses to TDB on Math (GPT-4, -5.7%) and SB on EE (both models, small margin)

**Ablation.** Both definition and exemplars contribute, but unevenly per
task. Definition matters more for open-domain reasoning (StrategyQA);
exemplars matter more for formal logic (FOLIO). Peak accuracy requires both.

**What the LLM actually picks.** Analysis shows LLMs select topically
relevant frames — logical/deductive reasoning for FOLIO, geographical
knowledge for geography questions, cause-and-effect for causal tasks.
~50% of frames are problem-solving strategies, ~30% are subject concepts.

**Limitations the authors flag:**
- Long prompt = higher compute cost
- Depends on exemplar quality
- No guarantee of correct frame selection or faithful application (failure
  examples show correct frame + wrong reasoning)

### Adjacent work: Principles Framework

The [Principles Framework](https://github.com/miltonian/principles) (Node.js,
MIT, experimental) takes a related idea further: given a goal statement, it
uses first-principles decomposition to *generate persistent agent
definitions* — not just a prompt prefix, but a reusable multi-agent system.
Iterative refinement loop re-derives truths and subtasks until stable.

Conceptual parallel: both MeMo and Principles let the LLM self-select its
reasoning frame rather than requiring manual prompt design. Principles
materializes those frames as named agents; MeMo keeps them ephemeral
(generated per-question, discarded after).


## First-principles deconstruction of MeMo

### Deconstruction: what is MeMo actually made of?

| Part | What it actually is | Size |
|------|-------------------|------|
| Definition | A paragraph of metacognitive instruction | ~100 words |
| Exemplars | 3 problem→frame-selection demonstrations | ~200 words |
| Format enforcement | Implicit via exemplar structure | 0 words (structural) |
| Domain knowledge | None — fully parasitic on pre-training | 0 |
| Task-specific tuning | None | 0 |
| External retrieval | None | 0 |

MeMo contributes zero domain knowledge. It relies entirely on whatever the
model already knows about reasoning strategies. The prompt just *surfaces*
that knowledge by asking for it.

### Constraint classification

| Constraint/Claim | Type | Evidence | Challenge |
|---|---|---|---|
| "Mental models improve reasoning" | **Assumption** | Correlational — ablation shows accuracy gains, but the mechanism could be the forced pause, not the model selection itself | What if you just said "name a reasoning strategy before answering"? |
| "The definition paragraph matters" | **Soft** | Helps on StrategyQA, hurts Figure of Speech when used alone. Inconsistent signal | Possibly just priming — making the LLM "think about thinking" — not delivering new information |
| "The exemplars matter" | **Hard-ish** | Consistent gains across all tasks | But are they teaching frame selection or just enforcing a structured output template? |
| "LLMs autonomously select the right mental model" | **Assumption** | LLMs pick topically relevant frames, but failure examples show correct frame + wrong reasoning. Selection ≠ correct application | The frame label may be post-hoc rationalization, not genuine strategy routing |
| "Generalist — works across all tasks" | **Soft** | Near-SOTA on most benchmarks, loses to specialists on Math and EE | "Generalist" = no catastrophic failures, not universally optimal |
| "Zero-shot" | **Assumption** | The 3 exemplars ARE few-shot examples for meta-strategy selection. Zero-shot on the task domain, few-shot on the meta-task | Framing choice, not a hard property |
| "Mental models are the mechanism" | **Assumption** | No ablation isolates naming-a-frame vs. just-pausing-to-plan. CoT also forces structured reasoning and also works | The actual mechanism may be: any instruction that forces decomposition before answering improves accuracy |

### Reconstruction: what would we build from fundamentals only?

**Hard constraints (things the data actually supports):**

1. LLMs perform better when they generate intermediate reasoning before
   answering (established by CoT, well-replicated)
2. LLMs perform better when they self-select a reasoning strategy rather
   than having one imposed (MeMo's actual empirical contribution)
3. A few-shot format demonstration is needed to teach the LLM how to
   structure its self-selection
4. The specific frame labels ("First Principles", "Cause and Effect") may
   be largely cosmetic — what matters is the act of pausing to categorize
   the problem before reasoning

**Minimal reconstruction:** a prompt that says "Before answering, name the
type of reasoning this problem requires and why" plus 1-2 structural
examples. ~50 words instead of ~300. The Munger definition, the taxonomy,
the three cross-domain exemplars — these are **form**, not **function**.
They dress up a simpler mechanism.

### The actual insight

MeMo's contribution is not "mental models." It's the discovery that **asking
an LLM to self-label its reasoning strategy before applying it acts as a
universal performance booster**, because the label constrains subsequent
generation into a coherent frame rather than letting the LLM wander.

The mental models framing is reasoning by analogy — ironically — borrowing
Munger's concept to explain a prompting trick. The fundamental truth
underneath is simpler:

> **self-routing via explicit strategy naming > imposed strategy > no strategy**

The real research question MeMo accidentally raises but doesn't test:
**what's the minimal metacognitive instruction that maximizes self-routing
quality?** The paper treats the Munger framing as load-bearing rather than
decorative, so it never strips down to find the irreducible mechanism.


## Disposition — shaping into a post

### Open questions for BR to decide

1. **Audience.** Developers who prompt LLMs? Researchers? The broader
   "thinking tools" crowd? This determines tone and depth.

2. **Angle.** Several possible framings:
   - "The simplest prompting trick nobody isolated" — lead with the
     reconstruction, work backward to the paper
   - "Mental models are the wrong abstraction" — more confrontational,
     argues MeMo's framing obscures its own finding
   - "Self-routing: what happens when you let the LLM pick its own
     strategy" — neutral, explainer-style
   - "Munger meets GPT" — accessible crossover, Munger fans + AI people

3. **The one-liner test.** The post needs a single sentence someone would
   share. Candidate: *"The best prompting trick in a 2024 paper is buried
   under 300 words of Charlie Munger quotes — it's really just 'name your
   reasoning strategy before you start.'"*

4. **Do we validate the minimal reconstruction?** BR could run the stripped
   prompt ("name your reasoning strategy, then solve") against a few
   StrategyQA/MMLU questions and report whether it holds up. Would make
   the post much stronger but costs API tokens + time.

### Suggested structure

1. Hook — the prompt that works across everything (tease the one-liner)
2. What MeMo is — concrete description (the ~300-word prefix, the two
   components, the results table)
3. The deconstruction — constraint classification table, identify what's
   assumption vs. hard
4. The reconstruction — strip to fundamentals, propose the ~50-word
   version
5. Why this matters — self-routing as a general principle, implications
   for prompt design (stop hand-picking strategies, let the model route)
6. What's still unknown — the minimal instruction question, whether frame
   labels are cosmetic or causal

### Voice notes

- Per existing memory: no LLM polish for public-facing text. This handoff
  is analytical substrate, not draft prose. BR writes the post.
- The constraint classification table is the centerpiece — it's the kind
  of thing that gets screenshotted and shared.
