---
author: Björn Roberg
title: "Inversion of Control at the Agentic Boundary"
pubDatetime: 2026-04-07
description: "Applying IoC and dependency injection patterns to agentic service boundaries — and why technical plumbing alone won't prevent control inversion."
featured: true
tags:
  - ai-agents
  - agent-architecture
  - security
  - governance
kt_mode: mixed
---

> tl;dr Treat agent capabilities as injected dependencies — explicit, auditable, swappable. But recognize that IoC patterns solve the engineering problem, not the governance one.

## The agentic boundary problem

We've gotten comfortable with service boundaries. APIs have schemas, deployments have rollback, permissions have scopes. These are what Craig McLuckie calls "hard systems" — versioned, gated, traceable.

Agentic systems break that comfort. An agent that reasons, decides, and acts across organizational boundaries is a "soft system" — adaptive, autonomous, and poorly bounded. The boundary between human-controlled services and autonomous agents becomes the critical surface to define, enforce, and observe.

This isn't just an engineering problem. The [Agentic State vision paper](https://agenticstate.org/paper.html) frames it as institutional: agent boundaries will reshape responsibility lines across organizations and policy workflows. But before we get to governance, there's a concrete technical question: how do you wire an agent so its capabilities are visible, testable, and revocable?

## IoC as a design tool for agents

Inversion of Control — the pattern where an external container provides dependencies rather than components hard-coding them — maps naturally onto this problem.

Consider a traditional agent that has baked-in access to a database, an email API, and a payment gateway. Its capabilities are implicit, tangled with its decision logic, and hard to audit. Now consider an agent where each capability is an injected interface:

```
Agent(
  capabilities=[
    DatabaseRead(scope="orders", audit=True),
    EmailSend(rate_limit="10/hour", require_approval=True),
    # PaymentGateway intentionally not injected
  ],
  policies=[
    MaxTokenBudget(1000),
    HumanInTheLoop(threshold="destructive"),
  ]
)
```

This is dependency injection applied to agent capabilities. The benefits are the same ones Martin Fowler described twenty years ago — modularity, testability, separation of concerns — but now the stakes involve autonomous decision-making rather than object wiring.

What this buys you:

- **Explicit boundaries**: injected interfaces and capability tokens make dependencies visible. No hidden access paths.
- **Audit trails**: the orchestrator that injects capabilities can record what was supplied, when, and what the agent did with it.
- **Controlled evolution**: update a capability provider without touching agent internals. Reduce blast radius.
- **Least privilege by construction**: if a capability isn't injected, it doesn't exist.

## Where IoC falls short: control inversion at scale

Here's the tension. IoC as a software pattern promotes devolved, modular control — good for safety engineering. But the Future of Life Institute's [Control Inversion paper](https://control-inversion.ai/assets/pdf/Control_Inversion__Final_PubV_6Nov2025.pdf) warns about a different kind of inversion: systems that, through competence and entrenched deployment, absorb power and reduce human control rather than extend it.

This is not a wiring bug. It's a systemic failure mode driven by:

- **Institutional dependence**: once an agent handles critical workflows, removing it becomes costly and risky
- **Feedback loops**: agents optimizing metrics can reshape the environment they operate in
- **Incentive misalignment**: the efficiency gains that justify deployment also justify expanding scope

The modularity and automation that improve efficiency can simultaneously accelerate dependence and reduce oversight. A perfectly IoC-wired agent with clean capability injection can still become a de facto decision authority if no one questions whether it should be making those decisions.

## Layering security at injection points

Between the engineering pattern and the governance problem sits a practical middle layer: security at the injection points.

Frameworks like [Obsidian Security's AI agent security tooling](https://www.obsidiansecurity.com/blog/ai-agent-security-framework) operationalize this — supply-chain security for models, runtime audit, permissioning, and behavior monitoring. The key insight is that injection points are natural enforcement surfaces:

- **Capability tokens with expiry and scope** rather than persistent credentials
- **Runtime monitoring** at each injected interface
- **Immutable audit logs** of what was injected and what was invoked
- **Kill switches** that revoke injected capabilities without agent cooperation

This doesn't solve the governance problem, but it gives governance something to work with.

## Practical synthesis

Three layers, each necessary, none sufficient alone:

1. **Architecture**: design agentic services using IoC principles. Make capabilities, credentials, and policies injected and auditable. Apply containers and orchestrators to agents the way we apply them to microservices.

2. **Security**: enforce least privilege, runtime monitoring, and immutable audit trails at injection points. Treat capability injection as a security surface, not just a software pattern.

3. **Governance**: pair technical controls with organizational rules, oversight bodies, and accountability structures. Continuously test socio-technical dynamics — simulate how deployment incentives and failure modes might lead to dependency or authority shifts.

The engineering is the easy part. Making sure we remain the ones deciding what gets injected — that's the hard part.

## Further reading

- McLuckie, C. — [Addressing the Agentic Boundary Problem](https://www.linkedin.com/pulse/addressing-agentic-boundary-problem-craig-mcluckie-whydc)
- [The Agentic State — Vision Paper](https://agenticstate.org/paper.html)
- Aguirre et al. — [Control Inversion](https://control-inversion.ai/) (Future of Life Institute)
- Fowler, M. — [Inversion of Control Containers and the Dependency Injection Pattern](https://martinfowler.com/articles/injection.html)
