# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog ("Cogitate") by Björn Roberg, deployed to GitHub Pages at roobie.github.io. Built with AstroPaper v5 theme on Astro 5, using Tailwind CSS 4, Pagefind for search, and Satori for OG image generation.

## Repository Structure

- Root contains `justfile` and `mise.toml` (Node 24 via mise)
- All site code lives under `site/` — an Astro project using pnpm
- Blog posts are markdown files in `site/src/data/blog/` (not `src/content/`)
- The `@/` import alias maps to `site/src/`

## Commands

All commands run from the repo root unless noted. The site uses pnpm (not npm/yarn).

```bash
just dev              # Start dev server (wraps: cd site && pnpm run dev)
cd site && pnpm build # Type-check, build, then generate Pagefind index
cd site && pnpm lint  # ESLint
cd site && pnpm format:check  # Prettier check
cd site && pnpm format        # Prettier fix
```

## Blog Post Frontmatter Schema

Posts are `.md` files in `site/src/data/blog/`. Required frontmatter fields:

- `title: string`
- `pubDatetime: Date` (YAML date)
- `description: string`

Optional: `author`, `modDatetime`, `featured`, `draft`, `tags` (string array, defaults to `["others"]`), `ogImage`, `canonicalURL`, `hideEditPost`, `timezone`, `kt_mode` (`knowledge-telling` | `knowledge-transforming` | `mixed`).

Posts with `draft: true` are excluded from production builds.

`kt_mode` classifies a post by Bereiter & Scardamalia's knowledge-telling vs knowledge-transforming distinction; it is consumed by `/lenses/` to group posts by cognitive mode. Omission means unclassified (rendered in a separate group).

## Key Configuration Files

- `site/src/config.ts` — Site metadata (title, author, URL, pagination, edit links)
- `site/src/constants.ts` — Social links and share links
- `site/astro.config.ts` — Astro config with remark plugins (TOC, collapse), Shiki code highlighting, Tailwind via Vite plugin
- `site/eslint.config.js` — ESLint with `no-console: "error"` rule
- `site/.prettierrc.mjs` — Prettier config (double quotes, 2-space indent, trailing commas)

## Architecture Notes

- Content collection uses Astro's glob loader (`content.config.ts`), not the legacy content directory
- OG images are dynamically generated per-post via Satori (`src/utils/generateOgImages.ts`, `src/pages/posts/[...slug]/index.png.ts`)
- Pagefind search index is built post-build and copied to `public/pagefind/`
- Git branching: `master` is the main/deploy branch
