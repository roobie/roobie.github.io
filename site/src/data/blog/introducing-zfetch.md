---
author: Björn Roberg, Claude Opus 4.6
pubDatetime: 2026-03-21T14:00:00Z
title: "Introducing zfetch: a minimal HTTP client in Zig"
slug: introducing-zfetch
featured: false
draft: true
tags:
  - project
  - tool
  - computing
description: zfetch is a small, security-first HTTP/HTTPS client written in Zig. Single static binary, no runtime dependencies, streaming responses, and curl-compatible exit codes.
---

## Why Another HTTP Client

curl is the universal tool, but it is also 160,000+ lines of C with a dependency tree that includes OpenSSL, nghttp2, libidn2, zlib, and more. If you want a statically-linked HTTP client for a container, an embedded system, or a locked-down CI runner, you pay for a lot of surface area you do not use.

zfetch is a focused alternative. It does HTTP/1.1 over TLS with strict defaults, streams response bodies without buffering, and compiles to a single static binary with vendored BoringSSL. No dynamic linking, no runtime dependencies.

---

## Design Decisions

Four constraints shaped the implementation:

1. **Streaming by default** — response bodies are written directly to a sink (stdout, file, or custom writer) in 16 KiB chunks. There is no intermediate buffer holding the entire response in memory. This matters when fetching large artifacts in memory-constrained environments.

2. **Allocator-explicit API** — all allocation is caller-supplied. The library never calls a global allocator. This makes it usable in contexts where you need to track, limit, or replace allocation — arenas, fixed-size buffers, or instrumented allocators for leak detection.

3. **Security-first defaults** — TLS 1.2 minimum, hostname verification on, header injection prevention (CRLF validation on user-supplied headers), and automatic stripping of sensitive headers (`Authorization`, `Cookie`, `Proxy-Authorization`) on cross-host redirects.

4. **Curl-compatible exit codes** — scripts that check `$?` after curl can switch to zfetch without changing error handling. DNS failure is 6, connect failure is 7, timeout is 28, TLS error is 35, HTTP error with `--fail` is 22.

---

## CLI Usage

The flags follow curl conventions where they overlap:

```bash
# Simple GET
zfetch https://example.com

# POST with JSON body
zfetch -d '{"key":"val"}' -H 'Content-Type: application/json' https://api.example.com

# PUT from stdin
echo '{"data":1}' | zfetch -X PUT -d @- https://api.example.com/resource

# Save to file
zfetch -o output.html https://example.com

# HEAD request
zfetch -I https://example.com

# Include response headers in output
zfetch -i https://example.com

# Fail on HTTP errors (exit 22)
zfetch --fail https://api.example.com/missing

# Timeouts
zfetch --connect-timeout 5 --max-time 30 https://slow.example.com

# Verbose mode (TLS diagnostics)
zfetch -v https://example.com
```

---

## Library Usage

zfetch is also an embeddable Zig module:

```zig
const std = @import("std");
const zfetch = @import("zfetch");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var client = zfetch.Client.init(allocator, .{
        .verbose = true,
        .tls_verify = true,
        .follow_redirects = true,
    });
    defer client.deinit();

    var response = client.fetch(
        "https://example.com",
        std.io.getStdOut(),
    ) catch |err| {
        std.debug.print("error: {s}\n", .{zfetch.errorMessage(err)});
        return;
    };
    defer response.deinit(allocator);
}
```

The `Client` struct is stateless — it holds configuration but no persistent connections. Each `fetch` call resolves DNS, connects, performs the TLS handshake, sends the request, and streams the response. This keeps the API simple and avoids connection-pool lifetime questions.

---

## Protocol Limits

zfetch enforces tight bounds on all protocol elements to minimize attack surface:

| Element | Limit |
|---------|-------|
| URL length | 8 KiB |
| Status line | 1 KiB |
| Single header line | 8 KiB |
| Total headers | 64 KiB |
| Header count | 200 |
| Response body | 256 MiB (configurable) |

Anything that exceeds these limits fails immediately rather than allocating unbounded memory. This is a deliberate choice — zfetch is not a general-purpose download manager.

---

## The Internals

The codebase is about 2,500 lines of Zig across a handful of modules:

- **url.zig** — HTTP/HTTPS URL parser with validation
- **http/request.zig** — HTTP/1.1 request composition with header sanitization
- **http/response.zig** — status line and header parsing, wire format output
- **http/body.zig** — three body readers (fixed-length, chunked with trailer support, EOF-delimited), all streaming to sink
- **net/dial.zig** — TCP connection with non-blocking connect and per-address timeout, multi-address DNS fallback
- **tls/** — BoringSSL adapter with TLS 1.2+ enforcement and hostname verification
- **cli.zig** — argument parser with 60+ unit tests, no process dependencies
- **errors.zig** — error taxonomy mapping to curl-compatible exit codes
- **timeouts.zig** — idle and overall timeout tracking on all I/O

The HTTP body readers are worth highlighting. All three modes (Content-Length, chunked, and read-until-close) share the same streaming pattern: read into a 16 KiB stack buffer, write to the sink, check body size against the limit, check the timeout. No heap allocation in the response body path.

---

## What It Does Not Do

zfetch intentionally omits:

- HTTP/2 and HTTP/3
- Connection pooling or keep-alive
- Cookie jars
- Multipart form uploads
- Proxy support
- Decompression (gzip, brotli)

These are all reasonable features, but each one adds complexity and attack surface. zfetch is for the use case where you need a reliable, auditable, single-purpose HTTP client — not a full-featured browser engine.

---

## Status

zfetch is at roughly 85% of v1. The core HTTP/TLS pipeline, CLI, and test suite are done. Remaining work is integration test hardening, memory-safety validation (valgrind/ASan), and CI.

The source is available on [GitHub](https://github.com/roobie/zfetch).
