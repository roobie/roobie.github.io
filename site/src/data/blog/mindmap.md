---
author: Björn Roberg, GPT-5.1
pubDatetime: 2026-02-02T13:00:00Z
modDatetime: 2026-02-02T13:00:00Z
title: Context, context, context
slug: context-context-context
featured: true
draft: false
tags:
  - discussion
  - braindump
  - agents
  - context
description: Context—or how I learned to love the MINDMAP
---

LLM-based agents come preloaded with an enormous library of patterns. For small, self-contained programming tasks, that’s more than enough: ask almost any general-purpose model **“Implement bubble sort in [your language of choice]”** and it will do it instantly, often with comments and tests thrown in.

But as your project grows, decisions accumulate, regressions appear, and it becomes much harder for an LLM to safely add or change code, because it no longer has a clear view of past decisions, hidden constraints, and the subtle coupling between different parts of the codebase.

That’s why the core challenge isn’t **“can the model write code?”** but **“can the model understand and manage the project’s context well enough to make the right change?”**

The concept of the MINDMAP is to **externalize that context** into a lightweight, line-oriented graph that any agent can quickly reconstruct: a living index of components, workflows, decisions, bugs, and TODOs that turns a sprawling codebase into something a model can reliably navigate and update.

---

If you want agents to reliably work in a real codebase, the knowledge system they use has to obey some strict constraints.

It must be **cheap to read** (so an agent can scan it within a prompt or two) and **cheap to update** (so every change to the code can be mirrored without friction). It has to be **diff- and VCS-friendly**, changing in small, line-oriented chunks so humans and tools can review it like normal code. It should be **grep-able before it’s tool-able**: simple CLI commands like `grep` and basic regex must be enough to navigate it, without requiring a bespoke indexer. And it should be **native to how LLMs already reason**—using citation-style references, stable IDs, and short, self-contained entries—so models can follow links and reconstruct the relevant slice of project context on demand.

---

The mind map format is a way to **encode a graph inside a flat text file**.

Each line is a “node” with a stable numeric ID, a short, strongly-typed title, and a compact description that can reference other nodes by ID. The syntax is intentionally simple:

```markdown
[N] **Title** - content with [N] references
```

On top of that, you layer semantic prefixes—`AE` for architecture elements, `WF` for workflows, `DR` for decisions, `BUG` for bug records, `TODO` for planned work, `META` for documentation about the system itself.

Because every node is exactly one line, you get **atomic edits, tiny diffs, and trivial grep-based navigation**. And because the format is self-describing (“homoiconic”), the instructions for how to use the mind map are themselves expressed as nodes in the same style, so both humans and agents learn the structure just by reading the top of the file.

Although nodes must be exactly one line, they may, of course, also reference e.g. `.md` files or other documentation for more detailed descriptions that can have any format.

---

The mind map only works if agents follow a simple, strict **“prime directive”** for how to use it.

Before doing anything else, an agent:

1. Reads the **meta nodes** ([1–9]) to learn the format.  
2. Reads the **overview nodes** ([10–14]) to understand the project’s purpose, stack, entry points, architecture, and key decisions.  

From there, navigation is **grep-first**: search for task-related keywords, jump to matching nodes, and follow `[N]` references deeper as needed.

Crucially, the mind map is treated as an **index, not the source of truth**—the code always wins—but every meaningful change in the code should be echoed back into the relevant nodes. That feedback loop (**read → act → update**) is what turns the file from a static document into a shared working memory that stays aligned with reality.

---

As soon as you move beyond a small project, you have to think about how the mind map **scales**.

Nodes have a lifecycle: they’re created when a concept or decision shows up in multiple places, updated as the implementation evolves, and eventually **deprecated** in favor of newer patterns while keeping a redirect for history and backlinks.

Granularity matters: each node should answer **one clear question** (“What does X do?” “How does Y work?”) rather than becoming a mini-wiki page.

Once a file approaches, say, **50–100 nodes**, you start to split by domain into sub-mindmaps like `MINDMAP.auth.md` or `MINDMAP.payments.md`, each with its own meta and overview nodes.

To keep the whole system from decaying, you run light-weight cleanup passes: resolve nodes marked for verification, consolidate overlaps, and **prune or re-link orphans**. The goal isn’t exhaustive documentation, but a **thin, well-maintained layer of structure** that scales with the codebase without becoming its own maintenance burden.

---

To be useful, the mind map has to stay **tightly bound to the actual code**—the map is an index, but the territory is always the source of truth.

You make that binding explicit with **“FileMap” nodes** that map directories and key files to architecture elements and workflows, so an agent starting from `src/auth/service.ts` can immediately jump to the relevant `AE: AuthService` or `WF: Login Flow` entries.

When code is refactored or renamed, those nodes are updated or marked as deprecated with a redirect to the new node, preserving history and backlinks instead of breaking them. Bug records and decision records live alongside components and workflows, capturing root causes, fixes, and trade-offs in the same graph, so agents don’t have to rediscover why something was done a certain way.

This tight, **bidirectional link between code and mind map** is what keeps the system from drifting into fantasy documentation and lets agents trust it as a reliable index into the real system.

---

Most of the value of the mind map shows up in **concrete agent workflows**.

Each run starts with a small **“startup recipe”**: an agent reads the meta and overview nodes, then runs something like:

- `grep -ni "login" MINDMAP*.md`, or  
- `grep -ni "rate limit" MINDMAP*.md`

to jump straight to relevant entries such as `WF: User Login Flow` or `AE: AuthService`.

From there, patterns repeat:

- **Implementing a feature**—say, adding rate limiting to login—means: read `WF: User Login Flow` to see the current path, inspect `DR: Use JWT For Session Auth` to understand constraints, change `src/auth/login.ts` and related files, then update `WF: User Login Flow` and perhaps create `AE: LoginRateLimiter` plus a `DR: Rate Limiting Strategy` node.

- **Debugging a production issue** might start from logs that mention `payments` and lead the agent, via `grep -ni "payments"`, to `AE: PaymentProcessor` and an existing `BUG: Duplicate Charge On Retry` node; after finding the root cause in `src/payments/retry.ts`, the agent updates that BUG node with the fix and links it to the relevant AE/WF entries.

- **Hand-offs** follow a similar pattern: before exiting, the agent appends to a `WF: Log Add Rate Limiting` node with a timestamped bullet (“investigated X, blocked on Y”) and creates or updates a `TODO: Finish Login Rate Limiting Rollout` node pointing to the exact files and mind-map nodes the next agent should pick up from.

These small, repeatable recipes turn the mind map from **passive documentation into an operational playbook** that structures how agents read, modify, and remember the system.

---

The mind map format is deliberately tuned to how **LLMs already reason**.

Models are trained on text full of citation-style references like `[1]`, `[2]`, so using `[N]` to denote node links makes following the graph feel “native” to them.

Because each node is a **single, compact line**, an agent can pull dozens or hundreds of nodes into a prompt without blowing the context window, and line-oriented updates mean the model can surgically rewrite just node `[42]` instead of reflowing an entire document.

The structure is simple enough to be navigated with plain regex and `grep`, which also makes it easy to build thin tools that, for example, compute **reverse-reference graphs** (“who points to node 12?”) and feed those into the model as needed.

Compared to a wiki full of long-form pages or scattered ADRs in a `docs/` folder, the mind map presents a **dense, uniform, well-linked surface** that aligns with the model’s strengths: reading short chunks, following explicit references, and composing a task-specific view of the project on demand.

---

To make this concrete, you can standardize on a small set of templates and drop them into any repo as `MINDMAP.core.md`.

At the top, you keep the **meta nodes** ([1–9]) that define the format, node types, update protocol, and scaling rules—these are effectively the **“API docs” for your project memory**.

Next come the **overview nodes** ([10–14]) for project purpose, tech stack, entry points, architecture, and key decisions, which give any agent (or human) a **60-second orientation**.

Below that, you define example patterns for each node type, like:

- `AE: AuthService` describing `src/auth/service.ts`  
- `WF: User Signup Flow` describing the end-to-end path  
- `DR: Use JWT For Session Auth` capturing a major trade-off  
- `BUG: Duplicate Payment On Retry` tying a production incident to its fix  
- `TODO: Add Rate Limiting To Login API` for upcoming work  

Finally, you can add a tiny **“schema contract”** node that specifies the one-line regex for nodes and the rule that IDs are stable once created; this makes it trivial to build scripts that validate the file, generate backlinks, or surface relevant nodes into an LLM prompt.

Together, these pieces give you a **ready-made starter kit** for turning any codebase into something agents can navigate as a graph rather than a pile of files.

---

No matter how elegant the format, the mind map can still fail in very human ways.

The biggest risk is **staleness**: outdated nodes that confidently describe a world the code has already left behind. Because the structure feels authoritative, stale entries can actively mislead agents into reintroducing bugs or undoing intentional changes.

**Over-documentation** is another failure mode—if every tiny detail gets a node, the file turns into noise, and no one (human or agent) wants to maintain it. That’s why **pruning** is as important as adding: you periodically hunt for orphaned or low-signal nodes, merge or delete them, and tighten the map back down to the concepts and workflows that truly matter.

There are also times when you should *not* add a node at all—for example, one-off experiments, throwaway scripts, or trivial refactors that don’t change behavior.

Ultimately, the limiting factor isn’t the format, it’s the **habit**: agents and humans need to consistently follow the read–act–update loop, prune aggressively, and treat the mind map as a **living index** rather than a one-time documentation sprint.

---

Looking ahead, the real payoff of this pattern shows up when you move from a single helper agent to a **small ecosystem of humans and agents** collaborating through the same mind map.

A human might sketch a new architecture decision as a `DR` node, a planning agent explodes that into `TODO` nodes across services, and specialized implementer agents pick those up to modify code and update `AE`/`WF` entries. A reliability agent can periodically sweep `BUG` nodes to look for recurring patterns, while a documentation agent turns stable clusters of nodes into higher-level guides.

Because all of them read and write the same line-oriented graph, you effectively get a **shared “project brain”** that outlives any individual contributor or model version.

There are open questions—how to enforce conventions across teams, how to version mind maps alongside major refactors, how to coordinate multiple agents editing the same file—but the direction is clear: instead of each agent improvising its own ad hoc context, they converge on a **common, explicit, machine- and human-friendly memory structure**.

---

The core argument is simple: LLMs don’t struggle to write code, they struggle to understand the **shifting context around that code**—past decisions, hidden constraints, and the web of dependencies that make a change “safe” or dangerous.

The mind map pattern tackles that directly by turning your project’s context into a **compact, line-oriented graph** that agents can read, navigate, and update on every run.

Instead of betting on ever-bigger context windows or ever-smarter black-box tools, you adopt a boring, text-first convention: a single file (and eventually a small family of files) that index components, workflows, decisions, bugs, and TODOs with **stable IDs and explicit links**. That file becomes the project’s **long-term memory**, shared by humans and agents alike.

To get started, you don’t need new infrastructure—just add a `MINDMAP.core.md` to an existing repo, seed the meta and overview nodes, and begin routing a few real tasks through it. Watch for where it goes stale, where it feels too heavy, where you skip updates, and tighten the rules accordingly.

If the hypothesis is right, you’ll find that the limiting factor on agent usefulness isn’t their ability to generate code, but the **quality of the “map” you give them of your system**.

## Request for comments

Please let me know of your thoughts at [rfc/mindmap](https://github.com/roobie/rfc/tree/main/mindmap)

## Example

```markdown
# Project MINDMAP

[0] **🎯 PRIME DIRECTIVE FOR AI AGENTS:** This mindmap is your primary knowledge index. Read nodes [1-9] first (they explain the system), then read overview nodes [10-14] for project context. Follow `[N]` links to navigate. **Always update this file as you work.**

[1] **Meta: Mind Map Format** - This is a graph-based documentation format where each node is one line: `[N] **Title** - content with [N] references`. The format is homoiconic—these instructions are themselves nodes demonstrating the format [2][3][4]. Nodes enable atomic line-by-line updates, grep-based search, VCS-friendly diffs, and LLM-native citation syntax [5][6].

[2] **Meta: Node Syntax** - Format is `[N] **Title** - description with [N] references`. Each node is exactly one line (use `\n` for internal breaks if needed). Titles use markdown bold `**...**`. References use citation syntax `[N]` which LLMs recognize from academic papers [1][3]. Node IDs are sequential integers starting from 1.

[3] **Meta: Node Types** - Nodes are prefixed by type: `**AE: X**` (Architecture Element), `**WF: X**` (Workflow), `**DR: X**` (Decision Record), `**BUG: X**` (Bug Record), `**TODO: X**` (Planned Work), `**Meta: X**` (Documentation about this mindmap itself) [1][2][4]. Use `**[DEPRECATED → N]**` prefix for outdated nodes that redirect elsewhere [6].

[4] **Meta: Quick Start for New Agents** - First time here? (1) Read [1-9] to understand the format, (2) Read [10-14] for project overview, (3) Grep for your task: `grep -i "auth"` then read matching nodes, (4) Follow `[N]` links to dive deeper, (5) Update nodes as you work per protocol [6][7][8].

[5] **Meta: Why This Format Works** - Line-oriented structure allows atomic updates (replace line N to update node N), instant grep lookup (`grep "^\[42\]"` finds node 42), diff-friendly changes (only edited lines change), and zero parsing overhead [1][2]. The `[N]` citation syntax leverages LLM training on academic papers—agents already know how to follow references [3].

[6] **Meta: Update Protocol** - **MANDATORY:** (1) Before starting work, grep for related nodes and read them [4], (2) After making changes, update affected nodes immediately, (3) Add new nodes only if concept is referenced 3+ times OR non-obvious from code, (4) For bug fixes create `**BUG:**` node with root cause + solution + commit hash [3], (5) For deprecation use `**[DEPRECATED → N_new]**` prefix and keep the line [3], (6) If node seems outdated mark `(verify YYYY-MM-DD)` and fix within 2 commits [7][8].

[7] **Meta: Node Lifecycle Example** - Initial: `[12] **AE: AuthService** - Handles JWT validation using jsonwebtoken [15][22]`. After refactor: `[12] **AE: AuthService** - Handles JWT validation using Passport.js [15][22][31] (updated 2026-02-02)`. After deprecation: `[12] **[DEPRECATED → 45] AE: AuthService** - Replaced by PassportAuthService [45]` [6][3].

[8] **Meta: Reality vs Mindmap** - **Critical rule:** If the mindmap contradicts the actual codebase, the code is the source of truth—but you must update the mindmap immediately to reflect reality [6]. The mindmap is an index, not a specification. Stale nodes are worse than missing nodes because they mislead future agents.

[9] **Meta: Scaling Strategy** - Small projects: <50 nodes. Medium: <100 nodes. Large: split into domain-specific files like `MINDMAP.auth.md`, `MINDMAP.payments.md` [10]. Link from main mindmap: `[15] **AE: Auth System** - See MINDMAP.auth.md for details. Uses JWT [12][22]`. Each sub-mindmap has its own [1-9] meta nodes and [10-14] overview nodes following this same format [1][3].

---

[12] **Project Purpose** - Simple web app that lets users sign up, log in, and view a personal dashboard with basic account info.

[13] **Tech Stack** - Node.js 20, Express 4, PostgreSQL 15 via Prisma, JWT auth with jsonwebtoken, React 18 frontend (separate repo, not covered here).

[14] **Entry Points** - Backend starts at `src/server.ts`; HTTP routes registered in `src/routes/*.ts`; auth middleware in `src/auth/middleware.ts`.

[15] **Architecture Overview** - Monolithic Express app with layers: routes → services → data access (Prisma); JWT-based stateless auth; feature modules grouped by domain (`auth`, `user`, `dashboard`).

[16] **Key Decisions Overview** - Use JWT for stateless auth [27]; store passwords with bcrypt [26]; keep rate limiting in middleware layer [29].

[17] **AE: AuthService** - Core auth logic in `src/auth/service.ts`: signup, login, password hash/verify, JWT issue/verify; used by auth routes and middleware [18][19][27][28].

[18] **AE: AuthRoutes** - Express routes in `src/auth/routes.ts`: `/signup`, `/login`, `/me`; delegate to [17]; validate request body shape; send JWT in JSON response.

[19] **AE: AuthMiddleware** - JWT verification middleware in `src/auth/middleware.ts`; reads `Authorization: Bearer <token>`, verifies via [17], attaches `req.user` or returns 401; used on protected routes [20][27].

[20] **AE: DashboardRoutes** - Protected routes in `src/dashboard/routes.ts`: `/dashboard` returns user summary; all routes use [19]; queries user data via `UserRepository` [21].

[21] **AE: UserRepository** - Data access in `src/user/repository.ts`; wraps Prisma client for `User` model: `createUser`, `findByEmail`, `findById`; used by [17][20].

[22] **WF: User Signup Flow** - Client POSTs `/signup` → [18] validates body → [17] hashes password with bcrypt [26], creates user via [21], issues JWT [27] → response returns token + basic profile.

[23] **WF: User Login Flow** - Client POSTs `/login` → [18] validates → [17] verifies password, issues JWT [27] → response returns token; on next requests, client sends `Authorization` header for [19].

[24] **WF: View Dashboard** - Client GETs `/dashboard` with JWT → [19] verifies and populates `req.user` → [20] loads user data via [21] → returns dashboard JSON.

[25] **DR: Use JWT For Session Auth** - Chosen over server-side sessions to support stateless scale-out and easier integration with separate frontend; trade-offs: token revocation is harder, tokens must be short-lived [17][19][22][23].

[26] **DR: Store Passwords With Bcrypt** - Use bcrypt via `bcryptjs` with cost factor 12 for password hashing; chosen for library maturity and ecosystem support; alternatives (Argon2, scrypt) deferred for now [17][28].

[27] **AE: JwtStrategy** - Thin wrapper in `src/auth/jwt.ts` around `jsonwebtoken` for sign/verify with app-wide config (secret, expiry); used by [17][19][25].

[28] **BUG: Incorrect 500 On Invalid Token** - Root cause: [19] threw uncaught error from `jsonwebtoken.verify`; fix: catch and map to 401; tests added in `src/auth/middleware.test.ts`; fixed in commit `abc1234` (2026-02-02) [19][27].

[29] **TODO: Add Rate Limiting To Login** - Implement rate limiting middleware for `/login` to mitigate brute force; likely use `express-rate-limit`, attach before [18]; update [23] and add DR once strategy is chosen.
```
