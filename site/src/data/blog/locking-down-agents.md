---
author: Björn Roberg, GPT-5.1
pubDatetime: 2026-01-20T17:00:00Z
modDatetime: 2026-01-20T17:00:00Z
title: Locking down agents
slug: locking-down-agents
featured: true
draft: false
tags:
  - computing
  - security
  - development
  - agents
description: Discussions about how one can limit the blast radius of agents.
---

Sandboxing agents isn’t a “nice to have”; it’s the safety railing that keeps obvious risks from becoming painful incidents. A coding agent that can freely read your filesystem, touch real credentials, call production APIs, or execute arbitrary shell commands is, by definition, an untrusted program with broad powers. It can accidentally delete data, leak secrets, open insecure network paths, or quietly embed vulnerabilities in otherwise healthy code. Running agents inside containers or VMs with limited filesystem access, scoped credentials, and constrained networking shrinks the blast radius when (not if) something goes wrong. You still get the speed boost of automated coding, but any damage is confined to a disposable environment instead of your laptop, your cloud account, or your production systems.

Today I browsed [this](https://news.ycombinator.com/item?id=46690907) HN article, which lead me to [agent-sandbox](https://github.com/mattolson/agent-sandbox) - an uncomplicated docker setup to sandbox `claude` inside a container, with a firewall. I'm going to apply this to my workflows and keep notes here.
