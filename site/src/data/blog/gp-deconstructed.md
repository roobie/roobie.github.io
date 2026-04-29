---
author: Björn Roberg, Claude
title: "Genetic programming, deconstructed: four of five assumptions are 1990s artifacts"
pubDatetime: 2026-04-18
description: "Classical GP bundles five independent design choices behind one biology metaphor. Four of them are compute-era assumptions that don't survive contact with frontier LLMs. What's left is a different algorithm."
draft: false
tags: ["llm", "program-search", "evolutionary-computation"]
---

## The metaphor is doing too much work

Genetic programming reads, at first, like a single algorithm: population, mutation, crossover, fitness, selection, generations. The biology analogy welds the pieces together so tightly that people treat "do GP" as one decision.

It isn't. It's five independent choices stacked into a trench coat.

1. **Search space.** What set of programs can be expressed at all? Trees, linear token strings, grammars, ASTs, free-form text.
2. **Variation operator.** How does `program → program'` happen? Random edits, structured mutations, crossover, LLM rewrites.
3. **Fitness function.** How does `program → scalar` work? Tests, benchmarks, heuristics, human eyeball, learned judges.
4. **Selection rule.** Given fitness, what's the probability distribution over who breeds? Tournament, rank, truncation, novelty-biased.
5. **Compute budget.** How many evaluations are you willing to pay for?

Each of these is independently adjustable. The biology metaphor hides that. It also anchors every choice to what made sense in 1990, when CPU was the scarce resource and the field had no better prior over "plausible program" than random.

Pull the pieces apart and ask which constraints are actually load-bearing.

## What's hard, what's soft, what's assumption

| Constraint | Type | Reality |
|---|---|---|
| Need a population | soft | (1+1) ES and hill-climbing often match GP on real problems |
| Need crossover | assumption | mutation-only algorithms frequently match or beat crossover-based ones |
| Scalar fitness | soft | [MAP-Elites](https://arxiv.org/abs/1504.04909) / Pareto selection beat scalar on deceptive landscapes |
| Tree/AST representation | soft | linear GP, grammar GP, token-level GP all work |
| Random mutation | assumption | LLM-guided mutation is directed; randomness was a compute-era artifact |
| Generational loop | soft | async / steady-state / island-model all valid |
| Fitness = tests passing | assumption | overfits fast, Goodharts faster |

Exactly one constraint is hard: **[no free lunch](https://en.wikipedia.org/wiki/No_free_lunch_theorem) plus evaluation cost.** You cannot search faster than you can evaluate. Everything else in the classical recipe is a design choice that got frozen by convention.

## Reconstruction from first principles

Keep only what's actually true:

- Programs live in a discrete combinatorial space.
- Gradients are mostly absent, so you have to sample.
- Evaluation is expensive, so sampling must be efficient.
- LLMs encode a strong prior over "plausible program" that didn't exist when GP was invented.

What comes out of that is not GP. It's this:

```
loop:
  parent ← select from archive (novelty × fitness, not fitness alone)
  child  ← LLM_mutate(parent, context=failing_tests)   # directed, not random
  score  ← multi_fitness(child)                         # tests + perf + size + behavior
  archive.add_if_novel_or_dominant(child)               # MAP-Elites
```

No trees. No crossover. No generations. No population in the classical sense — just an archive indexed by behavior. Mutation is directed by a learned prior, not sampled from a uniform distribution over edits. Selection is biased toward novelty as much as toward fitness, because scalar fitness on discrete program spaces is a known trap.

The honest name for this is **LLM-guided quality-diversity search over programs.** The biology framing contributes nothing once the LLM is in the loop.

## What changed

Four things, all from the last five years:

- **Priors got strong.** Random mutation was the default because nothing better existed. An LLM sampling from a high-temperature distribution is a directed mutation operator with a prior over syntactic plausibility, variable naming, and idiomatic patterns. That prior is worth many orders of magnitude of blind search.
- **Evaluation got cheap relative to generation.** Types, tests, property checks, static analysis, `EXPLAIN` plans — the verifier side of the loop runs in milliseconds. The LLM call is the new bottleneck, which is the inverse of 1990. I wrote about the downstream implications in [Verifier-native search: the 2026 shape](/posts/verifier-native-search/).
- **Quality-diversity beat scalar fitness.** MAP-Elites and its descendants demonstrated that keeping an archive of behaviorally-distinct solutions, rather than a single elite, navigates deceptive landscapes better. The biology-shaped "population" was always a crude approximation of this.
- **Traces became assets.** Every candidate, pass or fail, is training data for a smaller model that will replace the frontier mutator. The loop gets cheaper the more you run it. Classical GP had no analog.

None of these are small adjustments. Together they break enough of GP's premises that calling the result "evolutionary" is a historical courtesy, not a technical description.

## Where the metaphor still earns its keep

Three narrow places:

- **Vocabulary.** "Population," "niche," "Pareto front," "elitism" are still the cleanest names for concepts that keep appearing in different guises. Renaming them is churn.
- **Pedagogy.** When teaching quality-diversity or novelty search, the biology frame is a useful lossy intuition pump. It breaks on close inspection, which is the point at which you promote the student to the actual math.
- **Massive-scale reward search.** When the verifier is ~free (simulators, game environments, reward-function search) and the generator is still the expensive part, tournament-style selection over large populations works. [Eureka](https://eureka-research.github.io/) is the clearest example. Classical GP shape, modern components, and it works because the asymmetry happens to match what tournament selection assumes.

Everywhere else, the metaphor costs more in confused intuitions than it earns in vocabulary.

## The tell

If you find yourself arguing about whether to use crossover, or whether tree-based or linear representations are "more evolutionary," or whether your fitness function is "biologically realistic," you're optimising a 1990s compute profile on 2026 hardware.

The useful questions are: what's my search space, what's my variation operator, what's my fitness signal, what's my selection rule, and what's my budget. Five independent knobs. Answer each on its own terms. The biology was never the point.

---

*Companion post: [Verifier-native search: the 2026 shape](/posts/verifier-native-search/) picks up where this leaves off — once you've dropped the metaphor, the cost curve reshapes the algorithm again.*

*Companion: [MeMo prompting, deconstructed](/posts/memo-deconstructed/) does the same first-principles strip on a different framing — the "mental models" prompting trick whose actual mechanism turns out to be much smaller than its packaging.*
