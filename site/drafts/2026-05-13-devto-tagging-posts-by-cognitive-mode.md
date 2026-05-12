---
title: "I tagged every blog post by cognitive mode. Most of mine are knowledge-telling — and that's fine."
published: false
description: "Adding one optional frontmatter field to my blog produced a taxonomy I couldn't have written without doing the work. The categories come from Bereiter & Scardamalia (1987)."
tags: ai, writing, astro, productivity
canonical_url: https://bjro.dev/posts/tagging-posts-by-cognitive-mode/
cover_image: https://bjro.dev/posts/tagging-posts-by-cognitive-mode/index.png
---

I added a single optional field to my blog's frontmatter. By the end of the afternoon, I had a meta page that classified my own posts into four groups, and the distribution was unflattering in a way I hadn't predicted.

Here's the field:

```yaml
kt_mode: knowledge-transforming   # or knowledge-telling, or mixed
```

And the schema change, in Zod for an Astro content collection:

```typescript
kt_mode: z
  .enum(["knowledge-telling", "knowledge-transforming", "mixed"])
  .optional(),
```

That's the whole new contract. Optional, so existing posts don't break. Omission means "I haven't classified this yet."

A new page at `/lenses/` reads the field and groups every post under one of four headings: `knowledge-transforming`, `mixed`, `knowledge-telling`, `unclassified`. The Astro is unremarkable — `getCollection`, group by a property, render a `<Card>` per post. I cribbed the structure from my own `/archives/` page and replaced "group by year" with "group by `kt_mode ?? 'unclassified'`". About forty lines.

What's worth talking about is what the field is *for*.

## The categories aren't mine

They come from Carl Bereiter and Marlene Scardamalia, *The Psychology of Written Composition* (1987). Their central claim, simplified:

> Two distinct cognitive processes underlie all written composition, and most writers default to the simpler one without noticing.

**Knowledge-telling** is the retrieve-and-write loop. You locate what you know, locate the rough shape of the genre, write down what comes up, stop when nothing new surfaces. The output is coherent. Your beliefs don't change. Cognitive cost is low. Most tutorials, most how-tos, most "here's a thing I built" posts are knowledge-telling — and that's appropriate. They're not arguing anything.

**Knowledge-transforming** runs two problem spaces in tension: a *content* space (*what do I actually believe? what's the real shape of this claim?*) and a *rhetorical* space (*how should this be said, to whom, toward what end?*). Each space's tentative answer constrains the other; the writer iterates between them. Beliefs shift during the writing. Cognitive cost is high. If you can predict the post at the start, you weren't doing this — you were doing the first thing, well.

The uncomfortable empirical claim: most writing, including by competent practitioners, is knowledge-telling. Knowledge-transforming doesn't happen by accident.

## The reveal

I classified five pilot posts — two knowledge-transforming, one mixed, two knowledge-telling. The remaining twenty-four sit under "unclassified" because I haven't gone through them yet.

That ratio is itself diagnostic. I have written more than I have *deliberately transformed*.

This is not a moral failing. Knowledge-telling is what most published technical writing *should* be. The failure mode B&S names is not "writing knowledge-telling posts." It's **mistaking one for the other** — treating a knowledge-telling artifact as if it were substrate-bearing thinking. The categories are useful precisely because they expose the confusion. You can't tell from the surface. Both kinds of post can be well-written, well-structured, fully formed. The difference is invisible to the reader unless the writer marks it.

So I'm marking it.

## Why this matters in 2026

Large language models perform **knowledge-telling natively**. That's what next-token prediction structurally *is* — retrieve plausible content that fits a topic and a genre, write it down, repeat. An LLM has no content problem space because it has no beliefs to revise.

This is fine when knowledge-telling is what you wanted. It's fine for boilerplate, summaries, restatements of well-trodden material, drafts you'll rewrite.

The failure mode is when knowledge-telling masquerades as the other thing. An LLM-written essay can have all the surface markers of knowledge-transforming — caveats, opposing views considered, conclusions that update mid-piece — *without anyone's beliefs having changed*. The surface is dialectic; the substrate is empty. It reads like thinking happened; nothing was thought.

That's what `kt_mode` is trying to make legible. Not as a quality grade. As a process disclosure.

## Try it

If this resonates, here's the small thing I'd suggest:

Add one optional frontmatter field to your blog or notes system. Any classification axis that names something invisible from the surface — cognitive mode, co-authoring posture, genre, audience, your own taxonomy. The constraint is that the categories should be hard to fake and hard to derive from skimming. The act of choosing the value should require an honest look at what you actually wrote.

Then build a meta page that displays the corpus through that lens. It doesn't have to be pretty. The point is that the classification becomes part of the artifact.

The first useful thing this gave me wasn't the categories themselves — those were always there. It was the visible *unclassified* count, growing every time I declined to look at a post and decide. The blank space is its own diagnostic.

---

*Originally posted at [bjro.dev](https://bjro.dev/posts/tagging-posts-by-cognitive-mode/).*

<!--
DEV.TO PUBLISHING NOTES (don't paste this block):

Word count: ~890 (target was 800-900).

Frontmatter shape (dev.to conventions):
  - title, published, description, tags (comma-separated, max 4),
    canonical_url, cover_image — all standard fields.
  - published: false starts as draft. dev.to UI lets you flip on publish.
  - cover_image points at the Satori-generated OG image. If it renders
    blank in dev.to preview, drop the line.
  - Tags chosen: `ai` (trending vertical), `writing` (theme), `astro`
    (engineering niche — surfaces to Astro users), `productivity`
    (popular). dev.to enforces 4-tag max.

Cuts from canonical bjro.dev version (~1100w → ~890w):
  - Most of "load-bearing human contribution under LLM co-authorship"
  - Second half of "Try it" — meditation paragraph merged into closer
  - "What's next" section — no future-teasing for skim-readers

Canonical discipline:
  - canonical_url points to bjro.dev. Only correct value.
  - "Originally posted at" line at the bottom is honest, not buried.
  - Do NOT auto-cross-post via any integration. Manual paste only.

To paste:
  1. https://dev.to/new — Markdown mode in editor settings
  2. Paste from the opening --- through the "Originally posted at" line,
     INCLUDING the frontmatter block.
  3. dev.to parses the YAML as post metadata.
  4. Preview to verify cover image + canonical link render correctly.
  5. Publish (UI button) — published: false in frontmatter is a backstop
     on first import, not a permanent gate.
-->
