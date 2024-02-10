---
title: Introduction
---

Hello, and welcome to the Nushell project.
The goal of this project is to take the Unix philosophy of shells, where pipes connect simple commands together, and bring it to the modern style of development.
Thus, rather than being either a shell, or a programming language, Nushell connects both by bringing a rich programming language and a full-featured shell together into one package.

Nu takes cues from a lot of familiar territory: traditional shells like bash, object based shells like PowerShell, gradually typed languages like TypeScript, functional programming, systems programming, and more. But rather than trying to be a jack of all trades, Nu focuses its energy on doing a few things well:

- Being a flexible cross-platform shell with a modern feel
- Solving problems as a modern programming language that works with the structure of your data
- Giving clear error messages and clean IDE support

## This Book

The book is split into chapters which are further broken down into sections.
You can click on the chapter headers to get more information about it.

- [Getting Started](getting_started.md) teaches you how to install Nushell and shows you the ropes. It also explains some of the design principles where Nushell differs from typical shells, such as bash.
- [Nu Fundamentals](nu_fundamentals.md) explains basic concepts of the Nushell language.
- [Programming in Nu](programming_in_nu.md) dives more deeply into the language features and shows several ways how to organize and structure your code.
- [Nu as a Shell](nu_as_a_shell.md) focuses on the shell features, most notably the configuration and environment.
- [Coming to Nu](coming_to_nu.md) is intended to give a quick start for users coming from other shells or languages.
- [Design Notes](design_notes.md) has in-depth explanation of some of the Nushell's design choices.
- [(Not So) Advanced](advanced.md) includes some more advanced topics (they are not _so_ advanced, make sure to check them out, too!).

## The Many Parts of Nushell

The Nushell project consists of multiple different repositories and subprojects.
You can find all of them under [our organization on GitHub](https://github.com/nushell).

- The main Nushell repository can be found [here](https://github.com/nushell/nushell). It is broken into multiple crates that can be used as independent libraries in your own project, if you wish so.
- The repository of our [nushell.sh](https://www.nushell.sh) page, including this book, can be found [here](https://github.com/nushell/nushell.github.io).
- Nushell has its own line editor which [has its own repository](https://github.com/nushell/reedline)
- [`nu_scripts`](https://github.com/nushell/nu_scripts) is a place to share scripts and modules with other users until we have some sort of package manager.
- [Nana](https://github.com/nushell/nana) is an experimental effort to explore graphical user interface for Nushell.
- [Awesome Nu](https://github.com/nushell/awesome-nu) contains a list of tools that work with the Nushell ecosystem: plugins, scripts, editor extension, 3rd party integrations, etc.
- [Nu Showcase](https://github.com/nushell/showcase) is a place to share works about Nushell, be it blogs, artwork or something else.
- [Request for Comment (RFC)](https://github.com/nushell/rfcs) serves as a place to propose and discuss major design changes. While currently under-utilized, we expect to use it more as we get closer to and beyond 1.0.

## Contributing

We welcome contributions!
[As you can see](#the-many-parts-of-nushell), there are a lot of places to contribute to.
Most repositories contain `CONTRIBUTING.md` file with tips and details that should help you get started (if not, consider contributing a fix!).

Nushell itself is written in [Rust](https://www.rust-lang.org).
However, you do not have to be a Rust programmer to help.
If you know some web development, you can contribute to improving this website or the Nana project.
[Dataframes](dataframes.md) can use your data processing expertise.

If you wrote a cool script, plugin or integrated Nushell somewhere, we'd welcome your contribution to `nu_scripts` or Awesome Nu.
Discovering bugs with reproduction steps and filing GitHub issues for them is a valuable help, too!
You can contribute to Nushell just by using Nushell!

Since Nushell evolves fast, this book is in a constant need of updating.
Contributing to this book does not require any special skills aside from a basic familiarity with Markdown.
Furthermore, you can consider translating parts of it to your language.

## Community

The main place to discuss anything Nushell is our [Discord](https://discord.com/invite/NtAbbGn).
You can also follow us on [Twitter](https://twitter.com/nu_shell) for news and updates.
Finally, you can use the GitHub discussions or file GitHub issues.
