---
author: Björn Roberg, Claude Opus 4.6
pubDatetime: 2026-03-18T12:00:00Z
title: "Introducing cairn: append-only event storage with SQLite"
slug: introducing-cairn
featured: false
draft: true
tags:
  - project
  - tool
  - computing
description: cairn is an append-only event store backed by SQLite where immutability is enforced by triggers, not convention. SDKs for Go, TypeScript, and Rust share one spec and 21 test vectors.
---

## The Constraint Is the Product

Most event stores give you append-only semantics as a **convention**. Cairn enforces it at the **storage layer**. SQLite `BEFORE UPDATE` and `BEFORE DELETE` triggers make it structurally impossible to modify or remove an event — even with a direct SQL connection to the database file.

The name comes from a cairn: a stack of stones used as a trail marker. You add stones, never remove them.

---

## Why Append-Only at the Storage Layer?

Convention-based immutability breaks the moment someone runs an ad-hoc `UPDATE` or `DELETE` against the database. For audit logs, telemetry, and event trails, that's not acceptable.

Cairn's approach:

- **Triggers, not API guards** — the database itself rejects mutations. `PRAGMA defensive` prevents disabling them via `writable_schema`.
- **Zero configuration** — `Open("events.db")` is the only entry point. WAL mode, busy timeout, defensive mode, and the schema DDL are applied automatically.
- **One file** — a single SQLite database. No external services, no network, no daemon. Copy the file and you have a backup.

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

Five operations. That's it.

| Operation      | What it does                                              |
|----------------|-----------------------------------------------------------|
| `Open`         | Open or create a database; apply schema and PRAGMAs       |
| `Close`        | Checkpoint WAL and close; idempotent                      |
| `Append`       | Insert one event; return its `EventID`                    |
| `AppendBatch`  | Insert multiple events atomically (all-or-nothing)        |
| `Query`        | Return events for a topic in a `[start, end]` time range  |

No `Update`. No `Delete`. No `QueryAll`. No pagination. The API surface is deliberately minimal — cairn is storage, not an analytics engine.

---

## When to Use Cairn

| Use case | Why cairn fits |
|----------|---------------|
| **Audit logs** | Immutability is a legal requirement, not a preference |
| **IoT / edge telemetry** | Single-file SQLite works on embedded devices; no daemon needed |
| **Application event trails** | Structured event sourcing without the infrastructure overhead |
| **Local-first event buffers** | Collect events offline, ship the file later |

## What Cairn Is Not

- **Not a message broker** — no pub/sub, no consumer groups. Cairn is storage.
- **Not an analytics engine** — time-range queries only. Export to OLAP for aggregations.
- **Not multi-writer** — SQLite WAL is single-writer. Covers the target personas above.
- **Not a network service** — no HTTP, no gRPC. Embed the SDK directly.

---

## Cross-Language Contract

All three SDKs implement against a single [API spec](https://github.com/roobie/cairn/blob/main/spec/api.md) and share 21 test vectors covering append, batch, query, and immutability rejection. The spec defines error names (`PayloadTooLarge`, `EmptyTopic`, etc.) that each language maps to its idiomatic form:

| Spec | Go | TypeScript | Rust |
|------|----|------------|------|
| `PayloadTooLarge` | `ErrPayloadTooLarge` | `.kind === 'payload_too_large'` | `Error::PayloadTooLarge` |
| `ImmutabilityViolation` | `ErrImmutabilityViolation` | `.kind === 'immutability_violation'` | `Error::ImmutabilityViolation` |

---

Cairn is open source. Check out the [repository on GitHub](https://github.com/roobie/cairn).
