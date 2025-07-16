---
prev:
  text: Special Variables
  link: /book/special_variables.md
next:
  text: Custom Commands
  link: /book/custom_commands.md
---
# Programming in Nu

This chapter goes into more detail of Nushell as a programming language.
Each major language feature has its own section.

Just like most programming languages allow you to define functions, Nushell uses [custom commands](custom_commands.md) for this purpose.

From other shells you might be used to [aliases](aliases.md).
Nushell's aliases work in a similar way and are a part of the programming language, not just a shell feature.

Common operations, such as addition or regex search, can be done with [operators](operators.md).
Not all operations are supported for all data types, and Nushell will make sure to let you know when there is a mismatch.

You can store intermediate results to [variables](variables.md).
Variables can be immutable, mutable, or a parse-time constant.

The last three sections are aimed at organizing your code:

[Scripts](scripts.md) are the simplest form of code organization: You just put the code into a file and source it.
However, you can also run scripts as standalone programs with command line signatures using the "special" `main` command.

With [modules](modules.md), just like in many other programming languages, it is possible to compose your code from smaller pieces.
Modules let you define a public interface vs. private commands and you can import custom commands, aliases, and environment variables from them.

[Overlays](overlays.md) build on top of modules.
By defining an overlay, you bring in module's definitions into its own swappable "layer" that gets applied on top of other overlays.
This enables features like activating virtual environments or overriding sets of default commands with custom variants.

The standard library also has a [testing framework](testing.md) if you want to prove your reusable code works perfectly.
