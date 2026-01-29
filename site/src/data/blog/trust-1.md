---
author: Björn Roberg, GPT-5.1
pubDatetime: 2026-01-29T13:00:00Z
modDatetime: 2026-01-29T13:00:00Z
title: Cloud LLMs in prod...
slug: cloud-llms-in-prod
featured: true
draft: false
tags:
  - discussion
  - braindump
  - agents
description: Modern infra teams are quietly feeding their most sensitive data—logs, configs, schemas—into cloud LLMs just to get unstuck. It feels like harmless troubleshooting, but in reality it extends your trust boundary into a black box you don’t control or fully understand.
---

There’s a quiet, slightly uncomfortable truth sitting behind all the hype about using AI to run infrastructure: a lot of us are pasting the keys to the kingdom into a web form and hoping for the best.

Hypothetically,

You’ve got a flaky replica lagging behind primary, weird autovacuum behavior, and a migration that’s blowing up on some obscure constraint. You’re tired, the incident channel is noisy, and that shiny LLM tab is right there. So you paste in:

- Your `postgresql.conf` and `pg_hba.conf`
- A chunk of logs from the primary and the replica
- The migration SQL, plus some schema definitions
- Maybe even a bit of Terraform or Kubernetes YAML for context

You ask: “What’s going on here, and how do I fix it?”

From a productivity perspective, that’s great. From a data‑security and trust‑boundary perspective, it’s kind of a nightmare.

Because what you just did, in practice, is:

- Disclosed internal hostnames, IP ranges, and network layout
- Leaked account names, roles, maybe connection strings
- Shared real table and column names that reflect business logic
- Potentially surfaced bits of production data or identifiers in logs

And you didn’t just share it with “an AI.” You shared it with a specific, third‑party system you don’t control, running in regions you didn’t pick, under policies you probably haven’t fully read.

The cloud LLM has now become part of your attack surface, and more importantly, part of your data flow. But most orgs still treat it like a casual Q&A site.

---

The first big issue is how deceptively rich infra data is.

Infra folks sometimes talk like, “It’s just logs and configs, not customer data,” but that’s wishful thinking. Postgres logs often contain:

- Full or partial SQL statements, with literal values still present
- Application user IDs, tenant IDs, or business identifiers
- File paths, OS usernames, and error traces that expose system layout

Config files can reveal:

- Trusted IP ranges, VPN subnets, internal DNS patterns
- Authentication methods (`trust`, `md5`, `scram-sha-256`, etc.)
- Which services talk to which, and where the choke points are

Schemas and migrations expose:

- How money flows (e.g., `invoices`, `payments`, `transactions`)
- Regulatory domains (e.g., `claims`, `patients`, `cases`)
- Critical tables that an attacker would love to target

All of this is enormously useful context for an LLM trying to help you debug. It’s also exactly the kind of context you don’t want to spray outside your trust boundary.

---

Then there’s the question of where that data actually goes.

With a cloud LLM, your prompts and responses move through:

- Frontend and gateway layers
- Application servers
- Logging and observability systems
- Model‑serving infrastructure
- Sometimes multiple regions or providers behind the scenes

Even if the vendor’s marketing line is “we don’t train on your data,” that doesn’t mean:

- “We don’t retain it at all”
- “No human will ever see it”
- “It never leaves jurisdiction X”
- “It’s fully isolated from other tenants”

A lot of services keep data for some period for abuse detection, performance tuning, or debugging. Internally, a subset of staff can access logs under certain conditions. That can be totally reasonable from their point of view—and totally incompatible with your mental model of “I just asked a bot about a Postgres error.”

Regulated orgs run into this immediately. Once logs, configs, or schema containing sensitive information are sent to an external LLM, that LLM provider may count as a data processor. That implies:

- Data processing agreements
- Vendor risk assessments
- Cross‑border transfer considerations
- Documentation for audits and regulators

Most teams are nowhere near that level of formality for their AI usage. It’s just “open the website and paste.”

---

There’s also the legal and jurisdictional ambiguity.

Your production logs and schemas are not just random text. They can contain:

- Trade secrets (system design, pricing logic, anti‑fraud heuristics)
- Personal data (in queries, error messages, raw log lines)
- Security‑sensitive details (firewall rules, hostnames, CIDRs)

Once that data hits another company’s infrastructure in another country, it becomes subject to their legal environment. In the worst case, it can be accessed under legal process you have no visibility into, in a jurisdiction you don’t operate in, involving people who don’t even know your company exists.

That doesn’t mean it will happen. It means it can, and you’ve effectively opted into that risk with a single paste action.

---

On top of that, using cloud LLMs for infra creates a blind spot in your own security model.

We spend time carefully designing network segments, IAM policies, audit logging, and access reviews. We lock down who can see Postgres credentials, who can read production logs, which bastion hosts can reach which subnets.

And then an engineer:

- Opens a browser from a laptop with split‑tunnel VPN
- Sends production logs and configs to a third‑party LLM
- Gets an answer, pastes the fix into prod, and moves on

No entry in your asset inventory says “Cloud LLM X now has a partial copy of our infra topology and logs.” No runbook says “When we rotate secrets, we should consider what was ever pasted into external tools.” It’s invisible to your normal risk management processes.

That’s the real predicament: we’ve made an external system a participant in our most sensitive operational workflows, but we’re treating it like a harmless search engine.

---

None of this is an argument against using AI to manage infra. It’s an argument against pretending that sending live Postgres configs and production logs to a cloud LLM is some trivial, low‑risk operation.

If you care about your trust boundary—where your data lives, who can see it, which laws apply to it—then that browser tab is part of your security architecture whether you admit it or not.
