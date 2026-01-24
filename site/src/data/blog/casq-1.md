---
author: Björn Roberg, GPT-5.1
pubDatetime: 2026-01-22T13:00:00Z
modDatetime: 2026-01-22T13:00:00Z
title: Uinsg casq in CI
slug: using-casq-in-ci
featured: true
draft: false
tags:
  - tool
  - computing
  - ci_cd
description: Content addressable storage for improved CI
---

## Example CI Pipeline Using `casq`

```
> casq
Content-addressed file store using BLAKE3

Usage: casq [OPTIONS] <COMMAND>

Commands:
  init         Initialize a new store
  add          Add files or directories to the store
  materialize  Materialize an object to the filesystem
  cat          Output blob content to stdout
  ls           List tree contents or show blob info (lists refs if no hash given)
  stat         Show object metadata
  gc           Garbage collect unreferenced objects
  orphans      Find orphaned tree roots (unreferenced trees)
  journal      View operation journal
  refs         Manage references
  help         Print this message or the help of the given subcommand(s)

Options:
  -r, --root <ROOT>  Store root directory (defaults to CASQ_ROOT env var or ./casq-store)
      --json         Output results as JSON
  -h, --help         Print help
  -V, --version      Print version
```

Suppose there's a shared `CASQ_DIR` on the CI runner (or persistent volume).

### High-Level Flow

1. Compute **input hashes** for:
   - Source tree
   - Dependency lockfile(s)
   - Toolchain config (e.g. `.mise.toml`)
2. Derive **build cache key** = hash of those three hashes.
3. If `casq` already has that build tree:
   - Restore build artifacts from `casq`.
   - Skip compilation.
4. Otherwise:
   - Build normally.
   - Store resulting build tree into `casq`.
5. Do the same pattern for **tests** and **packaging**.
6. Periodically run `casq gc`.

---

## Concrete GitHub Actions–Style Example

### 1. Setup job: compute hashes, restore cached trees if possible

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:

env:
  CASQ_DIR: .casq-store

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install casq
        run: |
          curl -L https://TBD/casq-linux-amd64 -o /usr/local/bin/casq
          chmod +x /usr/local/bin/casq

      - name: Prepare casq dir
        run: mkdir -p "$CASQ_DIR"

      - name: Compute input hashes
        id: hashes
        run: |
          SRC_HASH=$(casq add src)
          DEPS_HASH=$(casq add package-lock.json)      # or Cargo.lock, go.sum, etc.
          TOOLCHAIN_HASH=$(casq add mise.toml)         # e.g. .nvmrc, .tool-versions, etc.

          echo "src_hash=$SRC_HASH"             >> $GITHUB_OUTPUT
          echo "deps_hash=$DEPS_HASH"           >> $GITHUB_OUTPUT
          echo "toolchain_hash=$TOOLCHAIN_HASH" >> $GITHUB_OUTPUT

          # Derive a single build key
          echo -e "$SRC_HASH\n$DEPS_HASH\n$TOOLCHAIN_HASH" > build-inputs.txt
          BUILD_KEY=$(blake3 build-inputs.txt | cut -d ' ' -f 1)
          echo "build_key=$BUILD_KEY" >> $GITHUB_OUTPUT
```

Here `src_hash`, `deps_hash`, `toolchain_hash` are all **content-addressed snapshots** in `casq`, and `build_key` is the deterministic build cache key.

---

### 2. Build step with `casq`-backed cache

```yaml
      - name: Try restore build from casq
        id: restore-build
        run: |
          if casq stat "${{ steps.hashes.outputs.build_key }}"; then
            echo "cache_hit=true" >> $GITHUB_OUTPUT
            casq materialize "${{ steps.hashes.outputs.build_key }}" build
          else
            echo "cache_hit=false" >> $GITHUB_OUTPUT
          fi

      - name: Build
        if: steps.restore-build.outputs.cache_hit == 'false'
        run: |
          mkdir -p build
          npm ci
          npm run build -- --out-dir build

          # Store build output tree addressed by build_key
          BUILD_TREE_HASH=$(casq add build --ref-name "${{ steps.hashes.outputs.build_key }}")
```

---

### 3. Test step cached by input + build tree

```yaml
      - name: Compute test key
        id: test-key
        run: |
          # Test key can depend on src, deps, toolchain, and build tree
          BUILD_TREE_HASH=$(casq add build)
          echo -e "${{ steps.hashes.outputs.src_hash }}\n${{ steps.hashes.outputs.deps_hash }}\n${{ steps.hashes.outputs.toolchain_hash }}\n$BUILD_TREE_HASH" > test-inputs.txt
          TEST_KEY=$(blake3 test-inputs.txt | cut -d ' ' -f 1)
          echo "test_key=$TEST_KEY" >> $GITHUB_OUTPUT

      - name: Try reuse test results from casq
        id: restore-test
        run: |
          if casq stat "${{ steps.test-key.outputs.test_key }}"; then
            echo "test_cache_hit=true" >> $GITHUB_OUTPUT
            casq materialize "${{ steps.test-key.outputs.test_key }}" test-results
          else
            echo "test_cache_hit=false" >> $GITHUB_OUTPUT
          fi

      - name: Run tests
        if: steps.restore-test.outputs.test_cache_hit == 'false'
        run: |
          npm test -- --reporter junit --reporter-options mochaFile=test-results/results.xml
          casq add test-results --ref-name "test-${{ steps.test-key.outputs.test_key }}"
```

This lets you **skip tests entirely** if both inputs *and* build output are unchanged.

---

### Periodic GC Job (optional scheduled workflow)

```yaml
on:
  schedule:
    - cron: '0 3 * * *'  # daily

jobs:
  casq-gc:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout infra repo with roots file
        uses: actions/checkout@v4

      - name: Install casq
        run: |
          curl -L https://example.com/casq-linux-amd64 -o /usr/local/bin/casq
          chmod +x /usr/local/bin/casq

      - name: Run GC
        env:
          CASQ_DIR: .casq-store
        run: |
          casq gc
```

---

## Why this makes good use of `casq`

- **Stable content hashes** for:
  - Source, dependencies, toolchain
  - Build output trees
  - Test results
- **Cross-branch, cross-job caching** without relying on CI’s proprietary cache keys.
- Can be reused by **local dev tooling** (same `casq` store on developer machines) so local builds/tests and CI share artifacts.
- CI remains simple: generic `add` / `materialize` / `stat` + your own keys and policies on top.

