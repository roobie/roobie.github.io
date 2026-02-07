---
author: Björn Roberg, GPT-5.1
pubDatetime: 2026-01-19T13:00:00Z
modDatetime: 2026-02-07T23:00:00Z
title: Building Smarter AI Agents With Ideas From Philosophy
slug: building-smarter-ai-agents-with-ideas-from-philosophy
featured: true
draft: false
tags:
  - discussion
  - braindump
  - agents
  - philosophy
description: Philosophically informed agent design means explicitly modeling what an AI believes, how it knows things, and which moral and epistemic norms guide its decisions, so that its behavior becomes more reliable, inspectable, and aligned with human expectations.
---

When we talk about "AI agents," we usually jump straight to tools, APIs, and model prompts. But under the hood, any useful agent is constantly doing something deeply philosophical: forming beliefs, weighing evidence, making decisions, and following (or breaking) rules.

This post explores philosophically informed agent design by showing how epistemic frameworks for agent design (drawn from epistemology and ethics) can make AI behavior more reliable, inspectable, and aligned. The aim is to keep things concrete and implementable, not just hand‑wavy.

---

## 1. Make the Agent’s “Beliefs” Explicit

Instead of treating your agent as a black box that just spits out text, treat it as something that has beliefs about the world.

### Store beliefs, not just chat logs

Don’t just keep a raw history of messages. Maintain a structured “world model” that captures what the agent thinks is true and how sure it is.

You can think of a simple **BeliefStore** with entries like:

| Property | Purpose |
|----------|---------|
| proposition | What the belief is about ("user lives in Berlin") |
| confidence | How sure the agent is (0.2–0.95) |
| source | Where this belief came from (user message, web tool, model prior, etc.) |
| last_updated | When it was last revised |

### Keep track of “because…”

For important beliefs, store **why** the agent believes them:

- Derived from what? (tool call, user input, internal reasoning)
- What intermediate steps led to it?

That way you can later inspect whether the agent “knows” something in a robust way or is just repeating a guess with too much confidence.

### Embrace uncertainty

Instead of pretending the agent is always certain, make uncertainty first‑class:

- Represent beliefs with probabilities or coarse categories (low / medium / high confidence).
- Define behavior policies like:

| Confidence Level | Agent Behavior | Example |
|-----------------|----------------|---------|
| <0.6 | Ask user or gather more info | "I'm not sure about..." |
| 0.6-0.8 | Proceed but state assumptions | "It's likely that..." |
| >0.8 | Act, log failure modes | "Given evidence, very likely..." |

This is essentially taking ideas from formal epistemology (Bayesian/evidential reasoning) and applying them to your knowledge store.

---

## 2. Turn Epistemic Norms Into Code Rules

Philosophy has a lot to say about what makes for **good** beliefs. You can turn those norms into concrete coding constraints.

| Norm | Principle | Code Implementation |
|------|-----------|---------------------|
| Epistemic humility | Don't overclaim | Hedging policy based on confidence |
| Principle of charity | Interpret generously | Rephrase + consistency check |
| Robustness | Reserve "knows" for stable beliefs | Belief promotion through validation |

### 2.1 Epistemic humility (avoid overclaiming)

- Don't let the agent present low‑confidence beliefs as facts.
- Implement a **hedging policy** where wording depends on confidence:
  - Low confidence: "I'm not sure, but one possibility is…"
  - Medium confidence: "It's likely that…"
  - High confidence: "Given the information, it's very likely that…"

```python
# Pseudocode: Hedging policy
if confidence < 0.6:
    wording = "I'm not sure, but one possibility is..."
elif 0.6 <= confidence <= 0.8:
    wording = "It's likely that..."
else:
    wording = "Given the information, it's very likely that..."
```

### 2.2 Principle of charity (interpret users generously)

When the user says something ambiguous, default to the most reasonable interpretation instead of the weirdest.

Implementation ideas:

- Internally rephrase the user’s request in the agent’s own words.
- Check for obvious inconsistencies with past messages.
- Only ask for clarification when there’s major ambiguity that could change the outcome.

### 2.3 Don’t call it “knowledge” unless it’s robust

Reserve “the agent knows X” for beliefs that:

- Stay stable under slightly different prompts or contexts.
- Are supported by multiple tools or sources.
- Pass basic sanity checks.

You can model this as a promotion: beliefs get “upgraded” to **known** only after cross‑validation.

---

## 3. Make Decisions With Moral Structure, Not Just Heuristics

When an agent chooses actions, it's implicitly taking a moral stance. You can make that structure explicit using ideas from moral philosophy and decision theory.

| Moral Framework | Considers | Implementation |
|----------------|-----------|----------------|
| Consequentialist | Benefits and harms | Risk budget, utility estimation |
| Deontic (Rules) | Hard constraints | Hard filters, rule violations thrown away |
| Virtue-based | Character and habits | Honesty, fairness, carefulness heuristics |

### 3.1 Consequences: how good or bad is each action?

Build a **consequentialist layer** that:

- Estimates likely benefits and harms for each action.
- Refuses to pursue small gains if there’s a risk of big downside.
- Uses a **risk budget** per session or per user:
  - Low‑risk contexts → more freedom to explore.
  - High‑stakes contexts (health, finance, safety) → much tighter constraints.

### 3.2 Rules: hard lines the agent must not cross

Add a **rule-based (deontic) layer**:

- Explicit "do not" rules: legal, ethical, platform or product constraints.
- Implement them as **hard filters** in the planner: any candidate plan that violates a rule is simply thrown away, not just given a lower score.

These three layers work together: rules eliminate obviously bad plans, consequences score remaining options, virtues tie-break.

### 3.3 Traits: build in good "habits"

Use **virtue-inspired heuristics** to give the agent character:

- **Honesty:** don’t invent unknown data; say “I don’t know” and try to find out.
- **Fairness:** don’t systematically favor certain users, groups, tools, or outcomes without a good reason.
- **Carefulness:** in high‑stakes situations, demand stronger evidence, use slower/safer plans, and double‑check.

This is like mixing utilitarian (outcomes), deontological (rules), and virtue‑ethics (character) checks into your decision loop.

---

## 4. Reason Explicitly About Knowledge in Planning

Modal logic and planning theory sound fancy, but you can use simple versions in code.

### 4.1 Separate "believes" from "knows"

Internally, distinguish:

| Aspect | believes(P) | knows(P) |
|--------|------------|----------|
| Confidence | Probable | Highly confirmed |
| Stability | May change | Well-supported |
| Usage | Suggest with hedging | Use as trusted premise |
| Evidence | Single source possible | Multiple sources |

Then define policies like:

- If the agent only **believes** X → it can suggest X with proper hedging.
- If the agent **knows** X → it can treat X as a trusted premise for more complex or high‑impact decisions.

### 4.2 Track what the _user_ knows

For user‑facing or multi‑agent systems, track:

- agent_believes(user_knows_P)
- agent_believes(user_does_not_know_P)

Use this to:

- Adjust explanation depth (novice vs expert).
- Avoid skipping crucial background.
- Avoid talking down to users who clearly know the basics.

| User Knowledge Level | Agent Response Style | Example |
|---------------------|---------------------|---------|
| Novice (believes user doesn't know basics) | Full explanations, define terms | "A REST API is a way for programs to communicate..." |
| Intermediate (believes user knows basics) | Skip basics, explain context | "The API endpoint returns JSON with..." |
| Expert (believes user knows domain well) | Technical detail, no fluff | "POST /api/v2/users with OAuth2 bearer token" |

### 4.3 Treat plan checks like mini proofs

Before executing a plan, treat validation like a lightweight proof:

- No step should contradict high‑confidence beliefs.
- No step should break explicit ethical/legal rules.
- Preconditions for each step should be entailed by the current belief base.

If any of these checks fail, revise or discard the plan.

---

## 5. Take Sources and Testimony Seriously

Whenever your agent calls tools or APIs, it’s essentially trusting testimony. Epistemology of testimony has direct design implications.

### 5.1 Model source reliability

For each tool or data source, store:

- A **reliability score**.
- Its **domain of expertise**.

When sources conflict:

- Weigh them by domain fit and reliability.
- Prefer sources that historically matched ground truth in similar contexts.

| Source Attribute | High Reliability | Low Reliability |
|-----------------|------------------|-----------------|
| Historical accuracy | >85% in domain | <50% or unknown |
| Domain expertise | Specialist tool | Generic search |
| Conflict handling | Consistent priority | No rules |
| Transparency | Clear metadata | Black box |

### 5.2 Handle “defeaters” (when evidence undercuts a source)

If new evidence suggests a source is unreliable (bug, outage, bad past answers):

- Downgrade that source’s reliability.
- Invalidate or weaken beliefs that depended on it.
- Use a lightweight dependency graph to efficiently find and revise those beliefs.

### 5.3 Reflect testimonial chains

If a tool aggregates other tools (e.g., web search across many sites), let that show up in the justification:

- “Based on multiple independent sources via WebSearch” is stronger than
- “Based on a single random blog post”

This helps both debugging and user‑facing explanations.

---

## 6. Define Your Core Concepts Clearly

Borrow from **conceptual engineering**: nail down what your key labels actually mean, operationally.

### 6.1 Clarify "task", "goal", "success"

Give working definitions like:

| Concept | Definition | Testability | Example |
|---------|-----------|-------------|---------|
| Task | Minimal executable unit | Pass/fail check | Fetch calendar |
| Goal | Desired end state | Observable condition | Plan stress-free day |
| Success | Verifiable completion | User confirmation | User validated plan |

### 6.2 Make "safety" and "harm" testable

Instead of vague labels:

- Define **safety**, **harm**, **sensitive content** as explicit categories with detectors and rules.
- Tie them to observable signals (e.g., domain, topic, requested action) so they can be evaluated, tested, and iterated on.

| Category | Observable Signal | Detector |
|----------|------------------|----------|
| Health/Safety | Medical topic + action | Domain classifier |
| Financial | Money/investment decision | Keyword + risk level |
| Privacy | PII or sensitive data | Entity recognition |
| Legal | Regulatory keywords | Policy database |

### 6.3 Make concepts revisable

As you refine your understanding (e.g., of what counts as “high‑stakes”):

- Version your schemas and policies.
- Provide migration paths for old logs, stored beliefs, or actions that relied on older definitions.

---

## 7. Debug Failures as Epistemic Bugs

Don’t just patch failures with ad‑hoc rules. Treat them as evidence about the agent’s “theory of mind.”

### 7.1 Classify failures philosophically

Examples:

| Failure Type | Root Cause | Philosophy | Fix |
|-------------|-----------|-----------|-----|
| Misinterpretation | Language/communication | Semantics | Meaning check step |
| Overconfidence | Weak evidence | Epistemology | Calibration + thresholds |
| Side effects | Incomplete model | Ethics | Side-effect estimation |
| Constraint violation | Rule not applied | Deontology | Hard filter in planner |

### 7.2 Add a guardrail per failure type

For each failure class, add a targeted fix:

- Misinterpretation → add a “meaning check” step for ambiguous inputs.
- Overconfidence → tighten calibration and raise evidence thresholds in that domain.
- Side effects → explicitly include side‑effect estimation in planning.

### 7.3 Maintain an "epistemic changelog"

When you change the system, describe it in knowledge/ethics terms, not just code terms. For example:

- "Tightened norm: medical claims must now be supported by at least one high‑reliability tool plus one independent sanity‑check reasoning pass."

Example epistemic changelog entry:

```markdown
## 2026-01-15: Strengthened Evidence Requirements for Financial Advice

**Change**: Raised confidence threshold from 0.6 to 0.8 for financial recommendations

**Reasoning**: After 3 incidents of overconfident suggestions based on single-source data,
we identified an epistemic failure (insufficient evidence gathering before high-stakes advice)

**Impact**: Agent now requires multiple independent sources before suggesting investment actions.
Fallback: if only one source available, explicitly hedge and recommend user consult advisor.

**Norm updated**: Epistemic humility in high-stakes domains
```

This makes it easier to see what _kind_ of agent you're evolving over time.

---

## 8. Let Philosophical Models of Mind Shape Architecture

Different views of the mind suggest different architectures.

### 8.1 BDI: beliefs, desires, intentions

Adopt a **BDI model**:

| Aspect | BDI Model | Simple Reactive |
|--------|----------|----------------|
| Beliefs | Explicit world model | Implicit in state |
| Desires | Explicit goals | Hardcoded behaviors |
| Intentions | Committed plans | Immediate responses |
| Failure mode | Plan reconsideration | Brittle responses |

Lifecycle:

1. Adopt an intention when a goal and a viable plan appear.
2. Stick with it while it remains achievable.
3. Reconsider or drop it when new evidence conflicts.

### 8.2 Bounded rationality: “good enough” over perfect

Accept that the agent is limited in compute and information:

- Use **satisficing**: aim for “good enough given what I know and my budget” instead of theoretical optimality.
- Limit depth of search, number of tool calls, or time per decision, and design policies around those limits.

### 8.3 Enactive/embodied flavor (for tools & robots)

If your agent acts in the world (robots, APIs that change state):

- Treat knowledge as partly built by acting.
- Schedule **exploration actions** to learn more when the world model is too uncertain.
- Implement curiosity‑driven behavior where reducing uncertainty is an explicit sub‑goal.

Example: A robot arm learning object properties through interaction:

```python
# Enactive learning scenario
class RobotArm:
    def learn_object_weight(self, object_id):
        # Initial belief: uncertain
        belief = BeliefStore.get(f"weight_{object_id}")

        if belief.confidence < 0.7:
            # Embodied action: physically interact to learn
            measured_weight = self.lift_and_measure(object_id)

            # Update belief through action
            BeliefStore.update(
                proposition=f"weight_{object_id}",
                value=measured_weight,
                confidence=0.9,
                source="direct_measurement"
            )
```

The agent learns by doing, not just by being told.

---

## 9. A Practical Checklist for Philosophically‑Informed Agents

When designing or reviewing an agent system, you can ask:

1. **Beliefs**
   - What does this agent currently believe?
   - Where are those beliefs stored?
   - How are they updated with new evidence?

2. **Knowledge**
   - When does it treat something as “known” rather than just “believed”?
   - What are the thresholds and validation steps?

3. **Epistemic norms**
   - Does it show humility, charity, coherence, and calibration?
   - Does it seek robustness before acting on high‑stakes beliefs?

4. **Moral framework**
   - Which hard rules constrain its actions?
   - How does it estimate utility and risk?
   - Are there explicit risk caps?

5. **Sources**
   - How does it model reliability of tools and APIs?
   - How does it handle conflicts and update trust?

6. **Belief revision**
   - Can it retract false beliefs?
   - Can it propagate those corrections through its reasoning?

---

## Where to Go Next

If you want to push this further, some natural follow‑ups are:

- **Design patterns:** Concrete architectures and code examples for BeliefStores, justification graphs, and BDI agents. See [Locking down agents](/posts/locking-down-agents) for practical safety patterns.
- **Metrics:** How to measure "epistemic quality" (calibration, robustness, etc.) in live systems.
- **Tool ecosystems:** How to standardize reliability metadata and justification formats across tools. Check out [Introducing casq](/posts/introducing-casq) for tool orchestration ideas.
- **User experience:** How to surface the agent's uncertainty and reasoning in a way that helps users without overwhelming them.
- **Governance:** How to align product decisions with the epistemic and moral frameworks baked into your agents. See [Notes on agentic applications in business processes](/posts/notes-on-agentic-applications-in-business-processes) for production workflow patterns.

Philosophy doesn’t replace engineering here—it gives you a language and a set of constraints that can make your agents more reliable, inspectable, and aligned with human expectations.
