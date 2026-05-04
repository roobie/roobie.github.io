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


## Q4 validation — preliminary results (2026-05-03)

### What we ran

20 StrategyQA yes/no questions, three conditions, Claude Haiku
(`claude -p --model haiku`). Script:
`site/drafts/memo-experiment/run_memo_eval.py`.

| Condition | Prefix | Accuracy |
|---|---|---|
| A — Baseline | (none) | 90% (18/20) |
| B — Minimal reconstruction | "Before answering, name the type of reasoning this problem requires and why. Then solve step by step." + 1 format exemplar (~29 words) | **95% (19/20)** |
| C — Full MeMo prefix | Definition paragraph + 3 worked exemplars (~217 words) | 80% (16/20) |

### Reading

B > A > C. The minimal reconstruction outperformed both baseline and the
full MeMo prefix. The full prefix *hurt* on Haiku — two questions produced
unparseable answers (framework-naming consumed the response budget), one
flipped to wrong.

This supports the reconstruction hypothesis: the mechanism is the forced
categorization pause, not the Munger framing. The extra ~190 words are
noise that a smaller model can't absorb gracefully.

Question 17 (cotton candy body weight) fails across all three conditions.
The question: "Could an average person eat a mass of cotton candy matching
their body weight?" (gold: yes). All three models said no. The gold answer
is correct — given enough time, a person can eat more than their mass in
any food-like substance; the question doesn't specify "in one sitting."
But the models (and this author's first reading) anchored on the intuitive
absurdity of "eat your body weight" without noticing the temporal
non-constraint. This is a confound-rich question, not a knowledge gap —
interesting precisely because the failure is consistent across prompting
strategies. The self-routing pause doesn't help when the model's error is
premature framing of the problem, not lack of a reasoning strategy.

### Caveats

- N=20 is small. The B-over-A difference is 1 question — not statistically
  significant on its own.
- Haiku is weaker than the models the paper tested (GPT-4, GPT-3.5). The
  full prefix might help more on stronger models.
- Our MeMo prefix is a reconstruction (~217 words), not verbatim from the
  paper (~300 words). The gap may partly reflect our reconstruction.
- The answer extraction heuristic (regex for yes/no) failed twice on
  condition C — verbose responses buried the answer. This is itself a
  finding: the full prefix encourages output structures that are harder
  to parse reliably.

### Next steps to strengthen this

1. **Run on Sonnet.** If B > A holds on a stronger model, the finding is
   much more robust. If C recovers on Sonnet, that's equally interesting —
   it would mean the full prefix is model-capability-gated.
2. **More questions.** 20 is directional. 50-100 from the StrategyQA dev
   set would give confidence intervals. Cheap on Haiku.
3. **Add MMLU-CS condition.** The paper's biggest MeMo win was +13% on
   MMLU CS (GPT-3.5). Multiple-choice is a different answer format — tests
   whether the mechanism generalizes beyond yes/no.
4. **Nonsense-label ablation.** Run condition B but with the instruction
   "Name a fruit before answering, then solve." If accuracy still rises,
   the frame label is cosmetic (any forced pause works). If it drops,
   the *content* of the self-routing matters, not just the pause.
5. **Multiple runs for variance.** The script supports `--runs N`. Three
   runs per condition on Haiku would show whether the 1-question
   differences are noise.

### Refine-recipe observations

The `decompose → parallel(invert, rotate) → synthesize` pass on this
post (run 2026-05-03) identified:

- **Dominant failure mode (invert):** "just another prompting tips post" —
  the reconstruction claim needs empirical backing to be credible, not
  just theoretical. Q4 validation directly addresses this.
- **Strongest rotation (rotate):** practitioner axis — lead with the
  copy-pasteable artifact (the minimal prompt), anchor with the constraint
  table. The "attention steering" reframe (from implicit-subject rotation)
  is the post's intellectual contribution beyond the paper.
- **Synthesis proposal:** Hook with the prompt → why it works (attention
  steering, not metacognition) → proof (constraint table) → what breaks
  it (failure modes) → source credit.
