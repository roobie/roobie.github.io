---
author: Björn Roberg, GPT-5.1
pubDatetime: 2026-01-25T13:00:00Z
modDatetime: 2026-01-25T13:00:00Z
title: A couple of notes on some software development topics.
slug: software-development-topics-opinion-1
featured: true
draft: false
tags:
  - software-engineering
  - llm
  - agents
description: Thoughts on some software development topics with regards to modern agentic tooling
---

I recently re-read https://chriskiehl.com/article/thoughts-after-6-years and wanted to recontextualize some of the thoughts listed there from a 2026 standpoint.

## 1. “Software architecture matters probably more than anything else”

In 2026 this is **more** true, not less, specifically *because* of agentic tooling.

### Why it matters more now

Agentic tools (code-generation agents, refactoring bots, AI test writers, etc.) are very good at:

- Filling in boilerplate
- Translating patterns across files
- Applying local refactors
- Wiring standard libraries and frameworks together

They are still weak at:

- Identifying domain boundaries and invariants
- Choosing where data and behavior should live
- Defining contracts between subsystems and services
- Designing for long‑term evolution under real‑world constraints

In other words: they are very strong on *implementation detail*, still mediocre on *architecture*.

So the original point:

> A shitty implementation of a good abstraction causes no net harm to the code base. A bad abstraction or missing layer causes everything to rot.

is even sharper now:

- **Good architecture + mediocre AI‑written code**
  Usually fixable with better prompts, small refactors, or swapping tools. The big decisions are right; the agents just need guidance.

- **Bad architecture + tons of AI‑written code**
  You get an *enormous* amount of low‑quality complexity very fast. Agents happily entrench bad boundaries, duplicate domain logic, and spread leaky abstractions everywhere.

### Relevance in a 2026 workflow

1. **Architects / senior devs become “system designers for humans + agents”**
   - Define clear module/service boundaries, contracts, and data shapes.
   - Make these explicit (docs, ADRs, architecture diagrams) so agents can be prompted against them.
2. **Architecture decisions must be promptable**
   - If your architecture can’t be explained as a small set of simple rules and invariants that an agent can follow, it’s probably too fuzzy.
3. **Guardrails > scaffolding**
   - Use agents for scaffolding and implementation, but keep humans in charge of:
     - Domain modeling
     - Cross‑cutting concerns (auth, observability, data lineage)
     - Evolution paths (how this system changes when requirements change)

Net: Strong architecture is now a *force multiplier* for agentic tools; weak architecture is a rapid‑complexity generator.

---

## 2. “Typed languages are better when you're working on a team of people with various experience levels”

With AI tools heavily in the loop, this got a new dimension: static types help **both juniors and agents** behave safely.

### Why this still (and more) holds

Types now serve three key roles:

1. **Specification for humans**
   - Same as before: they document expectations, catch obvious errors, and help IDEs provide better navigation and refactors.

2. **Specification for agents**
   - Agents use types as *ground truth* about:
     - What can be passed where
     - What a function promises to return
     - What states are legal vs illegal
   - A well‑typed API makes it much harder for an agent to generate obviously wrong code, especially in large unfamiliar codebases.

3. **Safety net for fast iteration**
   - 2026 workflows often look like:
     1. Ask an agent to generate or refactor a chunk of code.
     2. Run tests + static analysis.
     3. Fix what breaks.
   - Strong typing greatly reduces the “silent wrongness” slice of failures and surfaces mistakes earlier.

### Specific 2026 considerations

- **Mixed‑experience teams + agents**
  - Juniors rely on agents to produce starting points.
  - Types act as the guardrail that keeps those starting points from being dangerously incorrect.
- **Refactorability at AI speed**
  - When you ask an agent to “rename this concept across the codebase” or “split this module,” static types plus compiler errors give you a checklist of what to fix.
- **Language choices are now tool‑ecosystem choices**
  - Languages with strong type systems and mature LSPs (TypeScript, Go, Rust, Kotlin, modern Java, C#) tend to integrate better with agentic tooling.
  - Dynamically‑typed languages still work, but need more tests and runtime checks to give agents feedback.

So the 2026 twist could be phrased as:

> Typed languages aren’t just better for mixed‑experience *humans*; they’re better for mixed teams of humans plus agents.

---

## 3. “Monoliths are pretty good in most circumstances; micro‑services require justification”

Agentic tooling doesn’t change the fundamentals of system decomposition, but it **amplifies** the cost of complexity. Monolith‑first is arguably an even stronger heuristic now.

### Why monoliths age well with agents

1. **Single codebase = better agent context**
   - Agents are context‑limited. A well‑structured monolith:
     - Gives them a coherent picture of the domain.
     - Reduces cross‑repo / cross‑service cognitive overhead.
   - It’s easier to ask: “Find all the places we enforce this business rule” when everything is in one codebase.

2. **Easier to refactor with AI help**
   - Large, type‑safe monolith + tests = perfect playground for:
     - Big mechanical refactors
     - Breaking modules apart internally
     - Gradually extracting services *when justified*
   - You can *evolve* towards services with agent assistance instead of guessing up front.

3. **Operational simplicity still wins**
   - Microservices still bring:
     - Network partitions
     - Version skew
     - Observability overhead
     - Security and compliance complexity
   - Agents can help with infra code and runbooks, but they don’t remove the inherent distributed‑systems tax.

### Microservices in the 2026 + agent era

Microservices are still justified for the classic reasons:

- Independent scaling of truly distinct workloads
- Organizational boundaries (different teams needing autonomy)
- Regulatory/latency constraints that force data or logic separation

Agentic tools do **not** by themselves justify microservices. If anything, they push in the opposite direction:

- **Complexity is cheaper to type, but not cheaper to operate.**
- The marginal cost of “yet another service” in code is low with agents, but the runtime and org cost is unchanged.

A good 2026 rule of thumb, probably:

> Start with a modular monolith, designed with clear internal boundaries that *could* become services later. Use agents to keep that monolith clean. Only split when you can point to a specific, measurable reason.
