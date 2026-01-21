---
author: Björn Roberg, GPT-5.1
pubDatetime: 2026-01-21T19:00:00Z
modDatetime: 2026-01-21T19:00:00Z
title: Notes on agentic applications in business processes
slug: notes-on-agentic-applications-in-business-processes
featured: true
draft: false
tags:
  - discussion
  - braindump
  - agents
description: This post explores how to pair agentic workflows with durable workflow engines, add structure using finite state machines and simple Markov policies, plug in MCP servers for tools, and grow from a small pilot into stable, production-ready workflows.
---

Position: **durable workflows** pair naturally with **agentic workflows**.

- **Durable workflows** give you: state, retries, timeouts, scheduling, idempotency, and observability across long-running processes.
- **Agentic workflows** give you: adaptive planning, tool use, and context-sensitive reasoning.

Put together, you get:

- Agents that can **pause, resume, and survive failures**, not just respond once.
- A workflow layer that can **reason about goals and tools**, not just run fixed steps.

This post walks through:
- Where this combination is strong.
- How to add structure to agentic systems with **finite state machines (FSMs)**.
- How **Markov-style (probabilistic) policies** might improve agentic systems.
- Practical next steps for pushing these ideas further.

---

## Where Durable + Agentic Workflows Shine

These are business areas where “smart but fragile” agents become “smart and production-safe” once wrapped in durable orchestration.

### High-Fit Business Areas

| Area                           | Agent Does…                                          | Durable Workflow Does…                                        |
|--------------------------------|------------------------------------------------------|---------------------------------------------------------------|
| Customer onboarding & KYC      | Understand docs, ask for missing info, choose checks | Track all steps, retry APIs, enforce SLAs and approvals       |
| Loan / credit underwriting     | Interpret financials, edge cases, draft rationale    | Orchestrate bureaus, risk models, audit logs, notifications   |
| Claims processing              | Read narratives/photos, propose coverage decisions   | Coordinate intake → adjuster → documents → payout             |
| Order-to-cash / quote-to-order | Configure quotes, negotiate constraints              | Route approvals, contract flow, provisioning, invoicing       |
| IT / HR service desks          | Triage, root-cause reasoning, run automated fixes    | Manage SLAs, escalations, multi-team handoffs                 |
| Marketing & sales cadences     | Personalize outreach, adapt per responses            | Handle timing, throttling, channel sequencing, logging        |
| Procurement & vendor mgmt      | Compare bids, summarize contracts                    | Run RFx stages, approvals, onboarding, renewals               |
| Compliance workflows           | Interpret regs, draft policies, review exceptions    | Enforce required steps, evidence retention, sign-offs         |
| Non-diagnostic health admin    | Coordinate benefits Q&A, reminders, education        | Manage multi-visit journeys, pre-auth, scheduling, follow-ups |
| Account management / CS        | Draft QBRs, suggest plays, interpret signals         | Run multi-quarter plans, task orchestration, renewals         |

Pattern: anywhere you have **multi-step, cross-system processes with human nuance**, this pairing is strong.

---

## FSMs: Putting Guardrails Around Agents

A core challenge with agents is that they’re “too free-form.” FSMs are a simple, powerful way to **constrain behavior without killing flexibility**.

### Basic Idea

- **States** = stable “modes” of the interaction.
  Example states: `CollectRequirements`, `Disambiguate`, `Plan`, `ExecuteTools`, `Summarize`, `Escalate`.
- **Transitions** = allowed moves between states, guarded by conditions.
- **Agent role** = act *within* a state; the FSM controls *which state it’s in* and when it can move.

Think of it as:

- Agent = “what to say / which tool to call”.
- FSM = “when are we done collecting info vs. executing vs. summarizing”.

### Toy FSM for an Agentic Workflow

```ts
type State =
  | "CollectRequirements"
  | "Disambiguate"
  | "Plan"
  | "ExecuteTools"
  | "Summarize"
  | "Escalate";

interface Context {
  userInputs: string[];
  plan?: string;
  toolsRun: number;
  errors: string[];
  readyToExecute: boolean;
  done: boolean;
}

function transition(state: State, ctx: Context): State {
  switch (state) {
    case "CollectRequirements":
      return ctx.readyToExecute ? "Plan" : "CollectRequirements";

    case "Plan":
      return ctx.plan ? "ExecuteTools" : "Escalate";

    case "ExecuteTools":
      if (ctx.done) return "Summarize";
      if (ctx.errors.length > 2) return "Escalate";
      return "ExecuteTools";

    case "Summarize":
      return "Summarize";

    case "Disambiguate":
    case "Escalate":
      return state;
  }
}
```

The LLM’s job is to update `Context` (e.g., set `readyToExecute`, fill `plan`, mark `done`). The FSM decides what’s allowed next.

---

## FSMs + MCP Servers: Structured Tool Use

MCP servers provide **tooling backends** (APIs, DB access, services). An FSM can:

- Restrict **which MCP tools** can be used in which states.
- Enforce **required fields** before moving to execution.
- Make “meta-decisions” about when to escalate vs. keep trying tools.

Example:

| State               | Allowed MCP Capabilities                                  | Required Before Transition                                     |
|---------------------|-----------------------------------------------------------|----------------------------------------------------------------|
| CollectRequirements | None (chat only)                                         | Mandatory fields present (`email`, `accountId`, `goal`)       |
| Plan                | Read-only MCP tools (search, knowledge base, schemas)    | Plan text + a list of tool calls with arguments               |
| ExecuteTools        | Full MCP access for this domain                          | Either `done=true` or `maxSteps` reached                      |
| Summarize           | Read-only history + notification tools                   | At least one tool run, or explicit “no-op” explanation        |
| Escalate            | Ticketing / human handoff tools                          | Escalation reason + relevant context bundle                   |

This yields a **more enforceable contract** between your agent and your infrastructure.

---

## Markov Chains: Probabilistic Control over Agent Strategies

FSMs are deterministic; sometimes you want **probabilistic “what tends to work next?”** behavior. That’s where a Markov-style model fits: treat **“what the agent tries next”** as a stochastic policy.

### Framing

- **State** = coarse context features + last action/result
  Example:
  ```text
  (hasUserAnswered, lastToolFamily, errorClass, stepIndex)
  ```
- **Action** = high-level strategy, not token-level output
  Examples: `ask_followup`, `retry_last_tool`, `switch_tool_family`, `escalate`, `short_circuit_success`.
- **Transition probabilities** = “from this state, which action usually works best?”

This is a small Markov Decision Process (MDP) over **agent strategies**.

### Simple Markov Policy Table

Imagine we’re handling tool errors:

| State (simplified)                   | Next Action          | Probability |
|--------------------------------------|----------------------|-------------|
| `(errorClass=timeout, retries=0)`    | `retry_last_tool`    | 0.7         |
|                                      | `switch_tool_family` | 0.2         |
|                                      | `escalate`           | 0.1         |
| `(errorClass=timeout, retries>=2)`   | `switch_tool_family` | 0.6         |
|                                      | `escalate`           | 0.4         |
| `(errorClass=validation, retries=0)` | `ask_followup`       | 0.8         |
|                                      | `escalate`           | 0.2         |

You can learn or hand-tune these numbers based on what historically works.

### Pseudocode for a Markov Policy Wrapper

```ts
type HighLevelAction =
  | "ask_followup"
  | "retry_last_tool"
  | "switch_tool_family"
  | "escalate"
  | "short_circuit_success";

interface MarkovState {
  errorClass: "none" | "timeout" | "validation" | "unknown";
  retries: number;
  stepIndex: number;
}

function sampleNextAction(s: MarkovState): HighLevelAction {
  if (s.errorClass === "timeout" && s.retries === 0) {
    return weightedSample({
      retry_last_tool: 0.7,
      switch_tool_family: 0.2,
      escalate: 0.1,
    });
  }

  if (s.errorClass === "timeout" && s.retries >= 2) {
    return weightedSample({
      switch_tool_family: 0.6,
      escalate: 0.4,
    });
  }

  // …other cases…

  return "escalate";
}
```

The LLM still decides content and tool arguments; the Markov layer decides **which high-level move** to try next.

---

## Combining It All with Durable Workflows

Durable workflows give you **reliability over time**; FSMs/Markov give you **command and control**; agents/MCP give you **semantics and capabilities**.

### Execution Loop Sketch

1. **Load workflow instance**
   - Current FSM/Markov state
   - Context (user inputs, history, plan, tool results)

2. **Decide control step**
   - Use FSM or Markov policy to pick:
     - Next state (if FSM), and/or
     - Next high-level action (strategy).

3. **Invoke agent + MCP tools**
   - Call the LLM with:
     - System prompt describing current state + allowed actions/tools
     - Conversation history and context
   - If needed, call MCP tools the LLM selected.

4. **Update state & persist**
   - Update context from LLM + tool results (e.g., `readyToExecute`, `done`, `errors[]`).
   - Compute next FSM/Markov state.
   - Persist again; schedule next “tick” or finish.

5. **Repeat until terminal state** (`Summarize` or `Escalate`).

Pseudo-workflow tick:

```ts
async function workflowTick(instanceId: string) {
  const { state, context } = await loadInstance(instanceId);

  const nextState = transition(state, context);           // FSM step
  const highLevelAction = sampleNextAction({
    errorClass: context.errors.at(-1)?.class ?? "none",   // Markov step
    retries: context.retries,
    stepIndex: context.stepIndex,
  });

  const llmResult = await callAgent({
    state: nextState,
    action: highLevelAction,
    context,
    allowedTools: toolsForState(nextState),
  });

  const { updatedContext, toolCalls } = await runTools(llmResult, context);

  await saveInstance(instanceId, {
    state: nextState,
    context: updatedContext,
  });

  if (!updatedContext.done && nextState !== "Summarize") {
    await scheduleNextTick(instanceId);
  }
}
```

---

## Practical Ways to Go Further

Here are concrete next steps to turn these ideas into something real and robust.

### 1. Start with a Single, Narrow Use Case

Pick one process that is:

- High-value but not safety-critical.
- Multi-step, cross-system, and currently painful.

Examples:

- IT password reset + device access workflow.
- Customer onboarding for one specific product tier.
- A single insurance claim type (e.g., small auto claims under a threshold).

Implement:

- 4–6 FSM states only.
- A minimal Markov policy for error handling.
- One MCP server with a small tool surface (read + write endpoints).

### 2. Make States and Actions Observable

Log:

- Current FSM state and chosen high-level action.
- All MCP tool calls (inputs, outputs, duration).
- Transitions that lead to escalations or failures.

This makes it easy to:

- Tune FSM transition rules (e.g., add guards when things go wrong).
- Adjust Markov probabilities based on observed success rates.
- Explain behavior to stakeholders.

### 3. Explicitly Define Contracts per State

For each state, write down:

- **Goals:** What must be true when leaving this state?
- **Allowed tools:** Which MCP tools can be called from here?
- **Forbidden behaviors:** What the agent must not do (e.g., “do not send external emails yet”).

This can live as:

- A configuration file, and
- A snippet embedded into the agent’s system prompt for that state.

### 4. Close the Loop with Metrics

Track at least:

- **Completion rate**: How often the workflow finishes without escalation.
- **Mean steps per workflow**: Too many → your FSM is under-constrained or your prompts are unclear.
- **Error / escalation classes**: Group by state and action to see where to add guards or new actions.

Then:

- Refine FSM transitions where failures cluster.
- Update Markov action probabilities to favor what works.
- Add new high-level actions when you see recurring patterns (e.g., a new kind of fallback).

### 5. Gradually Increase Autonomy and Scope

Once the initial flow is stable:

- Add more states for nuance (e.g., separate `Disambiguate` from `CollectRequirements`).
- Expand MCP capabilities per state (more tools, more powerful actions).
- Relax guardrails in some states while tightening them in others.

Always keep:

- **Durable workflow** as your backbone (so long processes never “evaporate”).
- **FSM/Markov** as explicit control logic you can inspect and tune.
- **Agents and MCP** as the flexible, semantic layer operating inside those constraints.
