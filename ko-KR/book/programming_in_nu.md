# Nu로 프로그래밍하기

This chapter goes into more detail of Nushell as a programming language.
Each major language feature has its own section.

Just like most programming languages allow you to define functions, Nushell uses [custom commands](custom_commands.md) for this purpose.

From other shells you might be used to [aliases](aliases.md).
Nushell's aliases work in a similar way and are a part of the programming language, not just a shell feature.

Common operations can, such as addition or regex search, be done with [operators](operators.md).
Not all operations are supported for all data types and Nushell will make sure to let you know.

You can store intermediate results to [variables](variables_and_subexpressions.md) and immediately evaluate subroutines with [subexpressions](variables_and_subexpressions.html#subexpressions).

The last three sections are aimed at organizing your code:

[Scripts](scripts.md) are the simplest form of code organization: You just put the code into a file and source it.
However, you can also run scripts as standalone programs with command line signatures using the "special" `main` command.

With [modules](modules.md), just like in many other programming languages, it is possible to compose your code from smaller pieces.
Modules let you define a public interface vs. private commands and you can import custom commands, aliases, and environment variables from them.

[Overlays](overlays.md) build on top of modules.
By defining an overlay, you bring in module's definitions into its own swappable "layer" that gets applied on top of other overlays.
This enables features like activating virtual environments or overriding sets of default commands with custom variants.

The help message of some built-in commands shows a [signature](command_signature.md). You can take a look at it to get general rules how the command can be used.

The standard library also has a [testing framework](testing.md) if you want to prove your reusable code works perfectly.
