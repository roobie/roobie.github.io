---
author: Björn Roberg, Claude
pubDatetime: 2026-02-11T04:00:00Z
modDatetime: 2026-02-11T04:00:00Z
title: Currying agents
slug: currying-agents
featured: true
draft: false
tags:
  - tool
  - computing
  - agents
description: How one can leverage partial application of agents - borrowing from the functional programming paradigm.
---

**Currying in LLM agents means breaking down a complex agent task into a chain of smaller, specialized functions where each step takes some inputs and returns a new function waiting for the next piece of information.**

---

## Core Concept Translation

In functional programming, currying transforms a function that takes multiple arguments `f(a, b, c)` into a sequence of functions `f(a)(b)(c)`. Each function takes one argument and returns another function until all arguments are provided.

For LLM agents, this translates to **progressive context building** where:
- Each "curried" agent takes partial information
- Returns a more specialized agent with that context locked in
- The final agent executes with all accumulated context

---

## Practical Applications

### Sequential Context Refinement

Instead of passing everything to one monolithic agent, you create a pipeline:

**Traditional approach:**
```
agent(user_query, user_profile, conversation_history, tools, constraints)
```

**Curried approach:**
```
base_agent → with_user_profile(profile) → with_history(history) → with_query(query)
```

Each step returns a **more specialized agent** that "remembers" the previous context. This mirrors how `add(x)(y)` in currying remembers `x` when waiting for `y`.

### Tool Binding and Specialization

You can partially apply tools to create domain-specific agents:

```
research_agent = base_agent
  .with_tools([web_search, arxiv_search])
  .with_system_prompt("You are a research assistant")
  .with_constraints(max_tokens=2000)

# Later, just provide the query
result = research_agent.execute(query="latest in quantum computing")
```

The **intermediate agents are reusable** — you've "curried in" the configuration and can apply different queries without reconfiguring.

### Multi-Stage Reasoning Chains

Break complex reasoning into stages where each stage is a partially applied function:

1. **Query understanding agent** → Takes raw input, returns structured intent
2. **Planning agent(intent)** → Takes intent, returns execution plan  
3. **Execution agent(plan)** → Takes plan, returns results
4. **Synthesis agent(results)** → Takes results, returns final answer

Each agent is **partially applied with domain knowledge** before receiving the dynamic input from the previous stage.

---

## Technical Implementation Patterns

### Closure-Based Context Accumulation

```python
class CurriedAgent:
    def __init__(self, base_llm, context=None):
        self.llm = base_llm
        self.context = context or {}
    
    def with_system_prompt(self, prompt):
        new_context = {**self.context, 'system': prompt}
        return CurriedAgent(self.llm, new_context)
    
    def with_tools(self, tools):
        new_context = {**self.context, 'tools': tools}
        return CurriedAgent(self.llm, new_context)
    
    def execute(self, user_input):
        # All accumulated context is now available
        return self.llm.call({**self.context, 'input': user_input})
```

### Dependency Injection Through Currying

Rather than passing dependencies at execution time, **inject them progressively**:

```python
# Configure once
customer_support = (agent
    .with_knowledge_base(kb)
    .with_escalation_rules(rules)
    .with_tone("professional, empathetic"))

# Use many times with different queries
response1 = customer_support.handle(ticket_1)
response2 = customer_support.handle(ticket_2)
```

### Prompt Template Composition

Each currying step can **layer prompt templates**:

```python
agent
  .with_role("senior software architect")
  .with_constraints("respond in under 500 words")
  .with_format("use markdown with code blocks")
  .with_context(codebase_summary)
  .answer(technical_question)
```

Each `with_*` method returns a new agent with an **augmented prompt template**, avoiding massive monolithic prompts.

---

## Benefits for LLM Systems

**Reusability**: Configure once, apply many times with different final inputs

**Composability**: Mix and match partial configurations to create agent variants

**Testability**: Test each currying stage independently with mock inputs

**Lazy evaluation**: Don't call the LLM until all context is gathered (saves tokens and latency)

**Type safety**: Each intermediate function can validate its specific input before proceeding

**Separation of concerns**: Configuration logic lives separately from execution logic

---

## Advanced Pattern: Agentic Workflows as Curried Pipelines

Think of **ReAct or chain-of-thought agents** as curried functions:

```python
# Each observation partially applies to the next thought
thought_1 = agent.think(task)
action_1 = agent.act(thought_1)
observation_1 = environment.observe(action_1)

# Observation "curries" into the next reasoning step
thought_2 = agent.think(task, observation_1)
action_2 = agent.act(thought_2)
observation_2 = environment.observe(action_2)
```

Each cycle **partially applies new information**, building toward the final answer. The agent at step N is essentially `agent(task)(obs_1)(obs_2)...(obs_N)`.

---

## When to Apply This Pattern

Use currying for LLM agents when:
- You have **reusable configurations** across multiple queries
- Your agent needs **progressive context building** (multi-turn, multi-stage)
- You want **clear separation** between static setup and dynamic execution
- You're building **agent factories** that produce specialized variants
- You need **middleware-like behavior** (logging, validation, rate limiting at each stage)

Avoid when:
- Your agent is truly one-shot with no reusable components
- The overhead of function wrapping exceeds the benefit of modularity
- Your framework already provides better composition primitives

The key insight: **LLM agents are functions from context to output, and currying lets you build that context incrementally rather than all at once.**
