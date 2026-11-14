---
prev:
  text: (Not so) Advanced
  link: /book/advanced.md
---
# Standard Library

Nushell ships with a standard library of useful commands written in native Nu. By default, the standard library is loaded into memory (but not automatically imported) when Nushell starts. The exception is the small `std/prelude` module, which is imported automatically and provides the [`banner`](/commands/docs/banner.md) and [`pwd`](/commands/docs/pwd.md) commands.

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

The Standard Library modules and submodules are imported with the [`use`](/commands/docs/use.md) command, just as any other module. See [Using Modules](./modules/using_modules.md) for more information.

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

See [Importing Modules](./modules/using_modules.md#importing-modules) for general information on using modules. The recommended import for each of the Standard Library submodules is listed below:

#### 1. Submodules with `<command> <subcommand>` form

These submodules are normally imported with `use std/<submodule>` (without a glob/`*`):

- `use std/assert`: `assert` and its subcommands
- `use std/bench`: The benchmarking command `bench`
- `use std/clip`: `clip copy52` and `clip paste52`, which copy to and paste from the system clipboard through the terminal (OSC 52), and `clip prefix`, which adds a prefix to each line of the content to be copied
- `use std/config`: `config dark-theme` and `config light-theme` (themes for `$env.config.color_config`) and `config env-conversions`
- `use std/dirs`: The directory stack command `dirs` and its subcommands
- `use std/input`: The `input display` command
- `use std/help`: An alternative version of the `help` command and its subcommands which supports completion and other features
- `use std/iter`: Additional `iter`-prefixed iteration commands, such as `iter find` and `iter scan`
- `use std/log`: The `log <subcommands>` such as `log warning <msg>`
- `use std/math`: Mathematical constants such as `$math.E`. These can also be imported as definitions as in Form #2 below.
- `use std/random`: The `random dice` command

::: tip
Nushell also has experimental built-in `clip copy` and `clip paste` commands that use the operating system's clipboard directly instead of OSC 52. To try them, start Nushell with `nu --experimental-options '[native-clip]'`.
:::

#### 2. Import the _definitions_ (contents) of the module directly

Some submodules are easier to use when their definitions (commands, aliases, constants, etc.) are loaded into the current scope. For instance:

```nu
use std/formats *
ls | to jsonl
```

Submodules that are normally imported with `use std/<submodule> *` (**with** a glob/`*`):

- `use std/dt *`: Additional commands for working with `datetime` values
- `use std/formats *`: Additional `to` and `from` format conversions
- `use std/math *`: The math constants without a prefix, such as `$E`. Note that the prefixed form #1 above is likely more understandable when reading and maintaining code.
- `use std/testing *`: The `@test`, `@ignore`, `@before-each`, `@before-all`, `@after-each`, and `@after-all` attributes for marking tests
- `use std/util *`: Miscellaneous commands such as `path add`, `repeat`, `null-device`, and `structure`, and the `null_device` constant
- `use std/xml *`: Additional commands for working with XML data

::: tip
`std/util` exports `null_device`, a constant that holds the same path the `null-device` command returns: `/dev/null`, or `\\.\NUL` on Windows. Use the constant where Nushell needs a value while it parses the code, such as a parameter's default value. Writing `--log: path = (null-device)` there fails with "Default values should be constant expressions", but the constant works:

```nu
use std/util [null_device]
def build [--log: path = $null_device] { $log }
build
# => /dev/null
```

After `use std/util` without the `*`, the constant is `$util.null_device`.
:::

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

`use std/log` provides `log debug`, `log info`, `log warning`, `log error` and `log critical`. Each one prints its message to stderr, but only when its level is at or above [`$env.NU_LOG_LEVEL`](./special_variables.md#env-nu-log-level). See [`echo`, `print`, and `log` commands](./stdout_stderr_exit_codes.md#echo-print-and-log-commands) for an example of each.

### Log line format

Two environment variables decide what a log line looks like. `$env.NU_LOG_FORMAT` is the template for the whole line, and `$env.NU_LOG_DATE_FORMAT` is the [`format date`](/commands/docs/format_date.md) pattern for its timestamp. `use std/log` sets each of them to its default unless it already has a value:

```nu
use std/log
$env.NU_LOG_FORMAT
# => %ANSI_START%%DATE%|%LEVEL%|%MSG%%CONTEXT%%ANSI_STOP%
$env.NU_LOG_DATE_FORMAT
# => %Y-%m-%dT%H:%M:%S%.3f
log info "started"
# => 2026-11-14T16:26:52.511|INF|started
```

The template can contain any of these placeholders, in any order, as often as you like:

| Placeholder    | Replaced with                                                                               |
| -------------- | ------------------------------------------------------------------------------------------- |
| `%MSG%`        | The message                                                                                 |
| `%DATE%`       | The current time, formatted with `NU_LOG_DATE_FORMAT`                                       |
| `%LEVEL%`      | The level's prefix, such as `INF`, or its one-letter form, such as `I`, with `--short`      |
| `%CONTEXT%`    | The `--context` record as `key="value"` pairs after a space, or nothing without `--context` |
| `%ANSI_START%` | The level's color                                                                           |
| `%ANSI_STOP%`  | The code that resets the color                                                              |

Text around the placeholders is printed as it is. Changing either variable changes every later log line:

```nu
$env.NU_LOG_FORMAT = "[%DATE%] %LEVEL%: %MSG%%CONTEXT%"
$env.NU_LOG_DATE_FORMAT = "%H:%M:%S"
log info "cache rebuilt" --context {entries: 120, ms: 34}
# => [16:26:52] INF: cache rebuilt entries="120" ms="34"
log warning "disk almost full" --short
# => [16:26:52] W: disk almost full
```

A `--format` given to a single call takes the place of `NU_LOG_FORMAT` for that call. An empty `--format ""` counts as no format, so the call falls back on `NU_LOG_FORMAT`. `log custom` takes its template as an argument and doesn't read `NU_LOG_FORMAT`, though its `%DATE%` still follows `NU_LOG_DATE_FORMAT`.

Because these are environment variables, scripts you start from the shell, such as `nu build.nu`, inherit them and log in the same format. The color codes are part of the line whether or not stderr is a terminal, so a log saved to a file (`nu build.nu 2> build.log` in another shell) contains them as well. Leave `%ANSI_START%` and `%ANSI_STOP%` out of the template to get plain lines.

### Levels, prefixes and colors

Four commands return the tables that `std/log` uses for its five levels, as records keyed by the level's name. `log log-level` gives each level's number, `log log-prefix` its prefix, `log log-short-prefix` its one-letter prefix, and `log log-ansi` the escape code for its color:

```nu
log log-level
# => ╭──────────┬────╮
# => │ CRITICAL │ 50 │
# => │ ERROR    │ 40 │
# => │ WARNING  │ 30 │
# => │ INFO     │ 20 │
# => │ DEBUG    │ 10 │
# => ╰──────────┴────╯
log log-prefix
# => ╭──────────┬─────╮
# => │ CRITICAL │ CRT │
# => │ ERROR    │ ERR │
# => │ WARNING  │ WRN │
# => │ INFO     │ INF │
# => │ DEBUG    │ DBG │
# => ╰──────────┴─────╯
```

The short prefixes are `C`, `E`, `W`, `I` and `D`. The colors are the codes of `ansi red_bold` for CRITICAL, `ansi red` for ERROR, `ansi yellow` for WARNING, `ansi default` for INFO and `ansi default_dimmed` for DEBUG, so `(log log-ansi).WARNING == (ansi yellow)` is `true`.

These lookups let you name a level instead of hard-coding its number or prefix. `log set-level`, for instance, takes a number:

```nu
log set-level (log log-level).DEBUG
log debug "cache hit"
# => [16:26:52] DBG: cache hit
```

They also help with `log custom`. It works out the prefix and color for itself only when the level is one of the five numbers in `log log-level`, and it reports an error listing them for any other number. A level of your own needs `--level-prefix` and `--ansi`, and it can borrow a color from an existing level:

```nu
log custom "retrying request" "%ANSI_START%%LEVEL% %MSG%%ANSI_STOP%" 25 --level-prefix NOTE --ansi (log log-ansi).WARNING
# => NOTE retrying request
```

## The Standard Library Candidate Module

`std-rfc`, found in the [nushell Repository](https://github.com/nushell/nushell/tree/main/crates/nu-std/std-rfc), serves as a staging ground for possible Standard Library additions.

`std-rfc` ships with Nushell, so its submodules can be imported the same way as the Standard Library's, for example `use std-rfc/str`. It currently includes the `conversions`, `date`, `iter`, `kv`, `path`, `pb`, `random`, `str`, `tables`, `url`, and `xml` submodules.

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

### Universal variables with `std-rfc/kv`

The key-value store is a `std-rfc` module, so it's `use std-rfc/kv *`, not `std/kv`. It keeps each value as NUON in SQLite and needs a Nushell built with the `sqlite` feature, which the default build includes. By default `kv set`, `kv get`, `kv list` and `kv drop` use the in-memory database that [`stor`](/commands/docs/stor.md) manages, which is gone when Nushell exits. With `--universal` (`-u`), they use a database file instead, and every Nushell session that uses the same file sees the same keys:

```nu
use std-rfc/kv *
kv set --universal EDITOR hx
kv set --universal retries 3
kv list --universal
# => ╭───┬─────────┬───────╮
# => │ # │   key   │ value │
# => ├───┼─────────┼───────┤
# => │ 0 │ EDITOR  │ hx    │
# => │ 1 │ retries │     3 │
# => ╰───┴─────────┴───────╯
```

`$env.NU_UNIVERSAL_KV_PATH` is the path of that file. When it isn't set, the file is `std_kv_variables.sqlite3` in [`$nu.data-dir`](./special_variables.md#nu). The `kv` commands create the file on first use, but its directory must exist. Give an absolute path. The commands use the value exactly as it is, so a relative path points somewhere else after a `cd`, and a leading `~` isn't expanded. Expand it yourself:

```nu
$env.NU_UNIVERSAL_KV_PATH = ('~/nu-kv.sqlite3' | path expand)
```

The universal keys can also become environment variables in every running session, the way universal variables work in fish. `kv universal-variable-hook` returns a closure that loads each universal key into `$env` and then sets `$env.NU_KV_UNIVERSALS` to `true`. Add it as a [`pre_execution` hook](./hooks.md#pre-execution-hooks) in `config.nu`:

```nu
use std-rfc/kv *
$env.config.hooks.pre_execution ++= [(kv universal-variable-hook)]
```

The hook runs before each command line you enter. So after `kv set -u EDITOR hx` in one session, `$env.EDITOR` is `hx` from the next command on, in that session and in every other one that has the hook. Values keep their type, so `$env.retries` from the example above is an `int`.

`$env.NU_KV_UNIVERSALS` tells `kv drop --universal` that universal keys are loaded as environment variables. When it is `true`, `kv drop -u` also removes the environment variable of the same name from the session that runs it. The hook sets it for you. If you load the keys some other way, for example once at startup with `kv list -u | transpose -dr | load-env`, set `$env.NU_KV_UNIVERSALS = true` yourself.

::: warning
`std-rfc/kv` is a candidate module, and in Nushell 0.117.0 universal variables have some rough edges:

- Dropping a key doesn't reach other sessions. Their hook only loads the keys that still exist, so the variable stays set there until the session ends or you remove it with `hide-env`.
- While no universal keys are stored, the hook fails before every command, with `load-env` reporting "Unsupported input". Store at least one key with `kv set -u` before you add the hook.
- Programs started from a session with the hook inherit `NU_KV_UNIVERSALS` as the string `"true"`. In a script or `nu -c` command started that way, `kv drop -u` fails with "The 'and' operator does not work on values of type 'string'", after it has already removed the key from the database. Run `hide-env NU_KV_UNIVERSALS`, or set it to the boolean `true`, before `kv drop -u` there.

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

You will not be able to import the library, any of its submodules, nor use any of its commands, when it is disabled in this way. This includes the `banner` and `pwd` commands from `std/prelude`.

## Using `std/dirs` in Modules

::: warning Important!
`std/dirs` sets up its environment variables in an `export-env` block. If your own module imports it with a top-level `use std/dirs`, that block doesn't run when your module is imported, and `dirs` fails with `Cannot find column 'DIRS_LIST'`. To use the `std/dirs` module in your own module, please see [this caveat](./modules/creating_modules.md#export-env-runs-only-when-the-use-call-is-evaluated) in the "Creating Modules" Chapter.

`std/log` doesn't need this. Its commands fall back to their default formats when its environment variables aren't set.

:::

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
