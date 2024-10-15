# Standard Library (Preview)

Nushell ships with a standard library of useful commands written in native Nu. By default, the standard library is loaded into memory (but not automatically imported) when Nushell starts.

[[toc]]

## Overview

The standard library currently includes:

- Assertions
- An alternative `help` system with support for completions.
- Additional JSON variant formats
- XML Access
- Logging
- And more

To see a complete list of the commands available in the standard library, run the following:

```nu
nu -c "
  use std
  scope commands
  | where name =~ '^std '
  | select name description extra_description
  | wrap 'Standard Library Commands'
  | table -e
"
```

::: note
The `use std` command above loads the entire standard library so that you can see all of the commands at once. This is typically not how it will be used (more info below). It is also run in a separate Nu subshell simply so that it is not loaded into scope in the shell you are using.
:::

## Importing the Standard Library

While working at the commandline, it can be convenient to load the entire standard library using:

```nu
use std *
```

However, this form should be avoided in custom commands and scripts since it has the longest load time.

::: important Optimal Startup when Using the Standard Library
See the [notes below](#optimal-startup) on how to ensure that your configuration isn't loading the entire Standard Library.
:::

### Importing Submodules

Each submodule of the standard library can be loaded separately. Again, _for best performance, load only the submodule(s) that you need in your code._

There are several forms that can be used:

#### 1. Import the submodule

Examples:

```nu
use std/iter
[2 5 "4" 7] | iter filter-map {|it| $it ** 2}

use std/help
help ls
help commands
```

This form requires that you prefix the command using the submodule name. This can be useful in two scenarios.

1. In the `use std/iter` example, it's important to prefix the commands with the `iter` namespace. If, on the other hand, you were to `use std/iter *`, you would shadow the built-in `find` command with the `iter` module's `find` command.

2. In the `use std/help` example, `help` is both the submodule name and the name of the main command it exports. Using `use std/help` allows you to access:

   ```nu
   help
   help aliases
   help modules
   help commands
   help operators
   help externs
   ```

   In this case, the `std/help` commands are meant to shadow (replace) the built-in versions.

Submodules that are normally imported with `use std/<submodule>`:

- `use std/assert`: `assert` and its subcommands
- `use std/bench`: The benchmarking command `bench`
- `use std/dirs`: The directory stack command `dirs` and its subcommands
- `use std/input`: The `input display` command
- `use std/help`: An alternative version of the `help` command and its subcommands which supports completion and other features
- `use std/iters`: Additional `iters`-prefixed iteration commands. Note: See-also alternative option #3 below.
- `use std/log`: The `log <subcommands>` such as `log warning <msg>`
- `use std/math`: Mathematical constants such as `$math.E`. These can also be imported without a prefix using Form #2 below.

#### 2. Import the _contents_ of the module directly

For certain submodules, you will want the commands from a submodule to be available in the current scope, so that you _can_ simply access the command by name. For instance:

```nu
use std/formats *
ls | to jsonl
```

Submodules that are normally imported with `use std/<submodule> *`:

- `use std/dt *`: Additional commands for working with `date` values
- `use std/formats *`: Additional `to` and `from` format conversions
- `use std/math *`: The math constants without a prefix, such as `$E`. Note that the prefixed form #1 above is likely more understandable when reading and maintaining code.
- `use std/xml *`: Additional commands for working with XML data

#### 3. Importing specific subcommands

As with most modules, you can choose to import only a subset of the commands. For instance, the following would import the `zip-with` command without requiring that it be called with`iter zip-with`.

```nu
use std/iter [ zip-with ]
```

#### 4. `use std <submodule>`

While it is _possible_ to import Standard Library submodules using a space-separated form:

```nu
use std log
use std formats *
```

However, similar to `use std *`, this form first loads the _entire_ Standard Library into scope and _then_ imports the submodules. In contrast, using the slash-separated version _only_ imports the submodule and will be much faster as a result.

## The Standard Library Candidate Module

(Also known as `std-rfc`)

`stdlib-candidate`, found in the [nu_scripts Repository](https://github.com/nushell/nu_scripts/tree/main/stdlib-candidate/std-rfc), serves as a staging ground for possible Standard Library additions.

If you are interested in adding to the Standard Library, please submit your code via PR to the Candidate module in that repository. We also encourage you to install this module and provide feedback on upcoming candidate commands.

::: details More details

Candidate commands for the Standard Library should, in general:

- Have broad appeal - Be useful to a large number of users or use cases
- Be well-written and clearly commented for future maintainers
- Implement help comments with example usage
- Have a description that explains why you feel the command should be a part of the standard library. Think of this as an "advertisement" of sorts to convince people to try the command and provide feedback so that it can be promoted in the future.

In order for a command to be graduated from RFC to the Standard Library, it must have:

- Positive feedback
- Few (or no) outstanding issues and, of course, no significant issues
- A PR author for the `std` submission. This does not necessarily have to be the original author of the command.
- Test cases as part of the `std` submission PR

Ultimately a member of the core team will decide when and if to merge the command into `std` based on these criteria.

Of course, if a candidate command in `std-rfc` no longer works or has too many issues, it may be removed from or disabled in `std-rfc`.

:::

## Disabling the Standard Library

To disable the standard library, you can start using:

```nu
nu --no-std-lib
```

This can be especially useful to minimize overhead when running a command in a subshell using `nu -c`. For example:

```nu
nu --no-std-lib -n -c "$nu.startup-time"
# => 1ms 125µs 10ns

nu -n -c "$nu.startup-time"
# => 4ms 889µs 576ns
```

You will not be able to import the library, any of its submodules, nor use any of its commands, when it is disabled in this way.

## Optimal Startup

If Nushell's startup time is important to your workflow, review your [startup configuration]([./configuration.md]) in `config.nu`, `env.nu`, and potentially others for inefficient use of the standard library. The following command should identify any problem areas:

```nu
view files
| enumerate | flatten
| where filename !~ '^std'
| where filename !~ '^entry'
| where {|file|
    (view span $file.start $file.end) =~ 'use\W+std[^\/]'
  }
```

Edit those files to use the recommended syntax below.
:::

::: note
If a Nushell library (e.g., from [the `nu_scripts` repository](https://github.com/nushell/nu_scripts)), example, or doc is using this syntax, please report it via an issue or PR. These will be updated over time after Nushell 0.99.0 is released.

If a third-party module is using this syntax, please report it to the author/maintainers to update.
:::

## Viewing Standard Library Source

::: tip Did You Know?
Because the standard library is simply composed of [custom commands](./custom_commands.html) in [modules](./modules.html) and [submodules](./modules.html#submodules-and-subcommands), you can see the source for each command with the [`view source`](/commands/docs/view_source.md) command. For example, to view the source for the `ellie` command (with syntax highlighting):

```nu
use std/util *
view source ellie | nu-highlight
:::

## Windows Path Syntax

::: important
Nushell on Windows supports both forward-slashes and back-slashes as the path separator.  However, to ensure cross-platform support for scripts and modules using `std`, using only the forward-slash `/` when importing Standard Library submodules is highly recommended.
:::
```
