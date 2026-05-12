---
author: Björn Roberg, Claude Opus 4.7
title: "AI's 10x is symmetric. Your defense is not."
slug: ai-asymmetry-10x-blackhat
pubDatetime: 2026-05-12
description: "The AI productivity story is told as a one-sided gift to builders. It isn't. The same multiplier that lets your team ship 10x the code lets attackers find 10x the bugs in it — and the burden of being right everywhere stays with you."
tags:
  - security
  - agentic-coding
  - opinion
  - attack-surface
draft: true
---

> tl;dr The "10x productivity from AI" narrative measures the wrong side of the equation. Code generation is symmetric — defenders and attackers both got the boost — but the workload is not. Defenders must review every line; attackers need one hole. Worse: a lot of generated code is opaque to its own operators. That's not a 10x story. That's a widening gap.

## The narrative everyone repeats

The dominant story in 2026 is some version of: AI coding tools have made individual engineers 5-10x more productive, small teams are out-shipping mid-sized ones, and the bottleneck has moved from "writing code" to "deciding what to build."

I broadly believe the first half. I ship more code than I did two years ago, and most of it is fine. The part I want to push back on is the implied second half — that this is unambiguously good news for the people running the resulting systems.

It isn't. It's good news on the build side. The cost side is being quietly mispriced.

## What the multiplier actually multiplies

A 10x boost on writing code is also a 10x boost on:

- Reading code you didn't write
- Generating plausible-looking patches that introduce subtle bugs
- Producing fuzzing harnesses against arbitrary targets
- Triaging crash dumps at machine speed
- Synthesizing exploit chains from CVE feeds and source diffs

That second list is what the black-hat side of the industry has been doing with the same tools, on roughly the same timeline, for roughly the same prices. There is no version of this where defenders get the gift and attackers don't. The compute is fungible. The models are public. The fuzzing tooling is open source. The capability transfer is essentially free.

So the meaningful question isn't "did AI make builders faster" — yes, obviously. The meaningful question is: **on which side does the multiplier compound, and on which side does it just add work?**

## The asymmetry is in the review burden

Here's the part that doesn't get said enough:

> Defenders must review every line. Attackers need one hole.

This is an old observation in security circles, but the AI era changes the shape of it. Before AI, the constraint that kept the asymmetry tolerable was *human throughput on both sides*. Attackers had hours-per-target; defenders had hours-per-line. Roughly matched scales.

AI didn't lift those constraints symmetrically:

- **Generation throughput** went up by something like 10x.
- **Human review throughput** went up by maybe 1.5-2x (better tooling, better diff summaries, faster context loading).
- **Automated vulnerability discovery** went up by something like 10x.

So on a steady-state basis, the volume of code being shipped is racing ahead of the volume being reviewed, and the volume being attacked is racing ahead with it. The gap between "what's deployed" and "what's verified" widens continuously, not occasionally.

That gap is the actual liability. Everything else is downstream.

## The compounding factor: opaque code

There's a worse version of this story, and it's the one I think is currently being under-discussed.

A hand-written vulnerability exists in a codebase that *someone understands*. There's an author, there's intent, there's a mental model in some human head that the bug can be traced back to. Even when the original author leaves, the code carries enough fingerprints — naming, structure, comment style — that a successor can usually reconstruct the why.

A generated vulnerability sits in code that *nobody has read*. The architecture emerged from prompt chaining rather than deliberate design. The names are plausible. The structure looks like the structure of code that would solve the problem. But there is no mental model behind it — there is only the prompt history, which the operator probably didn't save, and which wouldn't fully explain the output even if they had.

This isn't theoretical. It's already the production state of a non-trivial percentage of systems running right now. The euphemism is "vibe-coded." The unflattering version is "code we ship without understanding."

Vibe-coded systems are opaque to their own operators. That's a different security posture than the industry has previously had to model. The same operator who used to be able to say "I don't remember why I wrote line 47 but I can re-derive it from the surrounding context" now has to say "I have no idea what the system does at line 47 because I never wrote it and the LLM that wrote it doesn't remember either."

Black-hat tooling doesn't care about authorial intent. It cares about behavior under inputs. The opacity helps the attacker and only hurts the defender.

## "We'll just use AI to review the AI"

This is the obvious counter and it's worth taking seriously. If generation got 10x, surely review got 10x too — point an LLM at the diff and let it find the holes.

Two problems with that:

1. **Review is harder than generation, not easier.** Generating plausible code requires producing tokens that fit a pattern. Reviewing code requires reasoning about behavior under all inputs, including inputs you haven't thought of yet. Current models are visibly better at the first than the second. The gap may close, but it hasn't yet.
2. **Adversarial review is a different problem from cooperative review.** An LLM reviewing your friendly engineer's code is reading code written without intent to deceive. An LLM reviewing code from an upstream package, an autogenerated dependency, or — increasingly — an autonomous agent in your own pipeline, is reading code that may have been shaped by an adversary's process. The review model has no immune response to that. It will happily approve a backdoor that pattern-matches to "normal-looking code."

So "use AI to review AI" is part of the answer, but it doesn't close the asymmetry. It moves it.

## What I think this means

Predicting the security industry is a fool's errand, so this is closer to "what I'd plan around" than "what will happen":

- **Code volume stops being a competitive signal.** It was a weak signal even before AI. Now it's noise. "We shipped 50k lines this quarter" tells me nothing about whether you ship secure systems.
- **"I've read every line in production" becomes a credible competitive claim.** Not a vibes claim — a verifiable one, backed by review artifacts, audit logs, and ideally external attestation. The market for that attestation is going to grow, and is already growing (see [agent supply chain immune system](/posts/agent-attestation-needs-an-expiry/) for the underwriting angle).
- **Mechanical review beats human review at scale, but only if you trust the mechanics.** Linters-as-gates, autohealth probes, capability allowlists, deterministic build pipelines. None of these are sufficient on their own. The combination, properly composed, is. Composition is the part nobody has standardized yet.
- **Small, well-understood codebases become a defensive moat.** This inverts the last 15 years of "scale or die." If your competitor is shipping 10x your volume on opaque generated code, and you can credibly say "every line in our production stack has been read by a human with domain expertise," you are the safer procurement choice for any buyer that has to answer to a regulator.
- **The buyers who can't tell the difference are the casualties.** This is the part I find most uncomfortable. A sophisticated buyer can ask the right questions. A typical buyer cannot, and will pick the vendor with the slicker demo and the lower price. The market only resolves this after enough incidents to establish a procurement floor, and incidents take time.

## What I'm doing about this

For my own systems: keeping codebases small, treating AI-generated patches as "draft for human review" rather than "ready to ship," and instrumenting heavily enough that I'd notice if behavior drifted. None of that is novel. The novelty is that it now buys you more than it used to, because the alternative — ship-and-pray — got a lot riskier.

For the systems I look at professionally: I increasingly read the *review evidence* before I read the code. Show me the linters, the test coverage, the dependency review log, the human sign-offs. If those don't exist, the codebase itself doesn't tell me what I need to know, no matter how clean it looks.

For the broader argument: I think "AI is a 10x productivity gain" is going to age the way "containers are a 10x deployment gain" aged. True on a narrow axis, materially misleading as a one-line description of what happened. The full sentence is "AI is a 10x productivity gain *and* a 10x widening of the gap between what you ship and what you've verified" — and that second clause is the one I'd plan a defense around.

---

<!--
DRAFT NOTES (remove before publishing):

Spine: PLA6EDWZ — pa::obs-asymmetric-attack-surface-unreviewed-code (2026-05-05).
Direct quotes used:
  - "Defenders must review every line. Attackers need one hole."
  - "Vibe-coded systems are opaque to their own operators."
  - "Black hats with ML-assisted fuzzing and vulnerability discovery hit
    that target surface at machine speed."
  - "I've read every line in production" as competitive claim
Cross-link target exists: /posts/agent-attestation-needs-an-expiry/
  (agent-supply-chain-immune-system.md, slug confirmed)

Open angles not yet incorporated, decide before publish:
  - DIGG / AI Act / public-sector procurement moat (in source observation)
  - Cite at least one concrete 2025-2026 incident where opaque generated
    code led to a real exploit — currently abstract; would land harder
    with a name attached
  - "Use AI to review AI" — section is sound but could use a citation
    to a published study on LLM reviewer false-negative rates
  - Tighten the "what I'd plan around" list — five bullets is one too many

Things to NOT do:
  - Don't go after specific vendors / specific incidents without sources
  - Don't slide into a pitch for any of BR's own products
  - Don't claim numbers I can't defend ("10x" is fine as figure-of-speech,
    don't anchor harder than that)

Style check: voice matches the-npm-problem and ioc-agentic-boundaries —
opinionated, first-person, willing to say "I don't know." Avoid the
EUDIW draft's encyclopedic tone; this is op-ed, not survey.
-->
