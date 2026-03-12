# Stack Research

**Domain:** AI-assisted blog content production workflow (scripts/CLI tooling, not site infrastructure)
**Researched:** 2026-03-10
**Confidence:** HIGH for AI SDK and model selection; MEDIUM for CLI tooling choices

---

## Scope

This research covers the **content production tooling layer** only — the scripts and workflow
that generate, review, and place blog posts into `site/src/data/blog/`. The existing Astro /
Tailwind / GitHub Pages / pnpm infrastructure is not in scope and should not be modified.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `@anthropic-ai/sdk` | `^0.78.0` | Anthropic API client (TypeScript) | Official SDK, maintained by Anthropic, full Claude 4.x support including streaming and prompt caching. Current as of 2026-02-19 (v0.78.0). |
| `claude-sonnet-4-6` (model ID) | latest alias | AI model for content generation | Best speed/intelligence tradeoff at $3/$15 per MTok. 64K max output is sufficient for any blog post. Training data cutoff Jan 2026 keeps it current for tech topics. |
| Node.js | `22+` | Script runtime | Already required by the project (pnpm lockfile v9, Astro v5). No new runtime needed. |
| TypeScript | `5.9.3` (existing) | Script language | Already in use; strict mode already configured. Scripts live outside `site/` to avoid Astro build inclusion. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `gray-matter` | `^4.0.3` | Parse and stringify markdown frontmatter | Reading existing posts to extract schema examples; writing new posts with valid frontmatter. Battle-tested, used by Astro internally. |
| `zod` | `^3.24` | Validate generated frontmatter against schema | Validate AI output before writing to disk, catching missing fields or type mismatches that would break the Astro build. Already used in `site/src/content.config.ts`. |
| `commander` | `^14.0.3` | CLI argument parsing | Building the content generation scripts as proper CLIs with subcommands (`generate`, `draft`, `edit`). Mature, actively maintained, requires Node 20+. |
| `ora` | `^8.x` (ESM) | Terminal spinner during API calls | Long-running API calls (5–30s for a full post) need progress feedback. Ora is the standard choice; its dependency on chalk 5 aligns with ESM-first approach. |
| `chalk` | `^5.6.2` | Terminal color output | Readable success/error/warning output in scripts. v5 is ESM-only, which is correct for new scripts targeting Node 22+. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `tsx` | Run TypeScript scripts directly without a build step | `npx tsx scripts/generate.ts` is simpler than maintaining a separate tsconfig + compile step for scripts. Already available in the ecosystem, no separate install needed if using npx. |
| Existing ESLint + Prettier | Lint and format scripts | Reuse the project's `eslint.config.js` and `.prettierrc.mjs`. Scripts should live in a top-level `scripts/` directory, excluded from the `site/` build. |

---

## Installation

These packages are installed as a separate concern from the Astro site. Either add them to a top-level `package.json` (if one is created for scripts) or install them as dev dependencies in the repo root separate from `site/`.

```bash
# AI SDK + content tooling
pnpm add @anthropic-ai/sdk gray-matter zod commander ora chalk

# No separate dev dependencies needed — tsx via npx, linting via existing config
```

Do not install these inside `site/` — they are not needed by the Astro build and would pollute the site's dependency tree.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `@anthropic-ai/sdk` direct | LangChain / LlamaIndex | Only if orchestrating multiple LLM providers or building a complex retrieval pipeline. For single-model blog generation, the full LangChain abstraction is overhead with no benefit. |
| `claude-sonnet-4-6` | `claude-opus-4-6` | If generation quality is clearly insufficient for technical depth. Opus 4.6 costs 5x more ($5/$25 per MTok). Start with Sonnet; upgrade if needed. |
| `claude-sonnet-4-6` | `claude-haiku-4-5` | If running bulk generation (outline + metadata, not full posts). Haiku is 3x cheaper but noticeably weaker at long-form technical writing. |
| `gray-matter` | Manual string parsing | Never. Gray-matter is the de facto standard for this exact use case and is already embedded in the Astro ecosystem. |
| `commander` | `yargs`, `meow`, `oclif` | `oclif` if the tooling grows into a full CLI product with plugin architecture. `meow` for single-purpose scripts. `commander` is the right fit for 2–5 related subcommands. |
| `tsx` (npx) | `ts-node`, compiled JS | `ts-node` works but is slower and has more configuration surface. Compiled JS adds a build step. `tsx` with npx keeps scripts dependency-light. |
| Prompt files as `.md` / `.txt` | Hardcoded strings in scripts | Prompt files win: they can be version-controlled, reviewed as writing artifacts, and edited without touching code. Store in `scripts/prompts/`. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| OpenAI SDK / GPT models | The blog already credits Claude as co-author (`Björn Roberg, Claude`). Switching providers mid-project requires updating attribution conventions and changing tone expectations. | `@anthropic-ai/sdk` + Claude 4.x |
| `claude-3-haiku-20240307` | Deprecated; retired April 19, 2026. Do not start new work on this model. | `claude-haiku-4-5` if cost is the driver |
| LangChain / LlamaIndex | Over-engineered for single-model, single-task blog generation. Adds significant dependency weight, abstraction layers that obscure API behavior, and frequent breaking changes. | Direct `@anthropic-ai/sdk` calls |
| CMS integrations (Front Matter CMS, TinaCMS, Decap) | The stated project scope is content production via AI, not a GUI editing layer. Adding a CMS is a separate infrastructure concern explicitly out of scope. | Plain markdown files + scripts |
| Automated git commit in generation scripts | Scripts that auto-commit bypass review. Blog posts should be human-reviewed before commit. | Write to `site/src/data/blog/` as `draft: true`, review manually, then commit. |
| `chalk` v4 | v4 is CJS-only; new scripts targeting Node 22 ESM should use v5 (ESM-only). Mixing CJS and ESM in the same script tree causes interop friction. | `chalk` ^5.6.2 |

---

## Stack Patterns by Variant

**For a simple generate-and-save script (MVP):**
- `@anthropic-ai/sdk` + `gray-matter` + `zod` validation
- Write markdown file to `site/src/data/blog/` with `draft: true`
- No CLI framework needed — single `generate.ts` script with minimal args

**For a multi-command workflow (full tool):**
- Add `commander` for subcommands: `generate <topic>`, `draft <file>`, `outline <topic>`, `edit <file>`
- Add `ora` + `chalk` for polished terminal UX
- Store system prompts in `scripts/prompts/` as markdown files (version-controllable, readable)

**For cost management on bulk generation:**
- Use prompt caching via the SDK's `cache_control` parameter on the system prompt
- System prompt cache reads cost 10% of normal input price
- Worthwhile once the same system prompt is used more than twice in a session

**For maintaining voice consistency:**
- Feed 3–5 existing posts as examples in the system prompt (they are short enough)
- Mark example content with `cache_control: { type: "ephemeral" }` to cache across calls in a session
- This is more reliable than a style-guide document because it shows the actual writing, not a description of it

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `@anthropic-ai/sdk@^0.78.0` | Node.js 18+, TypeScript 5.x | No breaking changes expected in minor bumps. SDK follows semver. |
| `gray-matter@^4.0.3` | Node.js 12+, CommonJS and ESM | Last published 5 years ago but stable and widely used. No active maintenance needed. |
| `chalk@^5.6.2` | Node.js 14.16+ ESM only | Must use ESM (`"type": "module"` in package.json or `.mts` extension). Do not mix with CJS-only packages in the same entry point. |
| `commander@^14.0.3` | Node.js 20+ | Requires Node 20 minimum. Project uses Node 22, so no issue. |
| `zod@^3.24` | Node.js 12+ | Zod v3 and v4 coexist in ecosystem; v3 is what `site/src/content.config.ts` already uses — keep consistent. |

---

## Frontmatter Schema Reference

The existing Zod schema in `site/src/content.config.ts` defines the required fields. Generated posts must satisfy this:

```typescript
{
  author: string,           // e.g. "Björn Roberg, Claude"
  pubDatetime: Date,        // ISO datetime string in markdown, parsed by Astro
  modDatetime?: Date | null,
  title: string,
  featured?: boolean,
  draft?: boolean,          // set true on generation, false after review
  tags: string[],           // defaults to ["others"] if omitted
  ogImage?: string,         // optional
  description: string,      // required — used in SEO and RSS
  canonicalURL?: string,
  hideEditPost?: boolean,
  timezone?: string,
}
```

Validate against this schema before writing to disk. A validation failure is a script error, not a user error.

---

## Sources

- [Anthropic TypeScript SDK releases](https://github.com/anthropics/anthropic-sdk-typescript/releases) — v0.78.0 confirmed current as of 2026-02-19 (HIGH confidence)
- [Anthropic models overview](https://platform.claude.com/docs/en/about-claude/models/overview) — `claude-sonnet-4-6` confirmed current recommended model, pricing verified (HIGH confidence)
- [gray-matter npm](https://www.npmjs.com/package/gray-matter) — v4.0.3 confirmed, widely used (HIGH confidence)
- [commander npm/jsDocs](https://www.jsdocs.io/package/commander) — v14.0.3 confirmed (MEDIUM confidence — secondary source)
- [chalk npm](https://www.npmjs.com/package/chalk) — v5.6.2 confirmed (MEDIUM confidence — secondary source)
- [Anthropic prompt caching docs](https://www.anthropic.com/news/prompt-caching) — caching mechanics and cost structure verified (HIGH confidence)
- [zod npm](https://www.npmjs.com/package/zod) — v3.24 current in npm ecosystem (MEDIUM confidence — WebSearch)

---

*Stack research for: AI-assisted blog content production on Astro static site*
*Researched: 2026-03-10*
