# Coding Conventions

**Analysis Date:** 2026-03-10

## Naming Patterns

**Files:**
- Utility files use camelCase: `getSortedPosts.ts`, `postFilter.ts`, `getUniqueTags.ts`
- Component files use PascalCase: `ShareLinks.astro`, `Datetime.astro`, `LinkButton.astro`, `Tag.astro`
- Page files use kebab-case for dynamic routes: `[...slug]/index.astro`, `[...page].astro`
- Config/constant files use lowercase: `config.ts`, `constants.ts`, `content.config.ts`
- Scripts use camelCase: `theme.ts`

**Functions:**
- Utility functions use camelCase: `getSortedPosts()`, `getUniqueTags()`, `getPostsByTag()`, `slugifyStr()`
- Functions that filter/get data use `get` prefix: `getPath()`, `getUniqueTags()`, `getPostsByTag()`, `getPostsByGroupCondition()`
- Filter functions use `postfix` pattern: `postFilter` (exported as default)
- Helper functions use descriptive verbs: `slugifyStr()`, `hasNonLatin()`, `loadGoogleFont()`

**Variables:**
- Constants in ALL_CAPS within narrow scope: `THEME`, `LIGHT`, `DARK` in `theme.ts`
- Exported constants in UPPER_SNAKE_CASE: `SITE` in `config.ts`, `SOCIALS` in `constants.ts`, `SHARE_LINKS` in `constants.ts`, `BLOG_PATH` in `content.config.ts`
- Regular variables use camelCase: `themeValue`, `isModified`, `currentTheme`, `initialColorScheme`
- Props object destructuring uses camelCase: `pubDatetime`, `modDatetime`, `className`
- Collection types use camelCase: `blogId`, `pathSegments`, `groupKey`

**Types:**
- Interfaces start with capital letter: `Props`, `Social`, `Tag`, `GroupFunction`
- Generic type parameters use PascalCase: `T` for generic, specific types use descriptive names
- Type names are PascalCase: `Props`, `CollectionEntry`

## Code Style

**Formatting:**
- Tool: Prettier 3.8.1
- Line width: 80 characters
- Indentation: 2 spaces (tabWidth)
- Quotes: Double quotes (jsxSingleQuote: false, singleQuote: false)
- Arrow functions: No parentheses around single param (arrowParens: "avoid")
- Trailing commas: ES5 compatible (trailingComma: "es5")
- Semicolons: Required (semi: true)
- End of line: LF (endOfLine: "lf")
- Bracket spacing: Enabled (bracketSpacing: true)

Example from `postFilter.ts`:
```typescript
const postFilter = ({ data }: CollectionEntry<"blog">) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};
```

**Linting:**
- Tool: ESLint 9.39.2 with flat config
- Parser: TypeScript ESLint parser
- Plugins:
  - `eslint-plugin-astro` - For Astro component files
  - `typescript-eslint` - For TypeScript files
- Key rules:
  - `"no-console": "error"` - Console statements are forbidden
  - Extends `astro/tsconfigs/strict` and `eslint-plugin-astro.configs.recommended`
  - Globals: Browser and Node globals enabled
- Ignored directories: `dist/**`, `.astro`, `public/pagefind/**`

## Import Organization

**Order:**
1. Third-party imports (astro, dayjs, lodash, etc.)
2. Local imports from `@/` alias
3. Local relative imports (rare)

Example from `Datetime.astro`:
```typescript
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import IconCalendar from "@/assets/icons/IconCalendar.svg";
import { SITE } from "@/config";
```

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- Used for all local imports: `@/config`, `@/constants`, `@/utils/getSortedPosts`, `@/components/LinkButton`, `@/assets/icons/IconCalendar.svg`

## Error Handling

**Patterns:**
- Explicit null checks with optional chaining: `post.data.modDatetime ?? post.data.pubDatetime`
- Throw explicit errors with descriptive messages: `throw new Error("Failed to download dynamic font")`
- Check response status before proceeding: `if (!res.ok) { throw new Error(...) }`
- Filter arrays to remove falsy values: `.filter(path => path !== "")`, `.filter(path => !path.startsWith("_"))`
- Type guards in conditional expressions: `if (body) { ... }`
- Optional array access with fallback: `slugifyAll(post.data.tags).includes(tag)` where tags defaults to `["others"]`

Example from `loadGoogleFont.ts`:
```typescript
const resource = css.match(
  /src: url\((.+?)\) format\('(opentype|truetype)'\)/
);

if (!resource) throw new Error("Failed to download dynamic font");

const res = await fetch(resource[1]);

if (!res.ok) {
  throw new Error("Failed to download dynamic font. Status: " + res.status);
}
```

## Logging

**Framework:** None - console is forbidden by ESLint rule `"no-console": "error"`

**Patterns:**
- No debug logging in production code
- All console usage is an error and will fail linting
- Use Astro's built-in logging or separate logging utilities if needed

## Comments

**When to Comment:**
- Function-level JSDoc comments for public utilities
- Inline comments explaining non-obvious logic
- Comments marking important state changes or lifecycle events

**JSDoc/TSDoc:**
- Used for public utility functions
- Includes parameter descriptions, return types, and usage context
- Example from `getPath.ts`:
```typescript
/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/posts` in return value
 * @returns blog post path
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
) {
  // ...
}
```

**Inline Comments:**
- Used to explain complex filtering logic: `// remove empty string in the segments ["", "other-path"] <- empty string will be removed`
- Used to document state transitions: `// Initial color scheme` and `// Can be "light", "dark", or empty string for system's prefers-color-scheme`
- Used to mark important sections: `/* ========== Formatted Datetime ========== */`

## Function Design

**Size:** Functions are kept small and focused
- Average utility function: 5-25 lines
- Complex functions broken into smaller helpers: `hasNonLatin()` helper in `slugify.ts`
- Example: `getPostsByTag()` is a 3-line composition of utilities

**Parameters:**
- Destructuring used for object parameters: `const { data }: CollectionEntry<"blog">`
- Explicit typing required: `posts: CollectionEntry<"blog">[]`
- Optional parameters with defaults: `size = "sm"`, `includeBase = true`, `modDatetime: z.date().optional().nullable()`
- No positional parameters in complex functions; use objects with destructuring

**Return Values:**
- Explicit return types: `const getSortedPosts = (posts: CollectionEntry<"blog">[]) => CollectionEntry<"blog">[]`
- Arrow functions with implicit returns when single expression: `const getPostsByTag = (...) => getSortedPosts(...)`
- Functions returning objects/arrays: `const getUniqueTags = (...): Tag[] => { ... }`

## Module Design

**Exports:**
- Default exports for single-purpose utilities: `export default getSortedPosts;`, `export default postFilter;`, `export default getUniqueTags;`
- Named exports for multiple related items: `export const slugifyStr = (...); export const slugifyAll = (...);`
- Used consistently with how utilities are imported: `import getSortedPosts from "./getSortedPosts";`

**Barrel Files:**
- Not heavily used
- Main imports use direct paths: `import { SITE } from "@/config"` rather than barrel imports
- Configuration exports from single files: `config.ts`, `constants.ts`, `content.config.ts`

**Type Exports:**
- Types defined in same file as usage: `type Props = { ... };` in Astro components
- Shared types in dedicated files: `interface Social { ... }` in `constants.ts`
- Astro content collection types imported from `astro:content`

## Astro-Specific Patterns

**Component Props:**
- Typed with `type Props` interface
- Destructured in component frontmatter: `const { tag, tagName, size = "lg" } = Astro.props;`
- Support spread with `HTMLAttributes`: `type Props = { disabled?: boolean } & HTMLAttributes<"a">;`

**Class Lists:**
- Using Astro's `class:list` directive for conditional classes
- Supports objects for conditional classes: `{ "text-sm": size === "sm" }`
- Supports arrays for combining multiple classes
- Example from `Tag.astro`:
```typescript
class:list={[
  "flex items-center gap-0.5",
  "border-b-2 border-dashed border-foreground",
  "hover:-mt-0.5 hover:border-accent hover:text-accent",
  "focus-visible:border-none focus-visible:text-accent",
  { "text-sm": size === "sm" },
  { "text-lg": size === "lg" },
]}
```

**Layout Composition:**
- Layouts wrap content and provide structure
- Layouts in `src/layouts/`: `Layout.astro`, `Main.astro`, `PostDetails.astro`, `AboutLayout.astro`
- Child content accessed via `<slot />`

---

*Convention analysis: 2026-03-10*
