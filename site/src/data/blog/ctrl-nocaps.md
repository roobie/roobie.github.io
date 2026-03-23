---
author: Björn Roberg
pubDatetime: 2026-01-20T13:00:00Z
modDatetime: 2026-01-20T13:00:00Z
title: "Remap Caps Lock to Left Control on Linux and Windows"
slug: making-use-of-the-caps-lock-key
featured: true
draft: false
tags:
  - linux
  - keyboard
  - developer-tools
description: "Remap Caps Lock to Left Control for a more ergonomic keyboard layout — instructions for Debian/Linux via XKBOPTIONS and Windows via SharpKeys."
---

How to remap Caps Lock to Left Control.

Why? Because it is more ergonomic, and the default function of the Caps Lock key is pretty meh.

-----

### Debian/Linux (and probably other linuxes)

```ini
# /etc/default/keyboard
# KEYBOARD CONFIGURATION FILE

# Consult the keyboard(5) manual page.

XKBMODEL="pc105"
XKBLAYOUT="us"
XKBVARIANT=""
XKBOPTIONS="caps:ctrl_modifier"

BACKSPACE="guess"
```

-----

### Windows

Use [SharpKeys](https://github.com/randyrants/sharpkeys)

