---
author: Björn Roberg, Claude Opus 4.6
pubDatetime: 2026-03-21T12:00:00Z
title: "Introducing slog: structured logging for every JS runtime"
slug: introducing-slog
featured: false
draft: false
tags:
  - open-source
  - typescript
  - developer-tools
description: "slog is a zero-dependency structured logger for Node.js, Deno, Bun, and Cloudflare Workers with pluggable transports and a Hono waitUntil middleware."
---

## The Problem with console.log

You start with `console.log`. Then you need structured fields so your log aggregator can index them, so you switch to `JSON.stringify`. Then you need request-scoped context, so you thread a logger through your handlers. Then you need to redact sensitive fields before they hit the wire. Then you realize your logging library pulls in half of npm.

slog is a structured logger that does all of this in under 300 lines with zero runtime dependencies. It works on Cloudflare Workers, Node.js, Deno, and Bun.

---

## Design Decisions

Three constraints shaped the API:

1. **Data in, not strings** — every log call takes an object, not a format string. `log.info({ message: 'started', port: 3000 })` produces JSON that machines can parse without regex.

2. **Plugins transform, transports deliver** — plugins are pure functions that transform or drop log entries before they reach any transport. Transports handle I/O. This separation means you can redact fields, enrich entries, and filter levels without touching transport code.

3. **Buffer and flush** — entries accumulate in an internal buffer until you call `flush()`. This matters on Cloudflare Workers where you want to batch-send logs in `waitUntil` instead of blocking the response.

---

## Quick Start

```typescript
import { createLogger, createConsoleTransport } from '@bjro/slog';

const log = createLogger({
  transports: [createConsoleTransport()],
});

log.info({ message: 'server started', port: 3000 });
// => {"level":"info","message":"server started","port":3000}
```

`createLogger()` with no arguments works too — you just won't get any output until you add a transport.

### Child Loggers

```typescript
const reqLog = log.withContext({ requestId: 'abc123', userId: 42 });
reqLog.info({ message: 'user action', action: 'login' });
// => {"level":"info","requestId":"abc123","userId":42,"action":"login","message":"user action"}
```

`withContext` returns a new logger that inherits the parent's plugins and transports but merges in additional context fields. The context is frozen — no accidental mutation across requests.

---

## Transports

Four built-in transports cover the common cases:

| Transport | What it does |
|-----------|-------------|
| `createConsoleTransport()` | JSON to stdout |
| `createPrettyTransport()` | Human-readable `INFO  server started  port=3000` |
| `createHttpBatchTransport(config)` | Batched HTTP POST to a log ingest endpoint |
| `createRoutedTransport(routes)` | Route entries to different transports by level |

The routed transport is where it gets interesting — you can send errors to an HTTP endpoint while keeping debug output local:

```typescript
import {
  createRoutedTransport,
  createConsoleTransport,
  createHttpBatchTransport,
  atOrAboveLevel,
  belowLevel,
} from '@bjro/slog';

const transport = createRoutedTransport([
  { match: belowLevel('error'), transport: createConsoleTransport() },
  { match: atOrAboveLevel('error'), transport: createHttpBatchTransport({ url: '...' }) },
]);
```

Writing a custom transport is two methods: `write(entry)` and `flush()`.

---

## Plugins

Plugins are `{ name, transform }` objects. The `transform` function receives a `LogEntry` and returns a transformed entry or `null` to drop it.

```typescript
import {
  createLogger,
  createConsoleTransport,
  errorSerializer,
  createRedactPlugin,
  createLevelFilterPlugin,
} from '@bjro/slog';

const log = createLogger({
  transports: [createConsoleTransport()],
  plugins: [
    errorSerializer,                           // serialize Error → { message, stack }
    createRedactPlugin(['password', 'token']),  // replace values with [REDACTED]
    createLevelFilterPlugin('warn'),            // drop entries below warn
  ],
});
```

Plugins run in order. If one returns `null`, the pipeline stops and the entry is not buffered. If a plugin throws, slog logs a warning and passes the original entry through — a broken plugin should not silence your logs.

---

## Hono Integration

This is the part I built slog for. On Cloudflare Workers with Hono, you want request-scoped loggers that flush without blocking the response:

```typescript
import { createLogger, createHttpBatchTransport } from '@bjro/slog';
import { slogMiddleware } from '@bjro/slog/hono';

const logger = createLogger({
  transports: [createHttpBatchTransport({ url: 'https://logs.example.com/ingest' })],
});

const app = new Hono();
app.use('*', slogMiddleware(logger));

app.get('/', (c) => {
  const log = c.get('logger'); // request-scoped, has requestId/method/path
  log.info({ message: 'handling request' });
  return c.text('OK');
});
```

The middleware:

- Creates a child logger per request with `requestId`, `method`, `path`, and `userAgent` in context
- Logs request completion with `status` and `duration` after the handler runs
- Detects Cloudflare Workers via `getRuntimeKey()` and uses `waitUntil` for non-blocking flush
- Falls back to `await flush()` on other runtimes

---

## The Internals

The whole thing is about 300 lines across six files. The core loop:

1. **Level gate** — `LOG_LEVELS[level] < LOG_LEVELS[this.minLevel]` returns early before any allocation
2. **Entry construction** — destructure `message` from the data object, build a `LogEntry` with `level`, `timestamp`, `message`, `context`, and remaining `data`
3. **Plugin pipeline** — run each plugin's `transform` in sequence; `null` drops the entry
4. **Buffer** — surviving entries go into an array
5. **Flush** — `flush()` splices the buffer, writes each entry to each transport, then calls `transport.flush()`

No async in the hot path. The only `Promise` is in `flush()`.

---

## Install

```sh
# npm
npm install @bjro/slog

# JSR
jsr add @bjro/slog
```

Published on both [npm](https://www.npmjs.com/package/@bjro/slog) and [JSR](https://jsr.io/@bjro/slog). TypeScript source ships directly — no build step, no generated declaration files.

---

slog is open source under Apache 2.0. Check out the [repository on GitHub](https://github.com/roobie/slog).
