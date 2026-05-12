---
author: Björn Roberg, Claude Opus 4.6
pubDatetime: 2026-03-12T12:00:00Z
title: The npm problem nobody wants to work on
slug: the-npm-problem-nobody-wants-to-work-on
featured: false
draft: false
tags:
  - ecosystem-analysis
  - opinion
  - developer-tools
description: "Every Node.js production system depends on a single corporate-controlled npm registry with no real alternative — a structural risk the ecosystem ignores."
kt_mode: knowledge-transforming
---

This has been sitting in my drafts for a while and I keep not publishing it because every time I re-read it I think "nobody's going to do anything about this anyway." But I've been chewing on it long enough that I need to put it somewhere other than my own head.

Here's the situation as of March 2026: every company running nodejs in production depends on a single registry (either directly or transitively), operated by a single company, with no meaningful public alternative. `npm` works. It works well enough that most people don't think about it. That's the problem.

I'm not here to bash any one specific company. They've kept the lights on. The registry is faster and more reliable than it was five years ago. But "one company is doing a good job" is not the same thing as "the structure is sound." These are different claims and we keep collapsing them into one.

## What I mean by "the structure"

When I say structure I mean: who decides what packages are available, under what terms, with what transparency about how those decisions get made. Right now the answer to all three is "GitHub, a Microsoft subsidiary." If you're fine with that, you'll probably stop reading here, and that's fine.

There are about 2.5 million packages on npm. Your lockfile points at registry.npmjs.org and so does everyone else's. There is no failover. When I say "no alternative" I don't mean there aren't tools -- Verdaccio, cnpm, Artifactory, Nexus, a dozen others will cache and proxy for you. They're good. I use Verdaccio. But they're all downstream of npm. The source of truth is singular and corporate-controlled, and no amount of caching changes that.

## The attempts

I spent some time mapping everything that's been tried. The honest summary: there's a lot of "reduce dependence on npm" and essentially zero "replace npm's governance." Private registries, IPFS experiments, CDN-based import workflows -- all useful, none of them a public, community-governed alternative.

The one real attempt was Entropic, started in 2019 by CJ Silverio and Chris Dickinson -- people who actually built parts of npm. Federated design, content-addressed storage, serious technical vision. It stalled. No single dramatic reason. No sustained funding, no critical mass of operators, hard governance questions that federation doesn't actually solve, and then -- ironically -- Microsoft buying npm made the urgency feel lower. The very thing that should have been a warning signal ended up being a sedative.

Every failure mode was about people and money, not technology. That's the part I keep coming back to.

## JSR and the diversification question

Then there's JSR, Deno's registry. It's real. People publish to it. TypeScript-native, ESM-first, works across runtimes. If you squint, it looks like the ecosystem is diversifying on its own. Maybe the problem solves itself.

I'm not convinced. JSR is VC-backed, corporate-governed, and doesn't mirror the existing npm corpus. It's one more company running one more registry. If Deno pivots or folds, JSR has the same bus factor as npm. And the 2.5 million packages that every production system actually depends on? Still on npm. Only on npm.

But I'll admit: JSR makes me less certain that a new community registry is the right intervention. Maybe the right intervention is pushing JSR toward better governance. Maybe it's something else entirely. I don't know yet.

## What I think would actually work

If someone were going to try this -- and I'm not committing to being that someone, I'm thinking out loud -- it would need to look different from Entropic. Specifically:

Start with a read-only mirror. Not federation, not a new publishing platform. Just: you can point your package manager at this endpoint and get packages. That's the minimum thing that creates leverage. If there are two places to read packages from, npm's monopoly on availability breaks, and everything else becomes negotiable.

Get organizations to back it before building anything. Let's Encrypt didn't succeed because of passionate individuals. It succeeded because ISRG, Mozilla, and EFF committed resources before launch. Infrastructure projects that depend on one person's free time die when that person's life changes. Entropic proved this.

Run it on existing software. Verdaccio exists, it's battle-tested, it's npm-compatible. Don't build a registry from scratch. Build governance around a registry that already works.

And honestly, this is the hard part -- make the governance itself the product. Not the technology. The technology is a solved problem. What doesn't exist is a transparent, community-controlled, funded entity that operates public npm infrastructure and can survive the departure of any single person or company. That's the gap.

## Where I actually am

I haven't bought the domain. I haven't started building. What I've done is talk to people and think, which is cheaper than code and usually more useful at this stage.

The honest question I'm sitting with is whether enough organizations would pay for this while npm is working fine. Not whether they'd say it's a good idea -- everyone says that -- but whether they'd write a check. Entropic had plenty of people who thought it was important. It had almost nobody who funded it.

I'm going to talk to the Entropic folks before I do anything else. Not to pitch them but to ask what they'd do differently. If the people who were closest to this problem think the conditions have changed enough to try again, that means something. If they don't, that means something too.

If you've thought about this problem, or if you're at an org that would actually commit resources to it, I'd like to hear from you. Not "great idea, someone should do this." I've heard enough of that. I mean: would you pay for it, would you operate a node, would you sit on a board. Those are the only questions that matter right now.
