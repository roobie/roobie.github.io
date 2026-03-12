---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - site/src/data/blog/the-npm-problem-nobody-wants-to-work-on.md
autonomous: true
must_haves:
  truths:
    - "Blog post is published (draft: false) and visible on the site"
    - "Post content matches the source draft with appropriate frontmatter"
    - "Co-author attribution reflects AI assistance"
  artifacts:
    - path: "site/src/data/blog/the-npm-problem-nobody-wants-to-work-on.md"
      provides: "Published blog post"
      contains: "The npm problem nobody wants to work on"
  key_links: []
---

<objective>
Publish a new blog post from an existing draft about npm registry governance concerns.

Purpose: Get a finished draft out of /home/jani/devel/nakamareg/blog-post-draft.md and into the blog.
Output: A published blog post at site/src/data/blog/the-npm-problem-nobody-wants-to-work-on.md
</objective>

<execution_context>
@/home/jani/.claude/get-shit-done/workflows/execute-plan.md
@/home/jani/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/quick/1-new-blogpost/1-CONTEXT.md

Source draft: /home/jani/devel/nakamareg/blog-post-draft.md

Frontmatter pattern (from existing posts):
```yaml
---
author: Björn Roberg, Claude Opus 4.6
pubDatetime: 2026-03-12T12:00:00Z
title: The npm problem nobody wants to work on
slug: the-npm-problem-nobody-wants-to-work-on
featured: false
draft: false
tags:
  - discussion
  - development
description: "..."
---
```
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create blog post with frontmatter</name>
  <files>site/src/data/blog/the-npm-problem-nobody-wants-to-work-on.md</files>
  <action>
    1. Read the source draft from /home/jani/devel/nakamareg/blog-post-draft.md
    2. Create site/src/data/blog/the-npm-problem-nobody-wants-to-work-on.md with:
       - Frontmatter:
         - author: "Björn Roberg, Claude Opus 4.6" (AI co-author attribution per project decision)
         - pubDatetime: 2026-03-12T12:00:00Z
         - title: "The npm problem nobody wants to work on" (locked decision: keep draft title)
         - slug: the-npm-problem-nobody-wants-to-work-on
         - featured: false
         - draft: false (locked decision: publish immediately)
         - tags: discussion, development (locked decision)
         - description: Write a 1-2 sentence summary capturing the post's argument that npm's single-registry governance is a structural risk the ecosystem ignores
       - Body: Copy the draft content as-is starting from the first paragraph (after the H1 title, which is now in frontmatter). Only make minor editorial adjustments if something reads awkwardly in the blog context — the draft is well-written and ready to publish.
    3. Verify the file matches the frontmatter schema (all required fields present, valid YAML).
  </action>
  <verify>
    <automated>cd /home/jani/devel/roobie.github.io && head -20 site/src/data/blog/the-npm-problem-nobody-wants-to-work-on.md && echo "---" && wc -l site/src/data/blog/the-npm-problem-nobody-wants-to-work-on.md</automated>
  </verify>
  <done>Blog post file exists with correct frontmatter (draft: false, correct author, tags, pubDatetime) and full draft content</done>
</task>

</tasks>

<verification>
- File exists at site/src/data/blog/the-npm-problem-nobody-wants-to-work-on.md
- Frontmatter has all required fields (title, pubDatetime, description, author, tags, slug, draft: false)
- Content body is present and complete (roughly 50 lines of markdown)
- Author field includes AI co-author credit
</verification>

<success_criteria>
Blog post is ready to deploy: correct frontmatter, full content, draft: false, proper attribution.
</success_criteria>

<output>
After completion, create `.planning/quick/1-new-blogpost/1-SUMMARY.md`
</output>
