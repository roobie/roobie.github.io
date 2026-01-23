Here’s one concrete, end‑to‑end use case for `casq`:

## Example: Deduplicated Local Snapshots of a Project

You want to keep regular snapshots of a project directory (`~/projects/myapp`) so you can:

- Roll back to older states.
- Avoid wasting disk on unchanged files.
- Keep everything local and simple.

### 1. Initialize a store

```bash
mkdir -p ~/.casq-store
cd ~/.casq-store
casq init
```

This creates a `.casq` store in `~/.casq-store`.

### 2. Take your first snapshot

```bash
casq add ~/projects/myapp --ref-name myapp-2026-01-23
```

- `casq` walks the tree, hashes every file (BLAKE3), and stores blobs/trees.
- The ref `myapp-2026-01-23` points to the root tree hash.

List refs:

```bash
casq ls
# myapp-2026-01-23 -> <root-hash-1>
```

### 3. Take another snapshot later

After some days of development:

```bash
casq add ~/projects/myapp --ref-name myapp-2026-02-01
casq ls
# myapp-2026-01-23 -> <root-hash-1>
# myapp-2026-02-01 -> <root-hash-2>
```

Only changed files get new blobs; everything unchanged is deduplicated automatically.

### 4. Restore an old snapshot

Suppose you need to recover the exact state from January 23:

```bash
casq materialize myapp-2026-01-23 ~/restore/myapp-2026-01-23
```

You now have a full copy of the project as it was on that date.

### 5. Drop old snapshots and reclaim space

If you decide the oldest snapshot is no longer needed:

```bash
# Delete the ref (for example, via small helper script or manually)
casq ls   # note the hash for myapp-2026-01-23
# remove the ref file if refs are stored as files, or use a future `casq rm-ref` command if available

# Then run garbage collection
casq gc --dry-run   # see what would be removed
casq gc             # actually delete unreferenced blobs/trees
```

Now the store keeps only data reachable from remaining refs (e.g., `myapp-2026-02-01`), and you’ve reclaimed space without thinking about individual files—just which snapshot refs you still care about.

## Why not just use git?

Because `git` is a full version control system with a lot of behavior you don’t want if all you need is “store arbitrary trees of files by hash and get them back.”

### Key differences in practice

**1. You want a generic content store, not a repo**

- `git` assumes: working tree, index, branches, commits, remotes.
- `casq` assumes: blobs, trees, refs → that’s it.
- With `git` you’re always “in a repo”; with `casq` you can treat it like a generic, reusable cache/snapshot store for many projects.

**2. No history, branching, or merge semantics**

- `git` is built around commits and merges.
- `casq` doesn’t know about time, history, or merges—just objects and reachability.
- For build caches, artifact registries, experiment stores, etc., commit/merge logic is just extra complexity.

**3. Simpler mental model for tools**

- `git` has staging, ignored files, line-ending rules, attributes, hooks, etc.
- `casq` just ingests a directory as-is, hashes files, and stores them.
- Tools embedding `casq_core` don’t need to learn or re‑implement Git plumbing; they get a small API that does only CAS.

**4. Different ergonomics for automation**

- Using `git` as a cache/backend usually means:
  - creating repos,
  - committing trees,
  - dealing with .gitignore, user config, hooks, etc.
- With `casq`:
  - `casq add path --ref-name foo`
  - `casq materialize ref ./out`
  - plus a clear GC story via mark & sweep.

**5. Local-only, single-purpose by design**

- `git` is built for distributed workflows, remotes, and collaboration.
- `casq` is intentionally **local-only**, **single-user**, and focused on:
  - deduped snapshots,
  - build and data caches,
  - “store by hash, restore by hash.”

If you’re tracking source code history with branches and collaboration, use `git`. If you want a small, embeddable, content-addressed storage engine or a simple local snapshot/cache backend, `casq` gives you that without Git’s version-control machinery.
