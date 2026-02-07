---
author: Björn Roberg, GPT-5.1
pubDatetime: 2026-01-21T19:00:00Z
modDatetime: 2026-02-07T22:45:00Z
title: Notes on agentic applications in business processes
slug: notes-on-agentic-applications-in-business-processes
featured: true
draft: false
tags:
  - discussion
  - braindump
  - agents
description: This post explores how to pair agentic workflows with durable workflow engines (specifically Temporal), add structure using finite state machines, plug in MCP servers for tools, and grow from a small pilot into stable, production-ready workflows.
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
- How to implement this in **Temporal**, the leading durable workflow engine.
- Practical next steps for pushing these ideas further.

---

## Where Durable + Agentic Workflows Shine

These are business areas where "smart but fragile" agents become "smart and production-safe" once wrapped in durable orchestration.

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

A core challenge with agents is that they're "too free-form." FSMs are a simple, powerful way to **constrain behavior without killing flexibility**.

### Basic Idea

- **States** = stable "modes" of the interaction.
  Example states: `CollectRequirements`, `Disambiguate`, `Plan`, `ExecuteTools`, `Summarize`, `Escalate`.
- **Transitions** = allowed moves between states, guarded by conditions.
- **Agent role** = act *within* a state; the FSM controls *which state it's in* and when it can move.

Think of it as:

- Agent = "what to say / which tool to call".
- FSM = "when are we done collecting info vs. executing vs. summarizing".

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

The LLM's job is to update `Context` (e.g., set `readyToExecute`, fill `plan`, mark `done`). The FSM decides what's allowed next.

---

## FSMs + MCP Servers: Structured Tool Use

MCP servers provide **tooling backends** (APIs, DB access, services). An FSM can:

- Restrict **which MCP tools** can be used in which states.
- Enforce **required fields** before moving to execution.
- Make "meta-decisions" about when to escalate vs. keep trying tools.

Example:

| State               | Allowed MCP Capabilities                                  | Required Before Transition                                     |
|---------------------|-----------------------------------------------------------|----------------------------------------------------------------|
| CollectRequirements | None (chat only)                                         | Mandatory fields present (`email`, `accountId`, `goal`)       |
| Plan                | Read-only MCP tools (search, knowledge base, schemas)    | Plan text + a list of tool calls with arguments               |
| ExecuteTools        | Full MCP access for this domain                          | Either `done=true` or `maxSteps` reached                      |
| Summarize           | Read-only history + notification tools                   | At least one tool run, or explicit "no-op" explanation        |
| Escalate            | Ticketing / human handoff tools                          | Escalation reason + relevant context bundle                   |

This yields a **more enforceable contract** between your agent and your infrastructure.

---

## Implementing This in Production Workflows

The architecture above is engine-agnostic, but real implementations vary. Here's how the pieces map onto **Temporal**, the most popular durable workflow engine for agentic systems.

### Temporal Fundamentals

Temporal provides:
- **Workflows**: Long-lived, deterministic orchestration logic (survives failures, retries)
- **Activities**: Individual tasks that can fail, retry, timeout independently
- **Signals**: External inputs to running workflows (user messages, escalations, etc.)
- **Durability**: Complete execution history, automatic state recovery

### Mapping the Architecture to Temporal

**Workflow = FSM + Orchestration**

Your FSM transitions and context live inside a Temporal Workflow. The workflow handles durability; the FSM handles *where the agent should be* at each step.

```typescript
// Your agentic workflow in Temporal
async function agenticWorkflow(input: WorkflowInput): Promise<WorkflowResult> {
  // Initialize FSM state and context
  let state: WorkflowState = "CollectRequirements";
  let context: Context = {
    userInputs: [],
    plan: null,
    toolsRun: 0,
    errors: [],
    readyToExecute: false,
    done: false,
  };

  // Main loop: keep going until done
  while (!context.done && state !== "Escalate" && state !== "Summarize") {
    // FSM transition
    const nextState = transition(state, context);

    // Call agent as an activity (this is where LLM invocation happens)
    const agentResult = await activities.invokeAgent({
      state: nextState,
      context,
      allowedTools: toolsForState(nextState),
      systemPrompt: promptForState(nextState),
    });

    // Validate tool calls against allowed tools for this state
    for (const toolCall of agentResult.toolCalls || []) {
      const allowed = toolsForState(nextState);
      if (!allowed.includes(toolCall.name)) {
        // Constraint violation: log and escalate if repeated
        context.errors.push(
          `Tool ${toolCall.name} not allowed in state ${nextState}`
        );
        if (context.errors.length > 2) {
          state = "Escalate";
          break;
        }
        continue;
      }
    }

    // Run tools (as activity, so failures are retried)
    if (agentResult.toolCalls && agentResult.toolCalls.length > 0) {
      try {
        const toolResults = await activities.runTools({
          toolCalls: agentResult.toolCalls,
          mimeType: "application/json",
        });

        context.toolsRun += toolResults.length;
        context.errors = [];  // Reset errors on success
      } catch (error) {
        context.errors.push(error.message);
        // Decision: retry in same state, or escalate?
        if (context.errors.length > 2) {
          state = "Escalate";
          break;
        }
      }
    }

    // Update context from agent result
    context = {
      ...context,
      userInputs: [...context.userInputs, agentResult.reasoning],
      plan: agentResult.plan || context.plan,
      readyToExecute: agentResult.readyToExecute ?? context.readyToExecute,
      done: agentResult.done ?? context.done,
    };

    // Transition to next state
    state = nextState;

    // Guard: prevent infinite loops
    if (context.toolsRun > 50) {
      state = "Escalate";
    }
  }

  // Final step based on terminal state
  if (state === "Summarize") {
    const summary = await activities.invokeAgent({
      state: "Summarize",
      context,
      allowedTools: ["notificationTools"],
      systemPrompt: promptForState("Summarize"),
    });
    return { status: "completed", context, summary };
  } else if (state === "Escalate") {
    const escalation = await activities.escalate({
      context,
      reason: context.errors.at(-1) || "max steps reached",
    });
    return { status: "escalated", context, escalationId: escalation.id };
  }

  return { status: "unknown", context };
}
```

**Activities = Tool Execution + Retries**

Each external action is an activity. Temporal automatically retries on failure:

```typescript
// Activity: invoke the LLM
const invokeAgent = async (input: {
  state: WorkflowState;
  context: Context;
  allowedTools: string[];
  systemPrompt: string;
}): Promise<AgentResult> => {
  const client = new Anthropic();

  // Build tool descriptions from allowed list
  const toolDefs = buildToolDefinitions(input.allowedTools);

  const response = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2000,
    system: input.systemPrompt,
    tools: toolDefs,
    messages: [
      {
        role: "user",
        content: formatContextForAgent(input.state, input.context),
      },
    ],
  });

  return parseAgentResponse(response);
};

// Activity: run tool calls (with retries per tool)
const runTools = async (input: {
  toolCalls: ToolCall[];
  mimeType: string;
}): Promise<ToolResult[]> => {
  const results: ToolResult[] = [];

  for (const call of input.toolCalls) {
    // Each tool call gets its own retry policy in Temporal UI
    const result = await executeTool(call.name, call.input);
    results.push({
      toolName: call.name,
      success: !result.error,
      output: result.error ? null : result.output,
      error: result.error?.message || null,
      duration: result.duration,
    });
  }

  return results;
};

// Activity: escalate to human
const escalate = async (input: {
  context: Context;
  reason: string;
}): Promise<{ id: string }> => {
  const ticket = await createTicket({
    type: "agentic_escalation",
    reason: input.reason,
    contextSnapshot: input.context,
    timestamp: new Date(),
  });

  // Optionally notify a human
  await notifyEscalation(ticket.id);

  return { id: ticket.id };
};
```

### Observability & Debugging with Temporal

Temporal's built-in observability is excellent:

1. **Workflow History**: Every state transition, activity call, and result is logged
   - View in Temporal UI: state machine flows, inputs, outputs
   - Query: "show me all workflows that hit Escalate in CollectRequirements"

2. **Activity Retries**: Temporal tracks each retry
   - See which activities fail repeatedly
   - Tune retry policies per activity/state

3. **Metrics**: Native support for Prometheus, Datadog, etc.
   - Workflow duration per state
   - Tool success rates
   - Error rates by type

4. **Debugging**: Replay failed workflows
   - Re-run from any point without side effects
   - Test fixes before pushing to production

### Example Temporal Configuration

```typescript
// Register workflow and activities
const client = new WorkflowClient();
const worker = await Worker.create({
  workflowsPath: require.resolve("./workflows"),
  activitiesPath: require.resolve("./activities"),
  connection,
  taskQueue: "agentic-workflows",
});

await worker.run();

// Start a workflow instance
async function startAgenticWorkflow(userId: string, goal: string) {
  const result = await client.workflow.execute(agenticWorkflow, {
    args: [{ userId, goal }],
    taskQueue: "agentic-workflows",
    workflowId: `agentic-${userId}-${Date.now()}`,
    // Retry policy: if entire workflow fails, retry for 24 hours
    retry: {
      initialInterval: "1m",
      maximumInterval: "10m",
      maximumAttempts: 100,  // 24h worth of retries
    },
  });

  return result;
}

// Query a running workflow
async function getWorkflowStatus(workflowId: string) {
  const workflow = client.getWorkflowHandle(workflowId);
  const state = await workflow.query(getState);  // Custom query
  return state;  // { state: "ExecuteTools", context: {...} }
}

// Send a signal (e.g., user message)
async function sendUserMessage(workflowId: string, message: string) {
  const workflow = client.getWorkflowHandle(workflowId);
  await workflow.signal(handleUserInput, { message });
}
```

### When Temporal Shines

✓ **Multi-step orchestration** across days/weeks (onboarding, claims, KYC)
✓ **Guaranteed durability** (crash-safe, audit trail)
✓ **Observability** (UI shows FSM state, tool calls, retries)
✓ **Coordination** (signals, timeouts, escalations built-in)
✓ **At-scale** (1000s of concurrent workflows)

✗ **Low-latency** (workflow min ~100ms per step)
✗ **Simple synchronous** calls (overkill for single-step tasks)

### Alternative: Step Functions (AWS) or DIY

If you're AWS-first, Step Functions gives you similar FSM + durability but with a visual JSON definition. If you want total control, a simple queue + worker pattern with persistent state works too, though you'll re-implement retry logic.

For most LLM-powered workflows at scale, **Temporal is the sweet spot**: battle-tested, observable, and specifically designed for exactly this pattern.

---

## Combining It All with Durable Workflows

Durable workflows give you **reliability over time**; FSMs give you **command and control**; agents/MCP give you **semantics and capabilities**.

### Execution Loop Sketch

1. **Load workflow instance**
   - Current FSM state
   - Context (user inputs, history, plan, tool results)

2. **Decide next state**
   - Use FSM transition rules to pick:
     - Next state (and allowed tools for that state)

3. **Invoke agent + MCP tools**
   - Call the LLM with:
     - System prompt describing current state + allowed actions/tools
     - Conversation history and context
   - If needed, call MCP tools the LLM selected.

4. **Update state & persist**
   - Update context from LLM + tool results (e.g., `readyToExecute`, `done`, `errors[]`).
   - Compute next FSM state.
   - Persist again; schedule next "tick" or finish.

5. **Repeat until terminal state** (`Summarize` or `Escalate`).

Pseudo-workflow tick (durable workflow engine handles retries, timeouts, recovery):

```ts
async function workflowTick(instanceId: string) {
  const { state, context } = await loadInstance(instanceId);

  const nextState = transition(state, context);           // FSM step

  const llmResult = await callAgent({
    state: nextState,
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

- 4-6 FSM states only.
- One MCP server with a small tool surface (read + write endpoints).
- Deploy on Temporal (local development, then Temporal Cloud).

### 2. Make States and Actions Observable

Log:

- Current FSM state and inputs to the agent.
- All MCP tool calls (inputs, outputs, duration).
- Transitions that lead to escalations or failures.

This makes it easy to:

- Tune FSM transition rules (e.g., add guards when things go wrong).
- Spot error patterns and refine state logic.
- Explain behavior to stakeholders (Temporal UI does this visually).

### 3. Explicitly Define Contracts per State

For each state, write down:

- **Goals:** What must be true when leaving this state?
- **Allowed tools:** Which MCP tools can be called from here?
- **Forbidden behaviors:** What the agent must not do (e.g., "do not send external emails yet").

This can live as:

- A configuration file, and
- A snippet embedded into the agent's system prompt for that state.

### 4. Close the Loop with Metrics

Track at least:

- **Completion rate**: How often the workflow finishes without escalation.
- **Mean steps per workflow**: Too many → your FSM is under-constrained or your prompts are unclear.
- **Error / escalation classes**: Group by state and action to see where to add guards or new states.

Then:

- Refine FSM transitions where failures cluster.
- Improve prompts and tool design based on observed errors.
- Add new states when you see recurring patterns requiring new decision points.

### 5. Gradually Increase Autonomy and Scope

Once the initial flow is stable:

- Add more states for nuance (e.g., separate `Disambiguate` from `CollectRequirements`).
- Expand MCP capabilities per state (more tools, more powerful actions).
- Relax guardrails in some states while tightening them in others.

Always keep:

- **Durable workflow (Temporal)** as your backbone (so long processes never "evaporate").
- **FSM** as explicit control logic you can inspect and tune.
- **Agents and MCP** as the flexible, semantic layer operating inside those constraints.
