# Testing Patterns

**Analysis Date:** 2026-03-10

## Test Framework

**Status:** Not implemented

This codebase does not currently have automated tests. There are:
- No test files (`.test.ts`, `.spec.ts`)
- No test framework configured (Jest, Vitest, etc.)
- No test commands in `package.json`
- No test configuration files

## Current Testing Approach

**Build-time Validation:**
- TypeScript strict mode via `astro/tsconfigs/strict` in `tsconfig.json`
- ESLint with Astro and TypeScript support catches code quality issues
- Prettier enforces code formatting consistency

**Runtime Validation:**
- Schema validation using Zod in content collection configuration (`content.config.ts`)
- Example from `content.config.ts`:
```typescript
const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});
```

## Recommended Testing Setup

**Framework Recommendation:**
For a static site generator like Astro, consider:
- **Vitest** - Fast, modern, ESM-native test runner
- **Jest** - More mature, larger ecosystem, better for component testing
- **Astro Testing** - Use `@astrojs/check` (already installed) for component type checking

**Commands to Add to package.json:**
```json
{
  "test": "vitest",
  "test:watch": "vitest --watch",
  "test:coverage": "vitest --coverage"
}
```

## Testable Modules

**High Priority (Core Logic):**
- `src/utils/getSortedPosts.ts` - Sorting and filtering logic
- `src/utils/postFilter.ts` - Publication state and draft filtering
- `src/utils/getPostsByTag.ts` - Tag-based post retrieval
- `src/utils/getUniqueTags.ts` - Unique tag extraction and deduplication
- `src/utils/slugify.ts` - String slugification with non-Latin character support
- `src/utils/getPostsByGroupCondition.ts` - Generic grouping logic

**Medium Priority (Integration):**
- `src/utils/getPath.ts` - Path construction from blog post metadata
- `src/utils/generateOgImages.ts` - OG image generation
- Content schema in `src/content.config.ts`

**Low Priority (UI Components):**
- `src/components/*` - Astro components with heavy template logic would require component testing
- `src/scripts/theme.ts` - DOM manipulation and browser APIs

## Testing Patterns (Once Implemented)

**Unit Test Structure:**
Example test pattern for `getSortedPosts.ts`:
```typescript
import { describe, it, expect } from "vitest";
import getSortedPosts from "@/utils/getSortedPosts";
import type { CollectionEntry } from "astro:content";

describe("getSortedPosts", () => {
  it("should sort posts by modification date in descending order", () => {
    // Arrange
    const posts = [
      { data: { modDatetime: new Date("2025-01-01"), pubDatetime: new Date("2024-12-01") } },
      { data: { modDatetime: null, pubDatetime: new Date("2025-01-15") } },
    ] as CollectionEntry<"blog">[];

    // Act
    const sorted = getSortedPosts(posts);

    // Assert
    expect(sorted[0].data.pubDatetime).toEqual(new Date("2025-01-15"));
  });

  it("should filter draft posts", () => {
    // Test the postFilter behavior
  });
});
```

**Mocking Strategy:**
- Mock Astro content collection with test fixtures
- Mock external APIs (Google Fonts, SVG rendering)
- Use dependency injection for utilities that fetch data

Example mocking approach:
```typescript
// Mock date-dependent logic
const NOW = new Date("2025-03-10");
vi.useFakeTimers();
vi.setSystemTime(NOW);

// Mock fetch for font loading
vi.stubGlobal("fetch", vi.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve("..."),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  })
);
```

## Test Coverage Recommendations

**Critical Paths to Test:**
1. **Post Filtering** - Ensure draft posts and scheduled posts behave correctly
2. **Sorting** - Verify modification dates take precedence over publish dates
3. **Tag Extraction** - Ensure unique tags and deduplication work
4. **Path Generation** - Test nested blog post paths with proper slug conversion
5. **Slugification** - Test Latin and non-Latin character handling

**Test Data:**
Create fixtures in `src/__tests__/fixtures/`:
```typescript
// src/__tests__/fixtures/posts.ts
export const mockPosts: CollectionEntry<"blog">[] = [
  {
    id: "test-post",
    slug: "test-post",
    collection: "blog",
    data: {
      title: "Test Post",
      pubDatetime: new Date("2025-01-01"),
      description: "A test post",
      tags: ["test"],
    },
    filePath: "src/data/blog/test-post.md",
  },
  // ... more fixtures
];
```

## Validation Already in Place

**TypeScript:**
- Strict mode enabled via `astro/tsconfigs/strict`
- Path aliases configured
- JSX/TSX support with React imports

**Linting:**
- ESLint rule `"no-console": "error"` catches accidental logging
- Astro linting plugin checks component patterns
- TypeScript ESLint catches type mismatches

**Build-time Checks:**
- `astro check` command runs before build
- Content schema validation via Zod
- Type checking on all `.ts` and `.astro` files

## Future Testing Roadmap

**Phase 1: Foundation**
1. Set up Vitest as test runner
2. Add test scripts to package.json
3. Create test setup file with common utilities

**Phase 2: Core Logic**
1. Test all utility functions in `src/utils/`
2. Focus on getSortedPosts, postFilter, getUniqueTags
3. Achieve 80%+ coverage on utilities

**Phase 3: Integration**
1. Test content schema validation
2. Test path generation with various blog structure patterns
3. Test OG image generation

**Phase 4: Components**
1. Set up Astro component testing (may require additional tooling)
2. Test critical layout components
3. Test interactive components like theme switching

---

*Testing analysis: 2026-03-10*
