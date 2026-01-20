---
author: Björn Roberg
pubDatetime: 2026-01-20T13:00:00Z
modDatetime: 2026-01-20T13:00:00Z
title: Making use of the Caps Lock key
slug: making-use-of-the-caps-lock-key
featured: true
draft: false
tags:
  - computing
  - ux
  - tweak
description: Remap Caps Lock to Left Control.
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

