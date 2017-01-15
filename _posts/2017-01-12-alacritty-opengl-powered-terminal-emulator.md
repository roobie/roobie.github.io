---
layout: post
title:  Alacritty - an OpenGL powered terminal emulator
date:   2017-01-12 14:58:02 +0100
comments: true
categories: software rust
tags:
  - rust
  - terminal-emulator
  - opengl
  - cli
---

Today we're going to take a look at [Alacritty][alacritty-announcement]. The name, which I think is a portmanteau of alacrity and [TTY][jargon-tty], is a terminal emulator written in rust. Here's an excerpt from the project's README, which describes it in a nutshell:

>Keep in mind that Alacritty is very much not looking to be a feature-rich terminal emulator with all sorts of bells and widgets. It's primarily a cross-platform, blazing fast tmux renderer that Just Works.

Personally, I've used the following terminal emulators to a greater extent:

- Sakura
- Terminator
- rxvt-unicode
- xterm
- eterm

Of which, to this date, I've found Sakura to be the most pleasant one to use, because of its simplicity and speed. Since Alacritty's goals are to be simple and fast, it might be a contender for my number one.

### Building

The project's README includes instructions on which dependencies are requried and how to build. I had to `rustup override set $(<rustc-version)` (as stated in the README) because [copypasta][cargo-copypasta] wouldn't compile with the `nightly` release. Other than that, it was, more or less, a straight-forward `cargo build --release`, and a bit of waiting.

### Running

To try it out, I opened a new tmux session, split the window in two and executed `dd if=/dev/urandom | base64`, in order to generate some output.

![Alacritty test](/assets/img/post1/alacritty_1-compressor.png)
*Alacritty with a tmux session having two zsh instances running `dd if=/dev/urandom | base64`*

I did the same with Sakura, and it was actually noticeably laggy, whereas Alacritty was pretty smooth. Now, this test, in and of itself, is not sufficient to draw a final conclusion regarding which is faster. I presume that factors, such as [ANSI][jargon-ansi] colours and unicode glyphs, play a role as well. There is [an issue][alacritty-benchmark-issue] regarding this on the project's issue tracker, where one can find some examples of ways to benchmark a terminal emulator.

### Caveats

Running this on an older machine may not be possible just yet, due to Alacritty needing support for `GLSL 3.30`, as discussed in [this issue][alacritty-glsl-issue]. Trying to run Alacritty with an Intel M 530 integrated graphics controller did not work, whereas it did work on a newer ATI Radeon M. Hopefully, this issue is solved so that one can use Alacritty even on somewhat dated hardware.

Alacritty is still new, and as such has its share of bugs and incomplete functionality, but it is an [active project][alacritty-pulse], and as such might be "production ready" sometime in the future.

### Links

- [Joe Wilm's intro to Alacritty][alacritty-announcement]
- [Alacritty@GitHub][alacritty-gh]

[alacritty-announcement]: http://blog.jwilm.io/announcing-alacritty/
[alacritty-gh]: https://github.com/jwilm/alacritty
[alacritty-pulse]: https://github.com/jwilm/alacritty/pulse
[alacritty-benchmark-issue]: https://github.com/jwilm/alacritty/issues/289
[alacritty-glsl-issue]: https://github.com/jwilm/alacritty/issues/128
[cargo-copypasta]: https://crates.io/crates/copypasta

[jargon-tty]: http://catb.org/jargon/html/T/tty.html
[jargon-ansi]: http://catb.org/jargon/html/A/ANSI-standard.html
[sakura-home]: https://launchpad.net/sakura
[terminator-lp]: https://launchpad.net/terminator
