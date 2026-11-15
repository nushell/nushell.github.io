# `std/help`

The `std/help` module is a second version of the [`help`](/commands/docs/help.md) command, written in Nushell. Importing it replaces `help`, `help aliases`, `help commands`, `help externs`, `help modules` and `help operators` with its own versions:

```nu
use std/help
```

`help escapes` and `help pipe-and-redirect` aren't in the module and stay the built-in commands.

Nushell answers every `--help` flag by calling whichever `help` command is in scope, so after the import, `ls --help` shows the `std/help` page for `ls` too. [`use std *`](../standard_library.md#importing-the-standard-library) imports `std/help` along with everything else and has the same effect.

[[toc]]

## How it differs from the built-in `help`

- A name that isn't a command, alias or module goes to an external help program, `man` by default, instead of causing an error. See [Help from external programs](#help-from-external-programs).
- The names you type after `help` and its subcommands have completions.
- `help operators` has a page for a single operator and a `--find` flag.
- The pages look different. A command's page also shows its category, lists flags as `--name, -n: <type> - description`, and has a "Signatures" section instead of the input/output table. The "Usage" line names positional parameters but not a rest parameter, which is listed under "Parameters".

## `help`

Without arguments, `help` shows its own help page, which lists the subcommands. With a name, it looks for a command, then an alias, then a module of that name, and shows the first one it finds. The name can be several words, as in `help str join`.

`help --find <text>` searches the names, descriptions and search terms of commands. If no command matches, it searches the names and descriptions of aliases, and then those of modules, and returns the first non-empty table. If nothing matches at all, it prints `No help results found mentioning: <text>` to stderr and returns an empty list.

### Help from external programs

When `help` finds no command, alias or module with the name you gave, it prints a line saying so and runs an external help program with your words as arguments:

```nu
help zzznotathing
# => Help pages from external command zzznotathing:
# => No manual entry for zzznotathing
```

`$env.NU_HELPER` names the program. When it isn't set, the program is `man`, so `help tar` shows the `tar` manual page. Each word is a separate argument, which lets `help git log` run `man git log`. A `^` or `%` at the start of the first word is removed, so `help ^ls` shows the manual page for `ls` even though `ls` is also a Nushell command. Setting `NU_HELPER` to `echo` shows the arguments the program gets:

```nu
$env.NU_HELPER = "echo"
help git log
# => Help pages from external command git log:
# => git log
```

Set `NU_HELPER` to the string `"--help"` to ask the program itself instead. `help tar` then runs `tar --help`. Nushell runs the first word as the program and passes the other words, then `--help`. A program that doesn't understand `--help` may do something you didn't intend, so use this setting with care.

## `help commands`

Without arguments, `help commands` returns a table of every command in scope with its `name`, `category`, `description`, `signatures` and `search_terms`. `--find` filters it on the name, description and search terms.

With a name, it shows that command's page. A name it can't find goes to the [external help program](#help-from-external-programs), as with `help`.

The pages for [`open`](/commands/docs/open.md) and [`save`](/commands/docs/save.md) have an extra "Extensions" section. It explains that `open` picks a `from` command by the file's extension, and `save` a `to` command, and it lists every such command in scope with its extension. Commands you define or import count, so after [`use std/formats *`](./formats.md), the list for `open` includes `*.jsonl` with `from jsonl`.

## `help aliases`

Without arguments, `help aliases` returns a table of the aliases in scope, sorted by name. `--find` filters it on the name and description.

With a name, it shows the alias's description, its name and what it expands to. The built-in version adds the full help page of the aliased command, while this one stops there:

```nu
# List files with details
alias ll = ls -l
help aliases ll
# => List files with details
# =>
# => Alias:
# =>   ll
# => Expansion:
# =>   ls -l
```

An unknown name is an error, `std::help::alias_not_found`.

## `help externs`

`help externs` covers the commands declared with [`extern`](/commands/docs/extern.md). Without arguments, it returns a table of their names and descriptions, sorted by name. `--find` (`-f`) filters it on both columns, and the names you type after `help externs` complete to the externs in scope:

```nu
# Git version control
extern git [--version]
# Copy files remotely
extern scp []
help externs --find remote
# => ╭───┬──────┬─────────────────────╮
# => │ # │ name │     description     │
# => ├───┼──────┼─────────────────────┤
# => │ 0 │ scp  │ Copy files remotely │
# => ╰───┴──────┴─────────────────────╯
```

`help externs git` shows only the description and the name, not the extern's flags and parameters as the built-in version does. An unknown name is an error:

```nu
help externs nothere
# => Error: nu::shell::error
# =>
# =>   × std::help::extern_not_found
# =>    ╭─[repl_entry #1:1:14]
# =>  1 │ help externs nothere
# =>    ·              ───┬───
# =>    ·                 ╰── extern not found
# =>    ╰────
```

## `help modules`

Without arguments, `help modules` returns the table from [`scope modules`](/commands/docs/scope_modules.md). `--find` filters it on the module name and description.

With a name, it shows the module's description, its submodules, its exported commands, aliases and type aliases, and whether it exports environment. Each command is listed with its name inside the module and, in parentheses, its full name with the module's name in front:

```nu
# Greeting commands
module greet {
    export def hello [] { "hello" }
    export def bye [] { "bye" }
    export alias hi = hello
}
help modules greet
# => Greeting commands
# =>
# => Module: greet
# =>
# =>
# => Exported commands:
# =>     bye (greet bye)
# =>     hello (greet hello)
# =>
# => Exported aliases:
# =>     hi
# =>
# => This module does not export environment.
```

An unknown module name is an error, `std::help::module_not_found`.

## `help operators`

Without arguments, `help operators` returns a table of Nushell's operators with their `type`, `operator`, `name`, `description` and `precedence`. `--find` filters it on the `type` and `name` columns:

```nu
help operators --find Shift
# => ╭───┬─────────┬──────────┬────────────┬───────────────────────────┬────────────╮
# => │ # │  type   │ operator │    name    │        description        │ precedence │
# => ├───┼─────────┼──────────┼────────────┼───────────────────────────┼────────────┤
# => │ 0 │ Bitwise │ bit-shl  │ ShiftLeft  │ Bitwise shifts a value    │         85 │
# => │   │         │          │            │ left by another.          │            │
# => │ 1 │ Bitwise │ bit-shr  │ ShiftRight │ Bitwise shifts a value    │         85 │
# => │   │         │          │            │ right by another.         │            │
# => ╰───┴─────────┴──────────┴────────────┴───────────────────────────┴────────────╯
```

`help operators` followed by an operator's name shows a page for that operator. Use the name from the `name` column, not the symbol. `help operators NotRegexMatch` works, while `help operators "!~"` fails with `std::help::operator_not_found`. The names complete as you type.

```nu
help operators NotRegexMatch
# => Description:
# =>     Checks if a value does not match a regular expression.
# => Operator:
# =>     NotRegexMatch (!~ or not-like)
# => Type:
# =>     Comparison
# => Precedence:
# =>     80
```

See [Operators](../operators.md) for what each operator does and how precedence works.
