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

Lately I've been using [ Sakura ][sakura-home] as my preferred terminal emulator and tmux as the multiplexer. But it was not too long ago I switched from using [ Terminator ][terminator-lp] (which has built in multiplexing functions). Terminator is somewhat slow with its output, whereas Sakura is pretty fast. The faster output of Sakura has really made a difference in my command-line interfacing.

Enter [Alacritty][alacritty-announcement]. The name, which I think is a portmanteau of alacrity and TTY, is a terminal emulator written in rust. Here's an excerpt from the project's README:

>Keep in mind that Alacritty is very much not looking to be a feature-rich terminal emulator with all sorts of bells and widgets. It's primarily a cross-platform, blazing fast tmux renderer that Just Works.

Which is all I require of a good terminal emulator and is why I find Alacritty interesting, but also in part due to it being written in rust.

When building this project, I had to do as the README instructs when the compilation fails
with `nightly` version; `rustup override set $(<rustc-version)` because otherwise
[copypasta][cargo-copypasta] wouldn't compile.

To try it out, I opened a new tmux session, split the window in two and executed
`dd if=/dev/urandom | base64`, which generates a _lot_ of output.

![Alacritty test](/assets/img/alacritty_1-compressor.png)
*Alacritty with a tmux session having two zsh instances running `dd if=/dev/urandom | base64`*

I did the same with Sakura, and it was noticeably laggy, whereas Alacritty was pretty smooth.

I think I've found me a new terminal emulator, or at least one to start using and help improve.

Other commands to try in your terminal emulator:

- `cd /; tree`
- `wget -qO- https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.js`


#### P.S.

*It's somewhat unfortunate that there is a multiplayer game named Rust. It somewhat dilutes
the signal-to-noise ratio when searching the Web for rust related resources.*

[alacritty-announcement]: http://blog.jwilm.io/announcing-alacritty/
[cargo-copypasta]: https://crates.io/crates/copypasta

[sakura-home]: https://launchpad.net/sakura
[terminator-lp]: https://launchpad.net/terminator
