---
title: "Evolution as Coding — Session Handoff"
date: 2026-04-18
status: draft
purpose: Raw session transcript distilled into a handoff doc for a future blog post.
mode: caveman (terse technical voice, retained intentionally — rewrite for prose at publish time)
---

# Handoff: Evolution-as-Coding → Sample-Efficient Program Search

Session walked from a biology metaphor to a concrete product shape for a
self-improving code-rewriter. Four moves: metaphor → first-principles
teardown → negative-space map → compound-gap deep-dive → realistic
worked example. Each move builds on the previous; a blog post can
follow the same spine or cherry-pick one layer.

---

## Move 1 — Seed idea (user)

> Evolution is massively parallel multistart hill-climbing with
> "did this creature breed" as the objective. No global optimum, many
> local optima. How could applying that algorithm to coding/building
> software look?

## Move 2 — Map evolution → coding primitives

Stripped the biology. Irreducible mapping:

| Biology | Software search |
|---|---|
| Population | N candidate impls |
| Fitness | tests + lint + bench + human eyeball |
| Mutation | small diff (rename, swap algo, flip branch, perturb prompt) |
| Crossover | 3-way merge or LLM splice of two survivors |
| Selection | keep top-K by fitness, kill rest |
| Generations | loop: mutate → test → select |
| Niches | multiple fitness funcs in parallel (speed / size / readability) to prevent monoculture |

Skeleton:

```
seed = spec + failing test
for gen in 1..N:
  variants   = [mutate(s) for s in survivors] + crossover_pairs(survivors)
  scored     = parallel_run(fitness, variants)     # tests, bench, lint
  survivors  = top_k(scored, k=8)
  archive    novel_ones                            # MAP-Elites style
return pareto_front(survivors)
```

Prior art: genetic programming, AlphaEvolve (DeepMind 2025), OpenEvolve,
evolutionary fuzzing (AFL), neural architecture search.

**Sweet spot**: hot fn optimization, heuristic tuning, edge-case fuzzing,
prompt discovery, hyperparam search. **Breaks on**: slow/expensive
fitness, game-able fitness, no-gradient spaces, design problems where
human taste matters.

Caveman verdict: cool for tight inner loops, bad for architecture.

---

## Move 3 — First-principles teardown of GP

### Deconstruction — what GP really is

Five separable choices, not one algorithm:

1. Search space (set of expressible programs)
2. Variation operator (`program → program'`)
3. Fitness function (`program → scalar`)
4. Selection rule (prob distribution biased by fitness)
5. Compute budget (N evaluations)

Biology metaphor welds them together. They are independent.

### Constraint classification

| Constraint | Type | Challenge |
|---|---|---|
| Need population | soft | 1+1 ES and hill-climb work fine often |
| Need crossover | assumption | mutation-only often matches it |
| Scalar fitness | soft | MAP-Elites / Pareto beat scalar on deceptive landscapes |
| Tree/AST rep | soft | linear GP, grammar GP, token GP all work |
| Random mutation | assumption | LLM-guided mutation is directed — random was a compute-era artifact |
| Generational loop | soft | async / steady-state / island all valid |
| Fitness = tests passing | assumption | overfits / Goodhart |

**The one hard constraint**: No-Free-Lunch + eval cost. You cannot search
faster than you can evaluate. Everything else is design choice.

### Reconstruction

Truths only:
- programs live in discrete combinatorial space
- gradients mostly absent → must sample
- evaluation is expensive → must be sample-efficient
- LLMs encode a strong prior over "plausible program"

Collapses to:

```
loop:
  parent ← select from archive (novelty × fitness, not fitness alone)
  child  ← LLM_mutate(parent, context=failing_tests)   # directed
  score  ← multi_fitness(child)                         # tests + perf + size + behavior
  archive.add_if_novel_or_dominant(child)               # MAP-Elites
```

No trees. No crossover. No generations. No population in classical
sense — just an archive. **LLM-guided quality-diversity search over
programs.**

**Key insight**: classical GP bundled five choices behind one metaphor;
four of five were 1990s compute-era assumptions. Drop the metaphor →
directed QD search with learned priors dominates.

---

## Move 4 — Negative space at the intersection of program search + frontier LLMs

Crowded (skip): LLM-as-mutator (AlphaEvolve, FunSearch, Eureka,
OpenEvolve), Reflexion loops, HumanEval-style benchmarks, agent
scaffolds calling LLM in a loop.

Underexplored:

1. **Fitness synthesis itself** — LLMs propose/critique/evolve fitness functions. Meta-search.
2. **Cache topology** — algorithms designed *starting from* "eval costs $0.05 and 3 sec." Nothing like tournament selection emerges.
3. **Negative-results archive** — MAP-Elites of *failures*, conditioning future mutations on "why it failed."
4. **Behavior-space search** — embed program behavior, search in that space, decode to code last.
5. **HF on operators, not candidates** — which *transformations* a human finds tasteful. Operator fitness ≠ program fitness.
6. **Cross-project memory** — continual learning of a project-specific program prior.
7. **Pareto front as product** — UX of a navigable tradeoff curve, not a single "best."
8. **Verifier asymmetry** — cheap verifiers → should drive 10000-candidate search, not 100.
9. **Search over specs, not impls** — when LLMs code anything reasonable, pressure belongs on spec.
10. **Model-internal search** — tree/graph search with KV-cache reuse, rare outside labs.
11. **Distillation of search traces** — free lunch ignored.
12. **Anti-Goodhart fitness** — adversarial harness as standard, not afterthought.
13. **Staleness** — frontier model churns monthly; no porting framework.
14. **Economic envelope** — nobody publishes `$-to-solution` curves.

**Sharpest compound**: #2 + #8 + #11. Design search algo native to
"$0.05/eval but verifier near-free + I can distill my own traces." The
2026 shape. Classical GP + LLM-mutator is a transitional form.

---

## Move 5 — The compound expanded

Three gaps interlock:

- **Eval cost asymmetry**: LLM ≈ $0.01–0.10, 1–5 sec. Test/verifier ≈ $0, ms. 1000× gap.
- **Verifier cheapness**: types, tests, properties, formal checks, diffs — sub-second.
- **Trace waste**: every search throws away 10k–100k (prompt, completion, fitness) triples.

Classical search assumes eval dominates. Here *generation* dominates.
Different algorithm shape.

### The native algorithm

```
Phase 1 — cheap pre-filter (no LLM after gen)
  generate N candidates via LLM (batched, KV-cached on shared prefix,
    high-temp diverse sampling)
  → verifier wall: types, unit tests, property tests, static checks,
    self-consistency via cheap model
  → 80–95% die for free

Phase 2 — expensive ranking (LLM-as-judge, survivors only)
  top 5–20% get semantic eval, behavioral diff, LLM critique, taste proxy
  → pick top-K

Phase 3 — trace capture (free)
  log (context, candidate, verdict, judge_score, failure_mode) for every
  candidate, pass or fail

Phase 4 — distill (nightly / per-1000 traces)
  fine-tune small model (7B Qwen/Llama) on traces
  → domain-specific mutator
  → replaces 80% of frontier calls in Phase 1
  → cost drops 20–50× within a week
```

### Why each piece matters

- **Verifier wall = amplifier.** Every signal obtainable without an LLM: get before the LLM.
- **Asymmetric sampling.** Cheap verifier → big batches, high temp in Phase 1, low in Phase 2. Inverse of most scaffolds.
- **Traces as residual asset.** Opex → capex. Search gets cheaper the more you search.
- **Distilled mutator specificity.** 7B-on-your-domain beats frontier after ~5k traces.
- **Flywheel.** Phase 4 output makes Phase 1 cheaper → search more → more traces → Phase 4 better.

### Unlocks

- Search budgets flip from 50 → 50k candidates/problem at same $.
- Verifier engineering becomes the craft (not prompt engineering).
- Small-model renaissance: every serious shop trains its own mutator.
- Moat = traces, not models. Frontier provider becomes interchangeable.

### Where it breaks

- No cheap verifier (UI taste, novelty, conversation) → compound fails.
- Cold start — first 1000 traces still full frontier price.
- Distribution shift — distilled model rots as codebase evolves; retrain cadence needed.
- Verifier Goodhart — strong filter → LLM learns filter, not spec. Adversarial rotation required.
- Frontier keeps getting cheaper — but frontier is general, distilled is specific; specific should still win per-domain.

### Product shape

Not an agent framework. Not an LLM wrapper. It is:

> Search harness + verifier library + trace warehouse + nightly distill
> pipeline, domain-parameterized.

Looks like MLOps, not agent stack. Nobody ships this as a unit.
OpenPipe (distill), W&B (traces), LangSmith (traces) each hold one
piece; none stitch the loop.

**One-line bet**: agent frameworks are the Zune. Verifier-native +
trace-compounded search stacks are the iPod. Different primitive, same
user problem.

---

## Move 6 — Concrete worked example

**Domain**: Postgres slow-query rewriter.

**Scenario**: mid-size SaaS, 500 slow queries/day, DBA spends 15 hrs/wk
rewriting. Per query: slow SQL + schema + `EXPLAIN ANALYZE` in, equivalent
faster SQL out.

Why this domain fits:
- Cheap verifier (`EXPLAIN` free, semantic equivalence via sample data)
- Narrow (finite rewrite patterns)
- Trace-rich (500/day free)
- Real money (DBA hours + query latency)
- Goodhart-resistant (plan cost is objective)

### Phase 1

Sonnet generates 50 candidates, high temp, shared KV cache on schema
prefix. Cost ≈ $0.30, 8 sec.

Verifier wall (sub-second each, no LLM):

| Check | Kills |
|---|---|
| SQL parses | ~5% |
| Same tables/columns referenced (no hallucinated cols) | ~15% |
| `EXPLAIN` cost < original | ~40% |
| Runs on 1000-row sample, same rowset hash as original | ~25% |
| Adversarial sample (nulls, empties, dupes) same | ~5% |

50 → ~5 survivors. Failures cost $0.

### Phase 2

5 survivors → production-sized sample latency measurement. Haiku-judge
scores readability/maintainability. Pick 1. ≈ $0.05, 10 sec.

**Total per query: $0.35, 20 sec.** DBA reviews in 30 sec vs 20 min
rewrite. ~40× speedup.

### Phase 3

Every candidate logged:

```json
{
  "schema_fingerprint": "...",
  "original_query": "...",
  "original_plan_cost": 48200,
  "candidate": "...",
  "verifier_verdict": "pass" | "fail:sample_mismatch" | ...,
  "judge_score": 0.82,
  "final_latency_ms": 47,
  "rewrite_pattern": "exists→join" | "subquery→CTE" | ...
}
```

500 queries/day × 50 candidates = 25k traces/day. Two weeks → 350k.

### Phase 4

Fine-tune Qwen-7B-Coder on traces (positive + contrastive on failure
modes + pattern labels). One-time ~$200 GPU, 4 hrs. Ongoing ~$20/night.

Deploy: replace Sonnet in Phase 1.

| | Week 1 | Week 4 |
|---|---|---|
| Phase 1 model | Sonnet | Distilled Qwen-7B |
| Cost/query gen | $0.30 | $0.008 |
| Verifier pass rate | 10% (5/50) | 40% (20/50) |
| Winner quality | 1.0× | 1.3× (domain-tuned) |
| **Total $/query** | $0.35 | $0.015 |

**23× cheaper. Better results.** Domain-specific knowledge (this company's
schemas, naming, anti-patterns) embedded.

### Visible flywheel

Month 2: 1M traces. Retrain catches patterns Sonnet never would ("our
`events` table always needs BRIN hint on `created_at`").

Month 6: distilled model runs on laptop. DBA workflow: paste query → 3
ranked rewrites in 2 sec, offline. No API dependency.

### What must be built (and nobody talks about)

- Adversarial sample generator (else "return same query" passes sample-hash). Property-based generator (pgTAP-style) as first-class verifier.
- Schema evolution handling (`schema_fingerprint` in trace, filter training set to current schema).
- Judge drift (freeze judge model or re-score archive on judge change).
- Cold-start budget (~$1800 first 2 weeks, ROI crosses day 10).

### Component list (product shape)

1. Ingestion (slow query log → queue)
2. Candidate generator (pluggable: Sonnet → Qwen-7B)
3. Verifier library (parse, schema check, cost compare, sample equivalence, property tests)
4. Trace warehouse (Parquet on S3, ~$2/mo at this scale)
5. Nightly distill pipeline (Modal/RunPod, ~$20/night)
6. Serving (small model, CPU or T4)
7. Review UI for DBA (pick winner, feeds trace quality)

6–7 boring components. No "agent." No "framework." Sells to data teams,
not AI-curious CTOs. Different buyer.

### Ports to

Same recipe on: Terraform plan-diff minimizer, ESLint auto-fix synthesis,
Dockerfile layer optimizer, protobuf migration writer, flaky-test fixer,
Kubernetes resource-limit tuner. Any domain with cheap verifier + steady
input stream + domain-specific patterns.

---

## Suggested blog post spine

Order that worked in session:

1. Hook: "Evolution is massively parallel dumb hill-climbing. What happens if we code like that?"
2. Naive mapping (biology → software). Show the pretty skeleton.
3. First-principles teardown: reveal it's five independent choices, four are 1990s compute-era artifacts.
4. Reframe: LLM-guided quality-diversity search. No trees, no crossover, no generations.
5. Find the underexplored compound: eval-cost-asymmetric + verifier-cheap + trace-compounded.
6. Walk the Postgres slow-query example with real numbers.
7. Close: "Not LLM writes SQL. LLM bootstraps a self-improving rewriter that gets 23× cheaper in 4 weeks by compounding its own traces through a cheap verifier."

## One-line takeaway (for pull-quote / subtitle)

> Classical GP + LLM-mutator is a transitional form. The 2026 shape is
> verifier-native, trace-compounded search — an MLOps stack, not an
> agent stack.

## Loose threads worth a follow-up post

- Verifier engineering as a new craft (deeper dive on adversarial design).
- Economic envelope — publishing $-to-solution curves as a discipline.
- Search over specs, not implementations — when spec becomes the bottleneck.
- Behavior-space search — what embedding programs by behavior unlocks.
- Operator-level human feedback — taste as mutation prior.

---

*Source: single Claude Code session, 2026-04-18. Caveman-mode
compressed dialogue; rewrite for prose register before publishing.*
