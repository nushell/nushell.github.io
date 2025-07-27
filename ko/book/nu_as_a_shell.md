---
prev:
  text: Best Practices
  link: /book/style_guide.md
next:
  text: Configuration
  link: /book/configuration.md
---
# Nu as a Shell

The [Nu Fundamentals](nu_fundamentals.md) and [Programming in Nu](programming_in_nu.md) chapter focused mostly on the language aspects of Nushell.
This chapter sheds the light on the parts of Nushell that are related to the Nushell interpreter (the Nushell [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop)).
Some of the concepts are directly a part of the Nushell programming language (such as environment variables) while others are implemented purely to enhance the interactive experience (such as hooks) and thus are not present when, for example, running a script.

Many parameters of Nushell can be [configured](configuration.md).
The config itself is stored as an environment variable.
Furthermore, Nushell has several different configuration files that are run on startup where you can put custom commands, aliases, etc.

A big feature of any shell are [environment variables](environment.md).
In Nushell, environment variables are scoped and can have any type supported by Nushell.
This brings in some additional design considerations so please refer to the linked section for more details.

The other sections explain how to work with [stdout, stderr and exit codes](stdout_stderr_exit_codes.md), how to [run an external command when there is a built-in with the same name](./running_externals.md), and how to [configure 3rd party prompts](3rdpartyprompts.md) to work with Nushell.

An interesting feature of Nushell is the [Directory Stack](directory_stack.md) which let you work in multiple directories simultaneously.

Nushell also has its own line editor [Reedline](line_editor.md).
With Nushell's config, it is possible to configure some of the Reedline's features, such as the prompt, keybindings, history, or menus.

It is also possible to define [custom signatures for external commands](externs.md) which lets you define [custom completions](custom_completions.md) for them (the custom completions also work for Nushell custom commands).

[Coloring and Theming in Nu](coloring_and_theming.md) goes into more detail about how to configure Nushell's appearance.

If you want to schedule some commands to run in the background, [Background jobs](background_jobs.md) provides simple guidelines for you to follow.

Finally, [hooks](hooks.md) allow you to insert fragments of Nushell code to run at certain events.
