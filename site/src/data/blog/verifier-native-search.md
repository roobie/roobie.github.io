---
author: Björn Roberg, Claude
title: "Verifier-native search: the 2026 shape"
pubDatetime: 2026-04-18
description: "LLM generation costs roughly 1000× more than verification. The serious program-search systems already exploit this. The agent-scaffold mainstream doesn't — and nobody yet compounds search traces into a domain-specific mutator."
tags: ["llm", "program-search", "agents", "evaluation"]
---

## The cost curve everyone is pricing wrong

A frontier LLM call costs $0.01–0.10 and takes 1–5 seconds. A verifier — type check, unit test, property test, `EXPLAIN`, static analysis, sample-hash equivalence — costs effectively $0 and runs in milliseconds. That is roughly a 1000× asymmetry between generation and verification.

Most of the public agent tooling is built as if those numbers were reversed. [Reflexion](https://arxiv.org/abs/2303.11366) runs an LLM critic over its own trace. [Self-Refine](https://selfrefine.info/) is LLM-feedback into LLM-refine with no compiler wall in between. The standard [LangChain](https://www.langchain.com/) "reflection" template invokes a model on every step. These loops treat the verifier as an afterthought bolted on by the user, and the LLM as the primary scoring mechanism.

That is the wrong shape for the actual cost curve.

## Who already gets it

The program-search literature has been building for the real curve for a while. Worth naming, because it sharpens what is and isn't novel:

- **[FunSearch](https://github.com/google-deepmind/funsearch)** (DeepMind, [Nature 2023](https://www.nature.com/articles/s41586-023-06924-6)) splits into a sampler and a sandboxed evaluator. Programs that error are discarded with no LLM re-inspection. The programs database only ingests numeric scores.
- **[AlphaEvolve](https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)** (DeepMind, 2025; [white paper](https://arxiv.org/abs/2506.13131)) runs an autonomous pipeline with a deterministic, user-supplied fitness function and hierarchical evaluation — cheap tests first, expensive ones only on survivors.
- **[OpenEvolve](https://github.com/algorithmicsuperintelligence/openevolve)** ships `cascade_evaluation: true` as a first-class config flag, plus an `artifacts` channel that feeds stderr, build warnings, and profiling output back into the next prompt as structured context.
- **[Eureka](https://eureka-research.github.io/)** (NVIDIA, 2023) evolves reward functions and scores candidates with massively parallel RL rollouts in Isaac Gym. GPT-4 proposes; a fast simulator disposes. Thousands of candidates per LLM call. This is the asymmetry exploited on purpose.

[Noam Brown](https://simons.berkeley.edu/sites/default/files/2024-11/LLM24-1%20Slides%20-%20Noam%20Brown.pdf) has a name for this: the **generator–verifier gap**. It's standard vocabulary in the inference-scaling and process-reward-model literature now.

So the claim "nobody does this" is wrong. The correct claim is narrower and more interesting: *verifier-native search is the norm in evolutionary program search and the exception in the agent-scaffold mainstream.* The two communities are not reading each other's papers.

## The shape of the native loop

Once you take the cost curve seriously, the algorithm rearranges itself:

```
Phase 1 — cheap pre-filter (no LLM after generation)
  Generate N candidates via LLM, batched, KV-cache shared on the stable prefix,
    high temperature for diversity.
  Run the verifier wall: parse, type, unit tests, property tests, static checks,
    sample-equivalence hashes.
  80–95% die for free.

Phase 2 — expensive ranking (LLM judge, survivors only)
  Top 5–20% get semantic eval, behavioral diff, taste proxy.
  Pick top-K.

Phase 3 — trace capture (free)
  Log (context, candidate, verdict, judge_score, failure_mode) for every
    candidate, pass or fail.

Phase 4 — distill (nightly, per ~1000 traces)
  Fine-tune a small model (7B class) on the corpus.
  Deploy as the Phase 1 mutator.
  Phase 1 cost drops 20–50× within a week.
```

Three design commitments carry the weight:

- **The verifier wall is an amplifier.** Anything obtainable without an LLM is obtained before the LLM. Types, tests, static analysis, cheap runtime checks — all of them gate before a model gets a second look.
- **Sampling is asymmetric by phase.** Big batches and high temperature in Phase 1, small batches and low temperature in Phase 2. This is the inverse of the typical agent scaffold, which runs one expensive call with a critic loop glued on.
- **Traces are a residual asset.** Every candidate, pass or fail, becomes a row in a training corpus. Search becomes cheaper the more you search. Opex turns into capex.

Phase 4 is the piece that is genuinely under-explored in the literature. Reasoning-trace distillation exists. Prompt-optimiser distillation exists. "Take the evolutionary-search trace corpus and SFT a small domain-specific mutator to replace the frontier model in the outer loop" does not appear as a landed, named technique as of this writing. It is the obvious next move and I cannot find anyone shipping it as a unit.

## Worked example: Postgres slow-query rewriter

Concrete domain, because the numbers matter.

A mid-size SaaS runs 500 slow queries a day. A DBA spends about 15 hours a week rewriting them. Input: slow SQL + schema + `EXPLAIN ANALYZE`. Output: equivalent faster SQL.

The domain fits the shape for four reasons. The verifier is cheap (`EXPLAIN` is free; sample-data equivalence is sub-second). The rewrite pattern space is narrow and finite. The input stream is trace-rich at 500/day. Plan cost is objective, so Goodhart pressure is low.

### Phase 1

Sonnet generates 50 candidates, high temperature, KV cache shared on the schema prefix. Call it $0.30, 8 seconds.

The verifier wall runs sub-second per check, no LLM:

| Check | Approx. kill rate |
|---|---|
| SQL parses | ~5% |
| Same tables/columns referenced (no hallucinated columns) | ~15% |
| `EXPLAIN` cost lower than original | ~40% |
| Runs on 1000-row sample, same rowset hash as original | ~25% |
| Adversarial sample (nulls, empties, duplicates) matches | ~5% |

50 candidates collapse to roughly 5 survivors. Failures cost $0.

Rates are illustrative. Actual numbers depend on schema complexity and prompt quality. The point is the shape: the wall does the filtering, not a model.

### Phase 2

Five survivors get production-sized sample measurement. A cheap model scores readability and maintainability. One winner. Call it $0.05 and 10 seconds.

Per query: roughly $0.35 and 20 seconds. DBA review takes about 30 seconds versus a 20-minute rewrite from scratch.

### Phase 3

Every candidate, pass or fail, gets logged:

```json
{
  "schema_fingerprint": "...",
  "original_query": "...",
  "original_plan_cost": 48200,
  "candidate": "...",
  "verifier_verdict": "pass | fail:sample_mismatch | ...",
  "judge_score": 0.82,
  "final_latency_ms": 47,
  "rewrite_pattern": "exists→join | subquery→CTE | ..."
}
```

500 queries × 50 candidates = 25k traces a day. Two weeks gets you to ~350k.

### Phase 4

Fine-tune a 7B coder model on the trace corpus — positives, plus contrastive on failure modes, plus pattern labels. Roughly $200 of GPU time up front, ~$20/night ongoing.

Deploy: the distilled model replaces Sonnet in Phase 1.

| | Week 1 | Week 4 (illustrative) |
|---|---|---|
| Phase 1 model | Sonnet | Distilled 7B |
| Cost per candidate batch | $0.30 | ~$0.008 |
| Verifier pass rate | ~10% | ~40% |
| **Total per query** | ~$0.35 | ~$0.015 |

Those numbers should be read as the shape, not the measurement. What's robust is the direction: cost drops by more than an order of magnitude because the small model, trained on this company's schemas and failure modes, proposes fewer dead candidates per batch.

### The flywheel

At month two, the trace corpus is large enough that retraining picks up patterns the frontier model never would — the local knowledge ("our `events` table always needs a BRIN hint on `created_at`") that no amount of general pretraining captures.

By month six the distilled model runs on a laptop. DBA workflow: paste query, three ranked rewrites in two seconds, offline, no API dependency.

## Where it breaks

This is not a universal recipe. It fails cleanly in several directions:

- **No cheap verifier.** UI taste, conversational quality, novelty, aesthetic judgments. The compound collapses when the verifier has to be a model.
- **Cold start is expensive.** The first ~1000 traces are full frontier price. ROI typically crosses around day 10 in this kind of domain. Shorter feedback loops won't amortise.
- **Distribution shift.** Distilled models rot as the codebase evolves. Retrain cadence is a live operational concern, not a set-and-forget.
- **Verifier Goodhart.** A strong filter teaches the model the filter, not the spec. Adversarial sample generators and rotation are required, not optional.

## What you actually build

This is not an agent framework. It's not an LLM wrapper. The component list:

1. Ingestion (slow-query log → queue)
2. Candidate generator (pluggable: frontier model, then distilled)
3. Verifier library (parse, schema, cost, equivalence, properties)
4. Trace warehouse (Parquet on S3 is fine at this scale — a couple of dollars a month)
5. Nightly distill pipeline ([Modal](https://modal.com/), [RunPod](https://www.runpod.io/), whatever)
6. Serving (small model, CPU or T4)
7. Review UI (human picks winner, feeds trace quality)

Six or seven boring components. No agent orchestration layer. No prompt-framework dependency. The shape is MLOps, not agent stack.

Nobody ships the full loop for program search. The closest thing is **[OpenPipe ART](https://github.com/OpenPipe/ART)** — open-source agent rollouts, verifier-driven rewards (RULER), and fine-tuning into a distilled model, all in one repo. Two and a half of the three pieces. But ART is framed around agent task completion, not evolutionary program search with a nightly mutator. [Braintrust](https://www.braintrust.dev/), [LangSmith](https://www.langchain.com/langsmith), [Langfuse](https://langfuse.com/), [Humanloop](https://humanloop.com/) and the other eval/trace platforms stop at the trace step and hand off to the user. [OpenEvolve](https://github.com/algorithmicsuperintelligence/openevolve) and [CodeEvolve](https://arxiv.org/abs/2510.14150) ship the search loop but not the trace warehouse or the distillation cadence. The combined stack — verifier-native search plus trace-compounded mutator distillation, sold as one product — is still not on the shelf.

It ports cleanly to any domain with the same structure: cheap verifier, steady input stream, recurring patterns. Terraform plan-diff minimisers. ESLint auto-fix synthesis. Dockerfile layer optimisers. Protobuf migration writers. Flaky-test fixers. Kubernetes resource-limit tuners.

## The bet

Program-search systems already exploit the generator–verifier gap. Agent scaffolds don't. The interesting compound, which nobody is shipping as a unit, is **verifier-native search plus trace-compounded distillation into a domain-specific mutator**. Search gets cheaper the more you search. The moat stops being the frontier model and starts being the trace corpus. The frontier provider becomes interchangeable.

That's the 2026 shape. MLOps, not agent stack.

---

*Prior art referenced: FunSearch (Romera-Paredes et al., Nature 2023), AlphaEvolve (DeepMind white paper, arXiv 2506.13131, 2025), OpenEvolve (algorithmicsuperintelligence/openevolve), Eureka (NVIDIA, 2023). The "generator–verifier gap" framing is Noam Brown's, Simons Institute 2024.*
