---
author: Björn Roberg
pubDatetime: 2026-04-15T10:00:00Z
title: "Claude Code's Bash tool returns exit 1 with no output? Check /tmp."
slug: claude-code-bash-exit-1-no-output-tmpfs-full
featured: false
draft: false
tags:
  - claude-code
  - debugging
  - linux
  - tmpfs
  - tooling
description: "If Claude Code's Bash tool returns 'Exit code 1' with empty stdout and empty stderr for every command, including `true` and `echo ok`, your /tmp is almost certainly full. Here is the fix."
---

> tl;dr: If Claude Code's Bash tool returns exit 1 with no output (empty stdout, empty stderr) for _every_ command, run `df -h /tmp`. It is probably 100% full. Clear it, carry on.

If you Googled "claude code bash exit 1 no output" and landed here: yes, this is the bug. Skip to [Fix](#fix).

## Symptom: Claude Code bash returns exit 1 with no output

Every single Bash tool call in Claude Code returned this:

```
Exit code: 1
(no stdout)
(no stderr)
```

`echo ok`? Exit 1. `true`? Exit 1. `pwd`? Exit 1. Fresh session, new project directory, `/clear`, restart the CLI. Same result. The whole harness felt wedged.

## What it was not

I burned a while on three perfectly reasonable hypotheses, each of which is a real bug class with the same symptom, so I will list them here for the next person Googling this at 22:00:

- A lingering subprocess holding stdio file descriptors.
- A broken shell startup file or rogue `BASH_ENV`.
- A multi-word `$SHELL` that breaks the tool's exec path (see [anthropics/claude-code#12115](https://github.com/anthropics/claude-code/issues/12115)).

All of those can produce "persistent shell exits with no output before your command runs". None of them were the problem.

## What it actually was

`/tmp` was 100% full.

```
$ df -h /tmp
Filesystem      Size  Used Avail Use% Mounted on
tmpfs            16G   16G     0 100% /tmp
```

Claude Code's Bash tool captures subprocess stdout and stderr through temp files under `/tmp/claude-1000/...`. When those writes fail with `ENOSPC`, the tool surfaces nothing: no stdout, no stderr, just a bare exit 1. The swallowing _is_ the failure, which is why the failure is invisible.

On Debian 13 with the default systemd `tmp.mount`, `/tmp` is a tmpfs sized at 50% of RAM. On my 32 GB box that is a 16 GB ceiling, which felt generous right up until one nightly batch job filled it overnight.

## The reveal

I only saw it because `strace` itself refused to start:

```
$ strace -f -e trace=execve -o /tmp/claude.strace claude -p 'echo alive'
strace: /tmp/claude.strace: No space left on device
```

Thanks, strace. You are the only honest tool in this house.

## Fix

Short term:

```sh
rm -rf /tmp/claude-1000/*
# plus whatever else is hogging /tmp on your box
```

The Bash tool recovered without restarting Claude Code.

Long term, point the guilty batch job at an on-disk scratch dir:

```sh
export TMPDIR="$HOME/.cache/my-batch-job-tmp"
```

Gigabytes of intermediate artifacts have no business living on a RAM-backed filesystem. `/tmp` should be small, hot, and for OS-level ephemera. Project-scale scratch belongs under `$XDG_CACHE_HOME`.

## Order of operations lesson

The cost of running `df -h` is zero. The cost of inspecting `pstree` output and reasoning about file descriptor inheritance is not zero. Next time a previously-working tool suddenly returns nothing but generic errors, check disk first, processes second. I will remember this for approximately six weeks.

## The broader footgun

A tool that returns "exit 1, no output" for every invocation is strictly worse than "exit 1, here is what broke". When Claude Code's Bash tool cannot capture output because the capture buffer itself failed to write, the right behavior is to surface _that_ specifically, not a generic exit code. Filed mentally under "silent failure modes compound". The `ENOSPC` on the capture path is the one error message you actually need, and it is the one that gets eaten.

If you found this post because your Claude Code Bash tool is returning exit 1 with no output: `df -h /tmp`. You're welcome.
