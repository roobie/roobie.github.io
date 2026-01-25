---
author: Björn Roberg, GPT-5.1
pubDatetime: 2026-01-22T13:00:00Z
modDatetime: 2026-01-22T13:00:00Z
title: Introducing casq (a simple content-addressable file storage CLI and library)
slug: introducing-casq
featured: true
draft: false
tags:
  - project
  - tool
  - computing
description: casq is a small, no-frills content-addressed file store and Rust library that gives you git-style hashing and deduplication locally, without trying to be a full backup system or version control tool, and is available under the permissive Apache-2.0 license.
---

## Content-Addressed Storage Without the Baggage: Introducing `casq` and `casq_core`

Most developers first encounter content-addressed storage through tools like Git, restic, borg, or container registries. The idea is compelling:

- Identify data by **what it is** (a hash) rather than **where it lives** (a path).
- Automatically deduplicate identical content.
- Make integrity checks and reproducible workflows almost trivial.

But if you’ve ever tried to reuse those systems as a generic content-addressed store, you’ve probably hit friction: complex metadata, network layers, databases, bespoke formats, or “magic” behaviors that are hard to reason about.

`casq` exists for the cases where you want the power of content-addressed storage, **without** everything else.

---

## What Is `casq`?

`casq` is a **minimal content-addressed file store** built on **BLAKE3**, and is available under the permissive [Apache-2.0 license](https://www.apache.org/licenses/LICENSE-2.0). It comes in two parts:

- **`casq`** – a single-binary CLI for storing and retrieving content by hash.
- **`casq_core`** – the Rust library that powers the CLI, designed to be embedded in your own tools.

Think of it as:

- A **lightweight Git object store**, without commits/branches/remotes.
- A **local-only restic backend**, without encryption/compression/servers.
- A **simple CAS engine** you can drop into your own CLIs and apps.

The design goal: **simple, predictable, local-only content-addressed storage** that plays nicely with Unix-y workflows and Rust codebases.

---

## Core Ideas and Design Choices

### 1. Content-Addressed by Default

Everything in `casq` is identified by its **cryptographic hash** (BLAKE3):

- Files → stored as **blobs**.
- Directories → stored as **trees** (references to blobs/other trees).
- Human-readable names → optional **refs** that point at tree hashes.

Once content is in the store, its identity is stable and location-independent. That makes it ideal for build caches, snapshots, and reproducible setups.

### 2. Automatic Deduplication

Because the key is the content hash:

- Identical files, even from different directories or snapshots, are stored **once**.
- Multiple snapshots that share most files only pay for the changed blobs.
- Deduplication is a **side effect** of the addressing scheme, not a separate feature.

### 3. Simple, Local-Only, No Databases

`casq` is intentionally boring in all the right ways:

- **Filesystem-based** layout with sharded directories.
- **No database**, no external services, no network.
- **Streaming I/O** – large files are hashed and stored without whole-file buffering.

This keeps the failure modes understandable and the integration surface small.

### 4. Explicit Garbage Collection

Over time, you’ll ingest many snapshots, builds, or experiment runs. Not all of them will matter forever.

`casq` supports garbage collection with a straightforward **mark & sweep** model:

1. Roots (refs and explicit hashes) are marked.
2. Reachable objects are traversed.
3. Everything else is eligible for deletion.

You can:

```bash
casq collect-garbage --dry-run   # see what would be removed
casq collect-garbage             # actually perform deletion
```

Cleaning up old build caches or snapshots becomes as simple as **dropping a ref** and running GC.

---

## CLI at a Glance

A typical flow looks like this:

```bash
# Initialize a store in the current directory
casq initialize
#>/path/to/store

# Add a directory tree, creating a named reference
HASH=$(casq put myproject/ --reference snapshot-2024-01-21)
#>e4d5d6833b5f1824da0080ca67ae5627b20a5a60a222325e0cc828705bc952b3

# Explore the tree behind a hash
casq list $HASH
#>file-a.txt
#>file-b.txt

# Explore and manage references
casq references list
#>e4d5d6833b5f1824da0080ca67ae5627b20a5a60a222325e0cc828705bc952b3 snapshot-2024-01-21
casq references add $HASH another-name-for-my-data
casq references remove another-name-for-my-data

# Retrieve a single file by hash (prints to stdout)
HASH=$(casq put my-file.txt)
casq get $HASH
#>... the contents of my-file.txt...

# Materialize a whole tree back to the filesystem
casq materialize e4d5d6833b5f1824da0080ca67ae5627b20a5a60a222325e0cc828705bc952b3 ./out

# Tidy up unused objects
casq collect-garbage --dry-run
casq collect-garbage
```

That’s the entire mental model: **initialize → put → list → get/materialize → collect**.

---

## Where `casq` Fits: Concrete Use Cases

### 1. Deterministic Build Caches and Task Runners

If you’re building a custom build system, task runner, or CI helper, you often need:

- A reliable cache keyed by **inputs, not paths**.
- A way to **avoid redoing work** if inputs are unchanged.
- A cache format that can be inspected and debugged.

With `casq`, you can:

- Store compile artifacts, generated code, or test outputs as trees.
- Use input trees’ hashes as cache keys.
- Skip tasks when “this exact input tree” has been processed before.

This gives you Bazel/Nix-style caching behavior, **without** adopting their entire ecosystem.

### 2. Local-Only Backups and Snapshots

For personal machines, dev boxes, or small servers, you might want:

- Quick, deduplicated snapshots of project folders, configs, or documents.
- A “timeline” of states you can roll back to.
- A solution that doesn’t require setting up remote storage or servers.

`casq` lets you periodically:

```bash
casq put ~/projects --reference projects-$(date +%Y-%m-%d)
```

Over time, you build a set of snapshot refs. Old snapshots can be deleted simply by removing refs and running GC, while deduplication ensures you’re not wasting space on unchanged files.

### 3. Content-Addressed Artifact Registry

For ML models, dataset shards, static assets, or compiled binaries, you often want:

- Immutable, addressable artifacts.
- The ability to **pin** exact versions.
- A simple way to verify integrity.

By treating `casq` as a local artifact registry:

- Producers write content and receive **hashes**.
- Consumers are given hashes (or higher-level names that map to hashes).
- Integrity checks reduce to “re-hash and compare.”

No need to design your own CAS format or server.

### 4. Embedded Storage Layer for Apps and CLIs

If you’re building a tool that manages files (notes, wikis, project states, CAD files, etc.), you can treat `casq` as:

- The **append-only, immutable layer** that stores the actual content.
- A backend over which you build your own indices, user-facing names, or timelines.

Your app:

- Stores states as tree hashes.
- Keeps its own mapping: user IDs / labels → hashes.
- Implements undo/redo, time-travel, or diffs by comparing trees.

You get durability and deduplication almost “for free,” and you don’t have to reinvent a content store.

---

## `casq_core`: Embedding CAS in Your Rust Projects

The CLI is powered by **`casq_core`**, a Rust crate that implements:

- The object store layout.
- BLAKE3-based hashing.
- Blob/tree ingestion and retrieval.
- Garbage collection.

It’s designed for:

- Custom build systems.
- Data pipelines.
- Developer tooling and CLIs.
- Domain-specific stores (config histories, notebooks, etc.).

At a high level, you:

1. Open or initialize a store.
2. Ingest directories or file streams.
3. Get back hashes to persist in your own metadata.
4. Later, materialize or stream content by hash.

Because `casq_core` is just a Rust library with a clear, file-based model, it’s easy to reason about and test (the project ships with a substantial unit test suite for the core).

---

## Performance and Tradeoffs

`casq` is intentionally scoped as an MVP for **local, single-user** setups.

### Performance Characteristics

- **BLAKE3 hashing** – fast and cryptographically secure.
- **Streaming I/O** – no need to load whole files into memory.
- **Directory sharding** – avoids filesystem hot-spots on large stores.
- **Automatic deduplication** – less disk churn for repeated content.
- **Compression** – Larger files are automatically compressed using zstd.
- **Chunking** – Larger files are chunked.

### Current Limitations

In exchange for simplicity:

- **Local-only** – no network or remote backends (by design).
- **Single-user** – no concurrency or locking story yet.
- **No encryption** – no encryption - use other tools for that.
- **POSIX-focused** – full permission preservation is POSIX-only.

If you need a multi-tenant backup system with remote, encrypted, deduplicated snapshots, tools like restic or borg are still the right choice. `casq` focuses on being the **simple building block** for local CAS needs.

---

## Getting Started

If you have Rust installed:

```bash
cargo install casq
# make sure $HOME/.cargo/bin is on $PATH
```

After that:

```bash
mkdir my-store
cd my-store
casq initialize

HASH=$(casq put ../some-project --reference first-snapshot)
casq list
casq materialize $HASH ./restored
```

For embedding in your own Rust tools, add `casq_core` to your workspace and wire it into your existing workflows (build caches, artifact stores, snapshot features, etc.).

---

## When You Should Reach for `casq`

Use `casq` (and `casq_core`) when you want:

- Git-like content-addressed storage **without** version-control semantics.
- A simple, inspectable, file-based CAS you can script around.
- A building block for:
  - deterministic build caches,
  - deduplicated local snapshots,
  - content-addressed artifact registries,
  - embedded storage layers for CLIs and apps.

If that sounds like a missing piece in your tooling, `casq` is deliberately small and easy to adopt: start by using the CLI for one workflow, and when that proves useful, pull `casq_core` into your Rust codebase to go further.

- Repository [casq](https://github.com/roobie/casq)
- Crate (CLI) [casq](https://crates.io/crates/casq)
- Crate (library) [casq_core](https://crates.io/crates/casq_core)
