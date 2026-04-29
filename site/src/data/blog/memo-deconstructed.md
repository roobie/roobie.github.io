---
author: Björn Roberg, Claude
pubDatetime: 2026-04-30
title: "MeMo prompting, deconstructed: it's just self-routing"
slug: memo-deconstructed
featured: false
draft: false
tags:
  - llm
  - prompting
  - mental-models
  - first-principles
  - metacognition
description: "MeMo claims near-SOTA prompting via Munger's mental models. Strip the framing: what's left is one trick — ask the LLM to name its reasoning strategy first."
---

## The framing is doing too much work

[MeMo](https://arxiv.org/abs/2402.18252) (Guan et al., USTC, Feb 2024) proposes a generalist prompting method via Charlie Munger's "latticework of mental models" — apparently, asking an LLM to consult cognitive frameworks across disciplines yields near-SOTA performance on logical reasoning, STEM, and commonsense benchmarks without any task-specific tuning.

Read the prompt itself and the framing collapses. There are no mental models inside it. There is a paragraph paraphrasing Munger, three exemplars, and an output-format spec. The LLM does the rest with whatever it already knows. The framing carries no algorithmic load. It dresses up a much simpler mechanism.

## What MeMo actually is

A static ~400-word prefix in two parts:

1. **Definition block (~110 words)** paraphrasing Munger's latticework: use multiple cognitive frameworks, integrate knowledge into theory, don't rely on a single model.
2. **Three exemplars (~290 words combined)**, each of the form: problem, then `Identify applicable mental models:`, then 1–2 named frames with a one-sentence rationale. The exemplars cover a dance-light timing puzzle, a physics charge problem, and a monoamine-oxidase candy-bar puzzle.

At inference, the LLM emits `Mental Model(s):`, names 1–2 frames, reasons within them, then answers. No fine-tuning. No retrieval. No task-specific examples. The exemplars teach the *format* of self-routing, not anything about the target domain.

Empirical results across GPT-3.5, GPT-4, and Llama-2 70B: MeMo matches or approaches the best specialist method (CoT, Step-Back, Take-a-Deep-Breath) on nearly every benchmark, without per-task prompt design. Highlights:

- +13% on MMLU CS over Direct Query (GPT-3.5)
- +6% on StrategyQA over Direct Query (GPT-4)
- +10.2% on Figure of Speech over Direct Query (GPT-3.5)
- Loses to specialist methods on Math (-5.7%) and EE (small margin)

The contribution: one prefix, near-SOTA across many task types, no tuning.

## What's hard, what's soft, what's assumption

| Claim | Type | Reality |
|---|---|---|
| Mental models improve reasoning | assumption | Ablation shows accuracy gains, but the mechanism could be the forced pause to plan, not the model selection itself |
| The Munger definition is load-bearing | soft | Helps StrategyQA, hurts Figure of Speech when used alone — inconsistent signal, looks like priming rather than instruction |
| The exemplars are load-bearing | hard-ish | Consistent gains across tasks, but they may be teaching the output template, not the strategy taxonomy |
| LLMs autonomously pick the right model | assumption | Frame selections are topically plausible. Failure cases show correct frame plus wrong reasoning. Selection ≠ application |
| "Generalist" across all tasks | soft | Near-SOTA on most, loses to specialists on Math and EE. Generalist = no catastrophic failures, not universally optimal |
| "Zero-shot" | assumption | The three exemplars *are* few-shot for meta-strategy selection. Zero-shot on the task domain, few-shot on the meta-task |
| Mental models are the mechanism | assumption | No ablation isolates naming-a-frame versus just-pausing-to-decompose. CoT also forces structured pre-answer reasoning, and CoT also works |

The pattern: the things proven to matter are also the things that don't depend on the metaphor. Forcing the model to pause and decompose is well-established. Self-selecting a strategy beats imposing one. None of that requires Munger.

## Reconstruction from fundamentals

Keep what the data supports:

- LLMs reason better when they generate intermediate structure before answering.
- LLMs route better when they self-select a strategy than when one is imposed.
- A small number of format demonstrations is needed to teach the LLM *how* to structure that self-selection.
- Frame *labels* may be cosmetic. What matters is the act of categorising the problem before reasoning, not the specific taxonomy used.

What falls out:

> Before answering, name the type of reasoning this problem requires and why.

Plus 1–2 structural exemplars. Roughly 50 words instead of 400. The Munger paragraph, the latticework taxonomy, the cross-domain frame names — all form, not function.

## The actual mechanism

> Self-routing via explicit strategy naming > imposed strategy > no strategy.

That's the empirical content. The contribution isn't "mental models." It's the discovery that asking an LLM to label its own reasoning strategy before applying it acts as a universal performance booster, because the label constrains the rest of the generation into a coherent frame instead of letting it wander.

The "mental models" framing is itself reasoning by analogy — borrowing Munger's vocabulary to dignify a prompting trick whose actual mechanism is much smaller and more boring than the framing suggests.

## What the paper accidentally raises but doesn't test

The interesting question, once the metaphor falls away, is empirical and minimal: *what is the smallest metacognitive instruction that maximises self-routing quality?*

- Does "name your reasoning strategy" work as well as the full MeMo prefix?
- Are the named frames load-bearing or interchangeable? Does `Strategy A` / `Strategy B` work as well as `First Principles Thinking` / `Cause and Effect`?
- How few exemplars are enough? One? Zero, with a strong instruction?
- Does the gain disappear on models post-trained for chain-of-thought, where structured pre-answer reasoning is already the default?

MeMo treats the Munger framing as load-bearing rather than decorative, so it never strips down to find the irreducible mechanism. The paper validates the trick but mislabels what the trick is.

## The tell

If you find yourself debating which mental models to put in your prompt, or whether your exemplars cover enough disciplines, or whether the latticework is "complete," you are optimising the costume, not the mechanism. The useful question is whether self-labelling the reasoning strategy improves outputs on your task. Everything else is decoration.

---

*Companion: [Genetic programming, deconstructed](/posts/gp-deconstructed/) applies the same "strip the metaphor" move to evolutionary computation — five independent design choices welded together by a biology analogy that does no algorithmic work.*

*Source: "Towards Generalist Prompting for Large Language Models by Mental Models," Guan et al., USTC, [arXiv:2402.18252](https://arxiv.org/abs/2402.18252), Feb 2024. Adjacent: the [Principles Framework](https://github.com/miltonian/principles) takes a related self-routing idea further — first-principles decomposition that materialises into persistent agent definitions rather than ephemeral per-question frames.*
