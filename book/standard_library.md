---
prev:
  text: (Not so) Advanced
  link: /book/advanced.md
---
# Standard Library

Nushell ships with a standard library of useful commands written in native Nu. By default, the standard library is loaded into memory (but not automatically imported) when Nushell starts. The exception is the small `std/prelude` module, which is imported automatically and provides the [`banner`](/commands/docs/banner.md) and [`pwd`](/commands/docs/pwd.md) commands.

[[toc]]

## Overview

The standard library is split into modules, and you import only the ones you need, as described [below](#importing-the-standard-library). Each module has its own page:

| Module                                              | Recommended import  | Contents                                                                                         |
| --------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------ |
| [`std/assert`](./standard_library/assert.md)        | `use std/assert`    | `assert` and its subcommands, for tests                                                          |
| [`std/bench`](./standard_library/bench.md)          | `use std/bench`     | `bench`, which times closures                                                                    |
| [`std/clip`](./standard_library/clip.md)            | `use std/clip`      | `clip copy52`, `clip paste52` and `clip prefix`, for the clipboard through the terminal          |
| [`std/config`](./standard_library/config.md)        | `use std/config`    | `config dark-theme`, `config light-theme` and `config env-conversions`                           |
| [`std/dirs`](./directory_stack.md)                  | `use std/dirs`      | `dirs` and its subcommands, the directory stack                                                  |
| [`std/dt`](./standard_library/dt.md)                | `use std/dt *`      | `datetime-diff` and `pretty-print-duration`, for calendar differences between dates              |
| [`std/formats`](./standard_library/formats.md)      | `use std/formats *` | `from` and `to` commands for JSONL, NDJSON and NDNUON                                            |
| [`std/help`](./standard_library/help.md)            | `use std/help`      | another version of `help` and its subcommands                                                    |
| [`std/input`](./standard_library/input.md)          | `use std/input`     | `input display`, which shows the key presses Nushell receives                                    |
| [`std/iter`](./standard_library/iter.md)            | `use std/iter`      | `iter find`, `iter scan` and other commands for working through lists                            |
| [`std/log`](./standard_library/log.md)              | `use std/log`       | `log info`, `log warning` and the other logging commands                                         |
| [`std/math`](./standard_library/math.md)            | `use std/math`      | the constants `E`, `PI`, `TAU`, `PHI` and `GAMMA`                                                |
| [`std/random`](./standard_library/random.md)        | `use std/random`    | `random dice`                                                                                    |
| [`std/testing`](./testing.md#the-testing-nu-runner) | `use std/testing *` | the `@test`, `@ignore`, `@before-each`, `@before-all`, `@after-each` and `@after-all` attributes |
| [`std/util`](./standard_library/util.md)            | `use std/util *`    | `path add`, `repeat`, `null-device`, `structure`, `ellie` and the `null_device` constant         |
| [`std/xml`](./standard_library/xml.md)              | `use std/xml *`     | `xaccess`, `xupdate`, `xinsert` and `xtype`, for XML data                                        |

Nushell also ships `std-rfc`, a library of candidate commands for the standard library. See [The Standard Library Candidate Module](#the-standard-library-candidate-module).

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

The list leaves a few things out:

- The `std/clip` commands, which `use std` doesn't import.
- The `std/testing` attributes. They are aliases, so they appear in `scope aliases` instead, as `std testing attr test` and so on.
- The `shells-aliases` of `std/dirs`, which only `use std/dirs shells-aliases *` imports.
- The `std/math` constants and `null_device`, which are values. After `use std`, they are in the `$std` record.

## The prelude

Nushell imports `std/prelude` when it starts, unless you start it with `--no-std-lib`. The prelude has two commands.

[`pwd`](/commands/docs/pwd.md) returns the current directory, `$env.PWD`. With `--physical` (`-P`), it resolves symbolic links first. On macOS, where `/tmp` is a link to `/private/tmp`:

```nu
cd /tmp
pwd
# => /tmp
pwd --physical
# => /private/tmp
```

[`banner`](/commands/docs/banner.md) returns the welcome message that Nushell shows at startup: Ellie, the version, some links, how long ago Nushell's first commit was, and the startup time. `--short` returns only the `Startup Time` line, and `--no-startup-time` returns everything except that line. Three keys of `$env.config.color_config` set its colors: `banner_foreground` for the text, which defaults to `attr_normal`, and `banner_highlight1` and `banner_highlight2` for the highlighted words, which default to `green` and `purple`. When [`config use-colors`](/commands/docs/config_use-colors.md) returns `false`, `banner` strips all ANSI codes from its text.

`$env.config.show_banner` decides what the REPL shows when it starts:

| Value               | Shows                                        |
| ------------------- | -------------------------------------------- |
| `true` or `"full"`  | the whole banner (the default)               |
| `"short"`           | only the startup time line, `banner --short` |
| `false` or `"none"` | nothing                                      |

The REPL prints the welcome part before it runs the startup hooks, and the startup time line just before the first prompt. The time it shows covers everything up to that prompt. See [Remove Welcome Message](./configuration.md#remove-welcome-message).

## Importing the Standard Library

The Standard Library modules and submodules are imported with the [`use`](/commands/docs/use.md) command, just as any other module. See [Using Modules](./modules/using_modules.md) for more information.

### Importing the whole library

While working at the commandline, it can be convenient to load the entire standard library using:

```nu
use std *
```

However, this form should be avoided in custom commands and scripts since it has the longest load time.

::: important Optimal Startup when Using the Standard Library
See the [notes below](#optimal-startup) on how to ensure that your configuration isn't loading the entire Standard Library.
:::

`use std` and `use std *` both import every module except `std/clip`, which you have to import on its own. Both also run the `export-env` blocks of `std/log` and `std/dirs`, which set up the [log formats](./standard_library/log.md#log-line-format) and the [directory stack](./directory_stack.md#where-the-stack-is-stored). They differ in how the commands are named:

- `use std` puts everything under the `std` prefix, as in `std log info`, `std dirs add` and `std help`. The `std/util` commands lose their module's name. They are `std path add`, `std repeat`, `std null-device`, `std structure` and `std ellie`, not `std util path add`. The math constants and `null_device` are in a `$std` record, as `$std.math.PI` and `$std.null_device`.
- `use std *` imports each module under its own name, as in `log info`, `dirs add` and `assert equal`, and the `std/util` commands without any prefix, such as `path add`. The constants are `$math.PI` and `$null_device`.

`use std *` also brings in the `help` command of [`std/help`](./standard_library/help.md), which replaces the built-in `help` and the page that the `--help` flag of every command shows. `use std` doesn't change `help`, because its version is named `std help`.

### Importing Submodules

Each submodule of the standard library can be loaded separately. Again, _for best performance, load only the submodule(s) that you need in your code._

See [Importing Modules](./modules/using_modules.md#importing-modules) for general information on using modules. The [table above](#overview) shows the recommended import for each of the Standard Library submodules. It uses one of the first two forms below.

#### 1. Submodules with `<command> <subcommand>` form

These submodules are normally imported with `use std/<submodule>` (without a glob/`*`): `std/assert`, `std/bench`, `std/clip`, `std/config`, `std/dirs`, `std/help`, `std/input`, `std/iter`, `std/log` and `std/random`. Their commands keep the submodule's name, as in `log warning <msg>`. `std/math` also works this way. After `use std/math`, its constants are `$math.E` and so on.

#### 2. Import the _definitions_ (contents) of the module directly

Some submodules are easier to use when their definitions (commands, aliases, constants, etc.) are loaded into the current scope. For instance:

```nu
use std/formats *
ls | to jsonl
```

The submodules that are normally imported with `use std/<submodule> *` (**with** a glob/`*`) are `std/dt`, `std/formats`, `std/testing`, `std/util` and `std/xml`. The glob matters most for `std/testing`, whose `@test` and other attributes only work without a prefix, and for `std/formats`, whose commands [`open`](/commands/docs/open.md) and [`save`](/commands/docs/save.md) find only under their plain names. `std/util` also exports a constant, [`null_device`](./standard_library/util.md#null-device-and-null-device), for places where Nushell needs a value while it parses your code. `use std/math *` imports the math constants without a prefix, such as `$E`, though the prefixed form #1 above is usually easier to read.

#### 3. `use std <submodule>`

It is _possible_ to import Standard Library submodules using a space-separated form:

```nu
use std formats *
```

::: important
As mentioned in [Using Modules](./modules/using_modules.md#module-definitions), this form (like `use std *`) first loads the _entire_ Standard Library into scope and _then_ imports the submodules. In contrast, the slash-separated versions in #1 and #2 above _only_ import the submodule and will be much faster as a result.

This form also doesn't work for submodules that have a command of the same name. For example, `use std log` imports only the `log` command itself, not `log info` or the other subcommands. Use `use std/log` instead.
:::

## Logging with `std/log`

The logging commands, such as `log info` and `log warning`, are described in [`std/log`](./standard_library/log.md), along with log levels, the format of a log line and custom levels.

## The Standard Library Candidate Module

`std-rfc`, found in the [nushell Repository](https://github.com/nushell/nushell/tree/main/crates/nu-std/std-rfc), serves as a staging ground for possible Standard Library additions.

`std-rfc` ships with Nushell, so its submodules can be imported the same way as the Standard Library's, for example `use std-rfc/str`. It currently includes the `conversions`, `date`, `iter`, `kv`, `path`, `pb`, `random`, `str`, `tables`, `url`, and `xml` submodules. Their commands are described in [`std-rfc`](./standard_library/std_rfc.md), which also covers the universal variables of [`std-rfc/kv`](./standard_library/std_rfc.md#universal-variables).

Import `std-rfc/date` and `std-rfc/kv` with a glob. Their commands already start with the module's name, so `use std-rfc/date` gives you `date date floor`, and `use std-rfc/kv` gives you `kv kv set`. [Importing](./standard_library/std_rfc.md#importing) on the `std-rfc` page lists the recommended import for every submodule. `std-rfc/kv` exists only in a Nushell built with the `sqlite` feature, which the default build includes.

`use std-rfc` imports every submodule except `std-rfc/date`, under the `std-rfc` prefix. Like `use std`, it drops the name of some submodules. The commands of `conversions`, `tables` and `path` become `std-rfc into list`, `std-rfc with-extension` and so on, while the others keep it, as in `std-rfc str dedent`.

If you are interested in adding to the Standard Library, please submit your code via PR to the `std-rfc` module in that repository. We also encourage you to try these candidate commands and provide feedback on them.

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

To disable the standard library, you can start Nushell using:

```nu
nu --no-std-lib
```

This can be especially useful to minimize overhead when running a command in a subshell using `nu -c`. With `-c`, `$nu.startup-time` shows how long Nushell took to start before running the command, so you can compare the two:

```nu
nu --no-std-lib -n -c "$nu.startup-time"
# => 9ms 650µs 250ns

nu -n -c "$nu.startup-time"
# => 11ms 558µs 83ns
```

You will not be able to import the library, any of its submodules, nor use any of its commands, when it is disabled in this way. `std-rfc` is disabled as well, so `use std/log` and `use std-rfc/str` both fail with `Module not found`.

The `banner` and `pwd` commands from `std/prelude` are gone too, so Nushell runs them as external commands. `pwd` runs a `pwd` program from your `PATH`, such as `/bin/pwd`. On macOS, `banner` runs `/usr/bin/banner`, which prints text in large letters. Where no such program exists, the command isn't found. The REPL also skips its startup banner, whatever `show_banner` says.

## Using `std/dirs` in Modules

Two standard library modules set environment variables in an `export-env` block:

- `std/log` sets `NU_LOG_FORMAT` and `NU_LOG_DATE_FORMAT`, unless they already have a value.
- `std/dirs` creates `DIRS_LIST` and `DIRS_POSITION`, the [directory stack](./directory_stack.md#where-the-stack-is-stored), and adds an `ENV_CONVERSIONS` entry for each of them.

If your own module imports one of them with a top-level `use`, that block doesn't run when your module is imported. See [this caveat](./modules/creating_modules.md#export-env-runs-only-when-the-use-call-is-evaluated) in the "Creating Modules" chapter for why.

`std/log` doesn't need the block. Its commands fall back to the default formats when the variables aren't set.

`std/dirs` does. Without the variables, `dirs` fails with `Cannot find column 'DIRS_LIST'`. Run the block from your module's own `export-env`, with `use std/dirs []`, which imports nothing but the environment:

```nu
# go.nu
use std/dirs

export-env {
    use std/dirs []
}

export def --env stack [] {
    dirs | length
}
```

```nu
use go.nu
go stack
# => 1
```

## Optimal Startup

If Nushell's startup time is important to your workflow, review your [startup configuration](./configuration.md) in `config.nu`, `env.nu`, and potentially others for inefficient use of the standard library. The following command should identify any problem areas:

```nu
view files
| enumerate | flatten
| where filename !~ '^std'
| where filename !~ '^repl_entry'
| where {|file|
    (view span $file.start $file.end) =~ 'use\s+std(\s|;|$)'
  }
```

Edit those files to use the recommended syntax in the [Importing Submodules](#importing-submodules) section above.

::: note
If a Nushell library (e.g., from [the `nu_scripts` repository](https://github.com/nushell/nu_scripts)), example, or doc is still using this syntax, please report it via an issue or PR.

If a third-party module is using this syntax, please report it to the author/maintainers to update.
:::
