---
author: Björn Roberg, Claude Opus 4.6
pubDatetime: 2026-03-18T12:00:00Z
title: "Show HN: Cairn — append-only SQLite event store, immutability enforced by triggers"
slug: introducing-cairn
featured: false
draft: false
tags:
  - open-source
  - developer-tools
  - software-architecture
description: "cairn is an append-only SQLite event store where immutability is enforced by triggers, not convention. Go, TypeScript, and Rust SDKs share one test spec."
---

## The Constraint Is the Feature

Most event stores give you append-only semantics as a **convention**. Cairn enforces it at the **storage layer**. SQLite `BEFORE UPDATE` and `BEFORE DELETE` triggers make it structurally impossible to modify or remove an event — SQLite itself rejects mutations, even from a direct `sqlite3` shell connection.

Convention-based immutability breaks the moment someone runs an ad-hoc `UPDATE` or `DELETE` against the database. For audit logs, telemetry, and event trails, that's unacceptable.

Cairn's approach:

- **Triggers, not API guards** — the database rejects mutations. See the next section for how bypass attempts are handled.
- **Zero configuration** — `Open("events.db")` is the only entry point. WAL mode, busy timeout, and the schema DDL are applied automatically.
- **One file** — a single SQLite database. No external services, no network, no daemon. Copy the file and you have a backup.

## Why Triggers Can't Be Bypassed (and Where the Boundary Is)

Triggers live in `sqlite_schema`. A sophisticated attacker might try:

```sql
PRAGMA writable_schema = ON;
DELETE FROM sqlite_schema WHERE name = 'no_update';
```

To block this on cairn's own connections, the TypeScript and Rust SDKs set `SQLITE_DBCONFIG_DEFENSIVE` during `Open` — SQLite then refuses `PRAGMA writable_schema = ON` for the life of that connection. (The Go SDK uses the pure-Go `modernc.org/sqlite` driver, which doesn't expose the `sqlite3_db_config` call; it falls back to `PRAGMA trusted_schema = OFF`. Switching to a CGo driver would fix that but break the pure-Go, cross-compile property, so we haven't.)

Here's the honest part. **Defensive mode only applies to connections cairn opens.** Anyone who can read the database file can open their own `sqlite3` connection without defensive set, and the `writable_schema` trick will work. The real security boundary is therefore filesystem access — not a pragma. Cairn is a database, not a vault. Use OS permissions, disk encryption, or an append-only filesystem mount if your threat model requires it.

What triggers **do** guarantee, unconditionally: any connection that respects SQLite's schema will be rejected when issuing `UPDATE` or `DELETE` against `events`. Accidental modification, application bugs, ad-hoc SQL from ops, ORM misconfiguration — all of that is covered. The deliberate-attacker-with-filesystem-access case is not, and no user-space database can cover it.

---

## How It Works

The entire schema is four statements:

```sql
CREATE TABLE IF NOT EXISTS events (
    id      INTEGER PRIMARY KEY,
    topic   TEXT    NOT NULL,
    ts      INTEGER NOT NULL,
    payload BLOB    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_topic_ts ON events (topic, ts);

CREATE TRIGGER IF NOT EXISTS no_update
    BEFORE UPDATE ON events
BEGIN
    SELECT RAISE(ABORT, 'cairn: updates not allowed');
END;

CREATE TRIGGER IF NOT EXISTS no_delete
    BEFORE DELETE ON events
BEGIN
    SELECT RAISE(ABORT, 'cairn: deletes not allowed');
END;
```

Every SDK executes this DDL verbatim on `Open`. The `IF NOT EXISTS` clauses make it idempotent — opening an existing database is the same code path as creating a new one.

Timestamps are **nanoseconds since Unix epoch** stored as `INTEGER`. Payloads are opaque `BLOB` — cairn stores bytes, the caller owns the schema.

---

## Quickstart

### Go

```go
store, _ := cairn.Open("events.db")
defer store.Close()
id, _ := store.Append("sensor.temp", []byte(`{"value": 22.5}`))
events, _ := store.Query("sensor.temp", 0, time.Now().UnixNano())
```

Pure Go via `modernc.org/sqlite` — no CGo, cross-compiles without a C toolchain.

### TypeScript

```typescript
const store = open('events.db')
const id = store.append('sensor.temp', Buffer.from('{"value": 22.5}'))
const events = store.query('sensor.temp', 0n, BigInt(Date.now()) * 1_000_000n)
store.close()
```

All timestamps and event IDs are `bigint` — nanosecond values exceed `Number.MAX_SAFE_INTEGER`. Dual ESM/CJS build via tsdown.

### Rust

```rust
let mut store = cairn::open("events.db")?;
let id = store.append("sensor.temp", b"{\"value\": 22.5}")?;
let events = store.query("sensor.temp", 0, i64::MAX)?;
store.close()?; // or let Drop handle it
```

Bundled SQLite via `rusqlite` — no system SQLite dependency. `Drop` runs a WAL checkpoint automatically.

---

## The API

| Operation      | What it does                                              |
|----------------|-----------------------------------------------------------|
| `Open`         | Open or create a database; apply schema and PRAGMAs       |
| `Close`        | Checkpoint WAL and close; idempotent                      |
| `Append`       | Insert one event; return its `EventID`                    |
| `AppendBatch`  | Insert multiple events atomically (all-or-nothing)        |
| `Query`        | Return events for a topic in a `[start, end]` time range  |

The API surface is deliberately minimal — cairn is storage, not an analytics engine.

---

## Why Not X?

**vs. Litestream** — Litestream replicates any SQLite database to object storage. It's orthogonal: Litestream answers "how do I back this up live?", cairn answers "how do I prevent mutation?" Compose them: cairn + Litestream = append-only + continuously replicated.

**vs. journald / syslog** — Great for host-local text lines. No SDK for structured binary payloads, no portable single-file format, no cross-language contract, no point-in-time range queries. Cairn is what you reach for when log lines aren't enough.

**vs. INSERT-only by convention** — That's exactly the thing cairn replaces. "Everyone on the team agreed we'd only `INSERT` into this table" survives exactly until the first `sqlite3 events.db 'UPDATE ...'` — which might be a well-intentioned one-off fix at 2 a.m. Triggers make the convention load-bearing.

## Performance

Benchmarks run on a **Raspberry Pi 3 Model B** (armv7, 4 cores, 1 GB RAM, Class 10 SD card), Go SDK, 128-byte event payload, WAL mode with SQLite's default `synchronous = NORMAL` (fsync per commit on the WAL, lazy fsync on the main DB at checkpoint):

| Operation                    | Throughput       | Notes                            |
|------------------------------|------------------|----------------------------------|
| `Append` (single event)      | ~98 events/sec   | SD-card fsync bound (~10 ms/op)  |
| `AppendBatch` (100 events)   | ~2,800 events/sec | One fsync amortized over batch   |
| `Query` (scan 100k events)   | ~27,000 events/sec | ~370 µs per row scanned        |

The headline: **batch your appends if you care about throughput.** Single `Append` is fine for low-rate audit events where durability per-event matters more than rate. `AppendBatch` trades "lose up to N events on crash" for 28× throughput. Pick per workload.

A Pi 3 over SD is a deliberately pessimistic floor. On a modern laptop NVMe, single `Append` scales roughly with fsync latency (~400× faster in my testing); `AppendBatch` gains less (~30×, fsync already amortized); `Query` gains the least (~1.3×, it's CPU-bound row scanning, not I/O). Benchmarks are reproducible:

```bash
cd cairn/go && go test -bench=. -benchtime=3s -run=^$
```

## When to Use Cairn

| Use case                      | Why cairn fits                                                 |
|-------------------------------|----------------------------------------------------------------|
| **Audit logs**                | Immutability is a legal requirement, not a preference          |
| **IoT / edge telemetry**      | Single-file SQLite works on embedded devices; no daemon needed |
| **Application event trails**  | Structured event sourcing without the infrastructure overhead  |
| **Local-first event buffers** | Collect events offline, ship the file later                    |

## What Cairn Is Not

- **Not a message broker** — no pub/sub, no consumer groups. Cairn is storage.
- **Not an analytics engine** — time-range queries only. Export to OLAP for aggregations.
- **Not multi-writer** — SQLite WAL is single-writer. Covers the target personas above.
- **Not a network service** — no HTTP, no gRPC. Embed the SDK directly.

---

## Cross-Language Contract

All three SDKs implement against a single [API spec](https://github.com/roobie/cairn/blob/main/spec/api.md) and share 21 test vectors covering append, batch, query, and immutability rejection. The spec defines error names (`PayloadTooLarge`, `EmptyTopic`, etc.) that each language maps to its idiomatic form:

| Spec                    | Go                         | TypeScript                           | Rust                           |
|-------------------------|----------------------------|--------------------------------------|--------------------------------|
| `PayloadTooLarge`       | `ErrPayloadTooLarge`       | `.kind === 'payload_too_large'`      | `Error::PayloadTooLarge`       |
| `ImmutabilityViolation` | `ErrImmutabilityViolation` | `.kind === 'immutability_violation'` | `Error::ImmutabilityViolation` |

---

Cairn is open source. Check out the [repository on GitHub](https://github.com/roobie/cairn).
