---
author: Björn Roberg, Claude Opus 4.7
pubDatetime: 2026-05-13
title: "I tagged every blog post by cognitive mode. Most of mine are knowledge-telling — and that's fine."
slug: tagging-posts-by-cognitive-mode
featured: false
draft: false
tags:
  - meta
  - writing
  - frameworks
  - blogging
description: "Adding one optional frontmatter field to my blog produced a taxonomy I couldn't have written without doing the work. The categories come from Bereiter & Scardamalia (1987), and applying them to my own corpus was uncomfortable in useful ways."
kt_mode: knowledge-transforming
---

I added a single optional field to my blog's frontmatter. By the end of the afternoon, I had a meta page that classified my own posts into four groups, and the distribution was unflattering in a way I hadn't predicted.

Here's the field:

```yaml
kt_mode: knowledge-transforming   # or knowledge-telling, or mixed
```

And here's the schema change, in Zod for an Astro content collection:

```typescript
kt_mode: z
  .enum(["knowledge-telling", "knowledge-transforming", "mixed"])
  .optional(),
```

That's the whole new contract. Optional means existing posts don't break; omission means "I haven't classified this yet." A new page at [`/lenses/`](/lenses/) reads the field and groups every post under one of four headings: `knowledge-transforming`, `mixed`, `knowledge-telling`, `unclassified`.

The Astro snippet is unremarkable — `getCollection`, group by a property, render `<Card>` per post. I cribbed the structure from my own `/archives/` page and replaced the "group by year" with "group by `kt_mode ?? 'unclassified'`." About forty lines, including the intro paragraph.

What's worth talking about is what the field is *for*.

## The categories aren't mine

They come from Carl Bereiter and Marlene Scardamalia, *The Psychology of Written Composition* (1987). Their central claim, simplified:

> Two distinct cognitive processes underlie all written composition, and most writers default to the simpler one without noticing.

**Knowledge-telling** is the retrieve-and-write loop. You locate what you know about a topic, locate the rough shape of the genre, write down what comes up, and stop when nothing new surfaces. The output is coherent. Your beliefs don't change. Cognitive cost is low. Most tutorials, most how-tos, most "here's a thing I built" posts are knowledge-telling, and that's appropriate — they're not arguing anything.

**Knowledge-transforming** runs two problem spaces in tension. A *content* space — *what do I actually believe? what's the real shape of this claim?* — and a *rhetorical* space — *how should this be said, to whom, toward what end?* Each space's tentative answer constrains the other; the writer iterates between them. Beliefs shift during the writing. Cognitive cost is high. If you can predict the post at the start, you weren't doing this — you were doing the first thing, well.

B&S's empirical claim is the uncomfortable one. Most writing, including by competent practitioners, is knowledge-telling. Knowledge-transforming requires deliberate effort, slower pacing, and explicit problem-framing. It doesn't happen by accident.

## The reveal

I started with five pilot classifications — two I felt confident were knowledge-transforming, one mixed, two knowledge-telling. The remaining twenty-four sit under "unclassified" because I haven't gone through them yet.

That ratio is itself diagnostic. I have written more than I have *deliberately transformed*. If I'm honest about which posts to classify which way, the unclassified pile is probably mostly knowledge-telling — explainers, tool intros, technique summaries — and that fraction is going to grow.

This is not a moral failing. Knowledge-telling is what most published technical writing *should* be. The failure mode B&S names is not "writing knowledge-telling posts." It is **mistaking one for the other** — treating a knowledge-telling artifact as if it were substrate-bearing thinking. Or, conversely, treating an opinionated essay as if it were a how-to, and being annoyed when it doesn't tell you what to type.

The categories are useful precisely because they expose this confusion. You can't tell from the surface. Both kinds of post can be well-written, well-structured, fully formed. The difference is in the cognitive process behind them — and that process is invisible to the reader unless the writer marks it.

So I'm marking it.

## Why this matters in 2026

Here is the version of the framework that matters most to me right now.

Large language models perform **knowledge-telling natively.** That's what next-token prediction structurally *is* — retrieve plausible content that fits a topic and a genre, write it down, repeat. An LLM has no content problem space because it has no beliefs to revise. It can produce well-formed text indefinitely, on any subject, without anything changing for the model in the process.

This is fine when knowledge-telling is what you wanted. It's fine for boilerplate, summaries, drafts you'll rewrite, restatements of well-trodden material. The technology matches the task.

The failure mode is when knowledge-telling masquerades as the other thing. An LLM-written essay can have all the surface markers of knowledge-transforming — caveats, opposing views considered, conclusions that update mid-piece — *without anyone's beliefs having changed*. The surface is dialectic; the substrate is empty. It reads like thinking happened; nothing was thought.

The load-bearing human contribution under LLM co-authorship is the part LLMs don't do. The content-problem-space work. The "do I actually believe this?" question. The willingness to be wrong on the record. **That's what `kt_mode` is trying to make legible** — not as a quality grade, but as a process disclosure.

## Try it

If this resonates, here's the small thing I'd suggest:

Add one optional frontmatter field to your blog or notes system. Any classification axis that names something invisible from the surface — cognitive mode, co-authoring posture, genre, audience, exigence, your own taxonomy. The constraint is that the categories should be hard to fake and hard to derive from skimming. The act of choosing the value should require an honest look at what you actually wrote.

Then build a meta page that displays the corpus through that lens. It doesn't have to be pretty. The point is that the classification becomes part of the artifact, not commentary about the artifact.

The first useful thing this gave me was not the categories themselves — those were always there. It was the visible *unclassified* count, growing every time I declined to look at a post and decide. The blank space is its own diagnostic.

## What's next

I'm building this as an extensible structure, not a one-off. The `/lenses/` page is designed to accept additional frames — co-authoring posture, genre per Carolyn Miller's *Genre as Social Action*, others I haven't picked yet. Each new lens is one optional frontmatter field and one section on the page. No refactor, no migration.

The pattern is the point. Most blogs surface their content along one axis at a time — chronology, tag, title — and call that the index. But a single corpus can be viewed through many frames, and the frame is part of the meaning. Frontmatter is the lightest possible vehicle for that work.

I'll write up the second lens when I'm sure it earns its keep. In the meantime, the existing one is enough to surface what I needed to see: I write more knowledge-telling than I admit, and the discomfort of admitting that is itself the start of writing the other kind.

<!--
DRAFT NOTES (remove before publishing):

Spine: thread 0015 (content-production-theories.md), specifically the
Bereiter-Scardamalia excavation + the /lenses/ implementation shipped
2026-05-12 (commit 615ae56).

Title alternatives:
  - "I tagged every blog post by cognitive mode. Most of mine are
    knowledge-telling — and that's fine." [current pick]
  - "What happens when you tag your blog posts by cognitive mode"
  - "Knowledge-telling vs knowledge-transforming, applied to my own blog"
  - "Adding a /lenses/ page to your blog: one frontmatter field, one
    meta page, a B&S taxonomy you can't fake"

Frontmatter classification:
  This post is `knowledge-transforming`. Justification: writing it forced
  me to commit to a public stance about my own corpus that I had not yet
  taken privately. The 5/24 ratio was a reveal, not a retrieval. If I
  later flip back to thinking the framework is wrong, that's exactly the
  signal KT2 is supposed to produce — and the post should be flagged
  superseded, not edited to pretend.

Things deliberately NOT included:
  - Dillylang ↔ KT2 bridge. Too high-concept for first dev.to derivative.
    Save for post 3 or 4 once channel calibration data is in.
  - 2D matrix (kt_mode × dillylang_applied). Mentioned obliquely as
    "additional frames"; the full table belongs in a later post.
  - Naur. The grounding in Naur's theory-of-the-program is real but
    would derail the lead. The bridge essay (Naur ↔ B&S) is its own post.
  - Direct anti-LLM hot-take. The 2026 section is opinionated but
    careful — the audience reads more skeptically when the framing is
    "your AI tool is a knowledge-telling machine," even though that's
    structurally what it is.

dev.to adaptation (separate task):
  - Tighten to ~800-900 words. Cut the "Try it" section's second half;
    cut about half of "Why this matters in 2026" — keep the LLM tie-in
    but lose the load-bearing-human-contribution paragraph (too philosophical).
  - Add cover image — placeholder OK, or pull the lens-page screenshot.
  - dev.to tags: probably [meta, ai, writing, productivity] — the AI tag
    is the trending-vertical hook per axiom A3.
  - canonical_url: https://roobie.github.io/posts/tagging-posts-by-cognitive-mode/
    (or whatever the slug renders to — verify after publish)
  - Lead with the engineering specificity (the Zod diff + the page),
    payoff with B&S. Audience reads code-first.

Open call for BR:
  - Title pick from the four alternatives above.
  - Confirm `draft: true` stays until BR has reviewed end-to-end.
  - The "Try it" section currently asks the reader to pick their own
    axis. Worth keeping, or too prescriptive? My instinct: keep — it's
    the actionable closer that the dev.to derivative will lean on.
-->
