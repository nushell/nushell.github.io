---
title: Community
---

# Programming in Nu

This chapter goes into more detail of Nushell as a programming language.
Each major language feature has its own section.

Just like most programming languages allow you to define functions, Nushell uses [custom commands](/book/custom_commands) for this purpose.

From other shells you might be used to [aliases](/book/aliases).
Nushell's aliases work in a similar way and are a part of the programming language, not just a shell feature.

Common operations can, such as addition or regex search, be done with [operators](/book/operators).
Not all operations are supported for all data types and Nushell will make sure to let you know.

You can store intermediate results to [variables](/book/variables_and_subexpressions) and immediately evaluate subroutines with [subexpressions](/book/variables_and_subexpressions#subexpressions).

The last three sections are aimed at organizing your code:

[Scripts](/book/scripts) are the simplest form of code organization: You just put the code into a file and source it.
However, you can also run scripts as standalone programs with command line signatures using the "special" `main` command.

With [modules](/book/modules), just like in many other programming languages, it is possible to compose your code from smaller pieces.
Modules let you define a public interface vs. private commands and you can import custom commands, aliases, and environment variables from them.

[Overlays](/book/overlays) build on top of modules.
By defining an overlay, you bring in module's definitions into its own swappable "layer" that gets applied on top of other overlays.
This enables features like activating virtual environments or overriding sets of default commands with custom variants.

The help message of some built-in commands shows a [signature](/book/command_signature). You can take a look at it to get general rules how the command can be used.

The standard library also has a [testing framework](/book/testing) if you want to prove your reusable code works perfectly.
