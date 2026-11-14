---
next:
  text: Programming in Nu
  link: /book/programming_in_nu.md
---

# Special Variables

Nushell makes available and uses a number of special variables and constants. Many of these are mentioned or documented in other places in this Book, but this page
should include _all_ variables for reference.

[[toc]]

## `$nu`

The `$nu` constant is a record containing several useful values:

- `default-config-dir`: The directory where the configuration files are stored and read. See [Configuration - Startup Variables](./configuration.md#startup-variables) for how Nushell chooses it.
- `config-path`: The path of the main Nushell config file, normally `config.nu` in the config directory, or the file given with `nu --config`.
- `env-path`: The optional environment config file, normally `env.nu` in the config directory, or the file given with `nu --env-config`.
- `history-path`: The text or SQLite file storing the command history. By default it is `history.txt` or `history.sqlite3` in the config directory, following `$env.config.history.file_format`. When `$env.config.history.path` names a directory, the default file name is added to it. When `history.path` is `null`, the value is an empty string. `nu --no-history` doesn't change it. Nushell sets this value when it finishes starting, so a change to the history settings after that, for example in `nu -c`, doesn't show here.
- `loginshell-path`: The optional config file which runs for login shells, normally `login.nu` in the config directory.
- `plugin-path`: The plugin registry file, normally `plugin.msgpackz` in the config directory, or the file given with `nu --plugin-config`. With `-n`, Nushell loads no registry, but the value still shows the file it would have read.
- `home-dir`: The user's home directory which can be accessed using the shorthand `~`. Nushell gets it from the operating system when it starts. On Unix, that is the `HOME` variable, or the user's entry in the system's user database when `HOME` isn't set. Assigning `$env.HOME` later changes neither `$nu.home-dir` nor `~` (see [`$env.HOME`](#env-home)). If the operating system reports no home directory, reading `$nu.home-dir` is an error.
- `data-dir`: The data directory for Nushell, which includes the `./vendor/autoload` directories loaded at startup and other user data. When `XDG_DATA_HOME` is set to an absolute path, it is `nushell` inside that directory. A relative `XDG_DATA_HOME` is ignored without a warning. Otherwise it is `~/.local/share/nushell` on Linux, and the same directory as the configuration on macOS (`~/Library/Application Support/nushell`) and Windows (`%APPDATA%\nushell`).
- `cache-dir`: A directory for non-essential (cached) data. Nushell doesn't store anything there itself. See [Configuration - Startup Variables](./configuration.md#startup-variables) for its default location and the `XDG_CACHE_HOME` override.
- `vendor-autoload-dirs`: A list of directories where third-party applications should install configuration files that will be auto-loaded during startup. [Configuration - Autoload directories](./configuration.md#autoload-directories) lists the directories in it, in the order Nushell loads them.
- `user-autoload-dirs`: A list with one directory, `autoload` in the config directory, for your own startup files. Nushell doesn't create it. See [Configuration - Autoload directories](./configuration.md#autoload-directories) for the order in which the files load.
- `temp-dir`: A path for temporary files that should be writable by the user. It comes from `TMPDIR` on Unix (`/tmp` when `TMPDIR` isn't set) and from `TMP` or `TEMP` on Windows. On macOS, it is usually under `/private/var/folders`, because Nushell resolves the symbolic link in the usual `TMPDIR`.
- `pid`: The PID of the currently running Nushell process.
- `os-info`: Information about the host operating system, as a record with the fields `name`, `arch`, `family`, and `kernel_version`. On a Mac with Apple silicon:

  ```nu
  $nu.os-info
  # => ╭────────────────┬─────────╮
  # => │ name           │ macos   │
  # => │ arch           │ aarch64 │
  # => │ family         │ unix    │
  # => │ kernel_version │ 27.2.0  │
  # => ╰────────────────┴─────────╯
  ```

- `startup-time`: How long Nushell took to start (a duration). The clock starts when Nushell's own `main` function begins, so the time the operating system spends loading the `nu` executable isn't counted, and `exec nu` starts a new count. In the REPL, the value is final once the first prompt is ready, and it includes loading configuration files and plugins, running startup hooks, and rendering the prompt. With `nu -c` or a script, it is final when the command or script starts running. With `--lsp`, `--mcp`, or `--dap`, it is final once the configuration files have run, when the server starts serving. Before then, for example while a configuration file is being evaluated, it holds the time elapsed so far. The startup banner shows this value; use `banner --no-startup-time` to hide it.
- `is-interactive`: A boolean indicating whether Nushell was started as an interactive shell (`true`) or is running a script or command-string. For example:

  ```nu
  $nu.is-interactive
  # => true
  nu -c "$nu.is-interactive"
  # => false

  # Force interactive with --interactive (-i)
  nu -i -c "$nu.is-interactive"
  # => true
  ```

  Note: When started as an interactive shell (the REPL), startup config files are processed. When started as a non-interactive shell, no config files are read unless explicitly called via flag. `--interactive (-i)` doesn't change that. `nu -i -c` and `nu -i script.nu` still read no config files, and they exit when they finish.

  On Unix, when standard input is a terminal, `-i` does make Nushell take over the terminal the way the REPL does. It moves into its own process group, makes that group the terminal's foreground process group, and ignores job-control signals such as `SIGTSTP`, so Ctrl+Z doesn't suspend it.

- `is-login`: `true` when Nushell was started as a login shell, either with `--login` (`-l`) or with a program name (`argv[0]`) that begins with `-`. `login`, `sshd`, and many terminal emulators start a login shell the second way, as `-nu`.
- `history-enabled`: `false` when Nushell was started with `nu --no-history`. The REPL then neither reads nor writes a history file. The Up arrow still recalls lines from the current session, and the [`history`](/commands/docs/history.md) command returns nothing. Setting `$env.config.history.path = null` in `config.nu` also keeps history out of a file, but `history-enabled` stays `true` and the `history` command fails with an error.
- `current-exe`: The full path to the currently-running `nu` binary. Can be combined with `path dirname` (which is constant) to determine the directory where the binary is located.
- `is-lsp`: `true` when Nushell was started as a Language Server Protocol (LSP) server with `nu --lsp`. See [Language server](./language_server.md).
- `is-mcp`: `true` when Nushell is running as a Model Context Protocol (MCP) server, started with `nu --mcp`. See [MCP Server](./mcp.md).
- `is-dap`: `true` when Nushell was started as a Debug Adapter Protocol (DAP) server with `nu --dap`. See [Debugging Scripts](./debugging.md).

  In these three modes, `print` writes to stderr so that it doesn't interfere with the protocol messages on stdout.

When one of the paths from `default-config-dir` to `cache-dir`, or `temp-dir`, exists, Nushell resolves the symbolic links in it. So if your configuration directory is a link into a dotfiles repository, `$nu.default-config-dir` and `$nu.config-path` show the directory in the repository. The two autoload lists keep their paths as they are.

## `$env`

`$env` is a special mutable variable containing the current environment variables. As with any process, the initial environment is inherited from the parent process which started `nu`.

There are also several environment variables that Nushell uses for specific purposes:

### `$env.CMD_DURATION_MS`

The amount of time in milliseconds that the previous command took to run. The value is a string, such as `"18"`, so convert it with [`into int`](/commands/docs/into_int.md) before doing math with it. Only the REPL sets it, after each command. In `nu -c` and in scripts it doesn't exist. Before the first command it is `"0823"`, a value that no real duration produces (it is the date of Nushell's first release), so a prompt can check `$env.CMD_DURATION_MS == "0823"` to tell whether any command has run yet.

### `$env.COLUMNS` and `$env.LINES`

On Unix, Nushell asks the terminal for its size. When there is no terminal at all, as in a cron job or a CI runner with no controlling terminal, it reads the width from `COLUMNS` and the height from `LINES` instead. Both must be set to whole numbers greater than zero, or Nushell falls back to 80 columns by 24 rows. The width decides where [`table`](/commands/docs/table.md), [`grid`](/commands/docs/grid.md), and `help` output wrap. The height decides when `$env.config.footer_mode = "auto"` shows a table footer. [`term size`](/commands/docs/term_size.md) reports both values.

A terminal that is attached always wins, even when the output is redirected to a file or a pipe. Nushell reads `COLUMNS` and `LINES` from the environment it was started with, so set them before starting `nu`. Assigning `$env.COLUMNS` inside Nushell has no effect. Windows doesn't use these variables.

### `$env.config`

`$env.config` is the main configuration record used in Nushell. Settings are documented in `config nu --doc`.

Assigning `$env.config` or one of its fields applies and checks the new settings right away, and so does [`load-env`](/commands/docs/load-env.md) with a record that has a `config` key. An invalid value is reported as an error at that point (see [Errors in settings](./configuration.md#errors-in-settings)). Because it is a record, `$env.config` is never passed to external commands.

The `nu` flags `--table-mode` (`-m`) and `--error-style` override `table.mode` and `error_style` for one run, after the configuration files have loaded (see [Configuration - `nu` flags](./configuration.md#nu-flags)). `-m` works in the REPL, with `-c`, and for scripts, although `$env.config.table.mode` keeps showing the configured value. It accepts the mode names listed in [Coloring and Theming - Table Borders](./coloring_and_theming.md#table-borders), in any case.

### `$env.CURRENT_FILE`

Inside a script, module, or sourced-file, this variable holds the fully-qualified filename. Note that this
information is also available as a constant through the [`path self`](/commands/docs/path_self.md) command.
Nushell sets it, so it can't be assigned or hidden. See [Automatic variables](./environment.md#automatic-variables).

`CURRENT_FILE` and `FILE_PWD` are set at these times:

- When you run a script with `nu script.nu` or [`run`](/commands/docs/run.md), for the whole run.
- While [`source`](/commands/docs/source.md) runs a file. Afterwards the caller's values come back, so a command defined in the sourced file doesn't see the file's path when you call it later.
- While [`use`](/commands/docs/use.md) or [`overlay use`](/commands/docs/overlay_use.md) runs a module's `export-env` block. These values then stay in the environment of the code that called `use`. After a script imports a module that has an `export-env` block, `$env.CURRENT_FILE` in the script, and in the module's commands, is the module's path, not the script's. A module without `export-env` doesn't set them at all.

Apart from that, neither variable exists in the REPL or in `nu -c`, so use `$env.CURRENT_FILE?` where it may be missing.

When code needs the path of the file it is written in, `path self` is more reliable. It runs at parse time, so it always names the file that contains it. Given a path, it resolves that path from the file's directory, so in `/home/me/scripts/tool.nu` this sets `helpers` to `/home/me/scripts/helpers.nu`:

```nu
const helpers = path self helpers.nu
```

`path self` works only at parse time, in a file. At the REPL or in `nu -c`, `const x = path self` fails with a "File not found" error, and using it at run time, as in `let x = path self`, fails with "this command can only run during parse-time".

### `$env.ENV_CONVERSIONS`

Allows users to specify how to convert certain environment variables to Nushell types. See [ENV_CONVERSIONS](./configuration.md#env-conversions).

### `$env.FILE_PWD`

Inside a script, module, or sourced-file, this variable holds the fully qualified name of the directory in which
the file resides. Note that this value is also available as a constant, using [`path self`](/commands/docs/path_self.md) in the script or module file:

```nu
const this_dir = path self | path dirname
```

Like `CURRENT_FILE`, it can't be assigned or hidden, it doesn't exist in the REPL or in `nu -c`, and it is set at the same times (see [`$env.CURRENT_FILE`](#env-current-file)).

### `$env.HOME`

On Unix, `HOME` is the user's home directory. Nushell reads it once, when it starts, to set [`$nu.home-dir`](#nu) and the directory that `~` expands to. Assigning `$env.HOME` afterwards changes what external commands see, but not `~`:

```nu
$env.HOME = '/tmp'
'~' | path expand
# => /Users/me
^printenv HOME
# => /tmp
```

To start Nushell with a different home directory, set `HOME` in the environment that starts `nu`.

### `$env.HTTP_PROXY` and other proxy variables

The [`http`](/commands/docs/http.md) commands send their requests through a proxy when `HTTP_PROXY`, `HTTPS_PROXY`, or `ALL_PROXY` is set. Nushell takes the first of the three that is set, in that order, and uses it for every request, whether the URL starts with `http://` or `https://`. So with both `HTTP_PROXY` and `HTTPS_PROXY` set, HTTPS requests also go through `HTTP_PROXY`. Like every name in `$env`, these ignore case, so `http_proxy` and `HTTP_PROXY` are the same variable.

The value is the proxy's URL, such as `http://proxy.example.com:8080`. The scheme can be `http`, `https`, `socks4`, `socks4a`, `socks5`, `socks`, or `socks5h`, and a value without one is treated as `http`. A user name and password in the URL (`http://user:password@proxy.example.com:8080`) are sent to the proxy. If Nushell can't use the value as a proxy URL, for example `ftp://proxy.example.com`, it ignores it and connects directly.

`NO_PROXY` lists hosts that skip the proxy, separated by commas. Each entry is one of:

- an exact host name or IP address, such as `localhost` or `127.0.0.1`
- a domain suffix starting with `.` or `*`, such as `.example.com` or `*.example.com`
- a prefix ending with `.` or `*`, such as `10.0.` or `192.168.*`
- `*`, which matches every host

Entries match the host name only. An entry with a port, such as `localhost:8080`, never matches.

Nushell reads these variables from `$env` each time an `http` command runs, so setting them in `config.nu`, at the prompt, or for a single command with [`with-env`](/commands/docs/with-env.md) works. Two cases behave differently:

- Hiding an inherited proxy variable with `hide-env` doesn't turn the proxy off. With no proxy variable in `$env`, the HTTP library falls back to the environment Nushell was started with. To skip an inherited proxy, set `$env.NO_PROXY = "*"` and leave the proxy variable alone.
- The shared client that `--pool` uses is created on the first `--pool` request and keeps that proxy for the rest of the session. It ignores `NO_PROXY` until you rebuild it with [`http pool`](/commands/docs/http_pool.md).

### `$env.LAST_EXIT_CODE`

The exit code of the last command, usually used for external commands. It is the equivalent of `$?` in POSIX shells. If several external commands in a pipeline fail, it holds the exit code of the rightmost one that failed (see [Pipelines - Failing External Commands in a Pipeline](./pipelines.md#failing-external-commands-in-a-pipeline)). Note that this information is also made available to the `catch` block in a `try` expression for external commands. For instance:

```nu
^ls file-that-does-not-exist e> /dev/null
$env.LAST_EXIT_CODE
# => 2

# or
try {
  ^ls file-that-does-not-exist e> /dev/null
} catch {|e|
  print $e.exit_code
}
# => 2
```

In the REPL, it is `0` when Nushell starts, and after each line it holds the exit code of that line: the external command's own code, or `1` when a Nushell error stopped the line. In `nu -c` and in a script, it doesn't exist until something sets it, so reading `$env.LAST_EXIT_CODE` there is an error. Use `$env.LAST_EXIT_CODE?` to get `null` instead.

A few commands treat it in their own way:

- [`try`](/commands/docs/try.md) with a `catch` sets it to the exit code of the error it caught, which is `1` for a Nushell error. A `try` without `catch` leaves it unchanged, even when the block fails.
- [`complete`](/commands/docs/complete.md) leaves it unchanged. Read the exit code from its `exit_code` column.
- [`do --ignore-errors`](/commands/docs/do.md) sets it to `0` when it hides the failure of an external command. A Nushell error inside it leaves the value unchanged.

On Unix, when a signal kills an external command, the value is the negative signal number, such as `-9` for `SIGKILL`:

```nu
try { ^sh -c 'kill -9 $$' } catch {}
$env.LAST_EXIT_CODE
# => -9
```

### `$env.LC_ALL`, `$env.LC_TIME`, and `$env.LANG`

These standard locale variables set the language and the local formats for dates. Nushell uses the first one that is set, in the order `LC_ALL`, `LC_TIME`, `LANG`, and drops an encoding suffix such as `.UTF-8`. When none is set, it uses the operating system's locale. A locale Nushell doesn't know falls back to `en_US`.

[`format date`](/commands/docs/format_date.md) uses the locale for day and month names and for the `%x`, `%X`, `%c`, and `%r` formats. It reads the variables from `$env`, so `with-env` or an assignment changes the result. On a system with an `en_US` locale:

```nu
let d = 2026-03-01T14:30:00
$d | format date "%A %d %B %Y, %X"
# => Sunday 01 March 2026, 02:30:00 PM
with-env { LC_TIME: de_DE.UTF-8 } { $d | format date "%A %d %B %Y, %X" }
# => Sonntag 01 März 2026, 14:30:00
```

The `datetime_format` settings in `$env.config`, which control how Nushell displays dates, work differently. They read the locale from the environment Nushell was started with, so changing `$env.LC_TIME` inside Nushell doesn't change how dates are shown. Set the variable before starting `nu`:

```nu
LC_TIME=de_DE nu -n -c '$env.config.datetime_format.normal = "%A %d %B %Y"; 2026-03-01T14:30:00'
# => Sonntag 01 März 2026
```

### `$env.NU_BACKTRACE`

When `NU_BACKTRACE` is set, an error report also shows the calls that led to the error. Each custom command or closure call that the error passed through, including a closure run with [`do`](/commands/docs/do.md), adds a `chained_error` entry labeled "error happened when running this", starting with the outermost call. The original error comes last:

```nu
NU_BACKTRACE=1 nu -n -c 'def inner [] { error make {msg: boom} }; def outer [] { inner }; outer'
# => Error: chained_error
# =>
# =>   × oops
# =>    ╭─[source:1:66]
# =>  1 │ def inner [] { error make {msg: boom} }; def outer [] { inner }; outer
# =>    ·                                                                  ──┬──
# =>    ·                                                                    ╰── error happened when running this
# =>    ╰────
# =>
# => Error: chained_error
# =>
# =>   × oops
# =>    ╭─[source:1:57]
# =>  1 │ def inner [] { error make {msg: boom} }; def outer [] { inner }; outer
# =>    ·                                                         ──┬──
# =>    ·                                                           ╰── error happened when running this
# =>    ╰────
# =>
# => Error:
# =>   × boom
# =>    ╭─[source:1:27]
# =>  1 │ def inner [] { error make {msg: boom} }; def outer [] { inner }; outer
# =>    ·                           ───────────
# =>    ╰────
```

Without `NU_BACKTRACE`, the same command prints only the `boom` error. An error from a stream, such as one raised inside [`each`](/commands/docs/each.md), also gets a label at each call the stream passed through.

Any value turns it on, including `0` and `false`. Nushell checks its global environment, which takes in your changes after each startup file and after each line you run at the prompt. So you can set `NU_BACKTRACE` before starting `nu`, in `config.nu`, or at the prompt, where it applies from the next line on. Setting it inside a script or a `nu -c` command doesn't affect that same script or command.

The chain also changes what [`try`](/commands/docs/try.md) catches. With `NU_BACKTRACE` set, `$e.msg` in a `catch` closure is `oops`, the message of the outer entry, instead of the original message.

### `$env.NU_EXPERIMENTAL_OPTIONS`

A comma-separated list of experimental options to turn on or off when Nushell starts, such as `native-clip,pipefail=false`. Nushell reads it once, before any configuration file, so it has to be in the environment that starts `nu`. It is ignored with `-n`, and for `nu -c` and scripts unless they also load configuration files. See [Configuration - Experimental options](./configuration.md#experimental-options).

These are the options in Nushell 0.117.0:

- `pipefail` (opt-out): a pipeline fails when any external command in it fails. See [Pipelines - Failing External Commands in a Pipeline](./pipelines.md#failing-external-commands-in-a-pipeline).
- `reorder-cell-paths` (opt-out): in a cell path, Nushell selects a row before a column, so `$table.name.0` reads `$table.0.name` and doesn't build the whole `name` column first. With the option off, `$table.name.0` also fails when a later row has no `name` column.
- `enforce-runtime-annotations` (opt-out): Nushell checks the type annotation of `let` and `mut`, and of a later assignment to a `mut` variable, against the value when the code runs, not only when it is parsed. `let x: int = ('"a"' | from json)` fails with a type mismatch. With the option off, `$x` holds the string.
- `dc-glob` (opt-in): one glob engine expands patterns for every command, [`glob`](/commands/docs/glob.md) included. Commands such as `ls`, `rm`, and `cp` then accept `{a,b}` alternatives, as in `ls *.{txt,md}`, and `glob dir/**` lists only the directories below `dir`, not the files.
- `native-clip` (opt-in): adds the built-in `clip copy` and `clip paste` commands. See [Standard Library](./standard_library.md).
- `cell-path-types` (opt-in): the parser works out the type of a cell path, which is otherwise `any`. Type errors then show up before the code runs. For example, `let r = {a: 1}; $r.a | str length` fails to parse because `str length` doesn't take an int. Parsing can get slower.
- `example` (deprecated): a placeholder with no effect. Naming it prints a warning that it will be removed.

### `$env.NU_LIB_DIRS`

::: tip

Prefer the `$NU_LIB_DIRS` constant (see below), which is also available at parse time. At startup, `$env.NU_LIB_DIRS` and `$NU_LIB_DIRS` are both set to the same list: any directories inherited from a `NU_LIB_DIRS` environment variable or passed with `nu --include-path`, followed by the default directories. The environment variable is searched after the constant.

:::

A list of directories which will be searched when using the `source`, `use`, or `overlay use` commands.

When Nushell inherits `NU_LIB_DIRS` as a string, it splits the string on `:` (`;` on Windows), as it does for `PATH`. `nu --include-path` (`-I`) splits its value on `:`, `;`, and the ASCII record separator character, on every platform, so one flag can add several directories:

```nu
nu -n -I '/opt/nu/lib:/srv/nu/lib' -c '$NU_LIB_DIRS'
# => ╭───┬───────────────────────────────────────────────────────────╮
# => │ 0 │ /opt/nu/lib                                               │
# => │ 1 │ /srv/nu/lib                                               │
# => │ 2 │ /Users/me/Library/Application Support/nushell/scripts     │
# => │ 3 │ /Users/me/Library/Application Support/nushell/completions │
# => ╰───┴───────────────────────────────────────────────────────────╯
```

See also:

- The `$NU_LIB_DIRS` constant below
- [Module Path](./modules/using_modules.md#module-path)
- [Configuration - `$NU_LIB_DIRS`](./configuration.md#nu-lib-dirs-constant)

### `$env.NU_LOG_LEVEL`

The [standard library](/book/standard_library.md) offers logging in `std/log`. The `NU_LOG_LEVEL` environment variable is used to define the log level being used for custom commands, modules, and scripts.

```nu
nu -c '1 | print; use std/log; log debug 1111; 9 | print'
# => 1
# => 9

nu -c '1 | print; use std/log; NU_LOG_LEVEL=debug log debug 1111; 9 | print'
# => 1
# => 2025-07-12T21:27:30.080|DBG|1111
# => 9

nu -c '1 | print; use std/log; $env.NU_LOG_LEVEL = "debug"; log debug 1111; 9 | print'
# => 1
# => 2025-07-12T21:27:57.888|DBG|1111
# => 9
```

Each level has a number, and `std/log` prints a message when its level is at or above `NU_LOG_LEVEL`. The variable takes the number or one of the names, in any case:

| Level    | Number | Names                          |
| -------- | ------ | ------------------------------ |
| critical | 50     | `CRITICAL`, `CRIT`, `CRT`, `C` |
| error    | 40     | `ERROR`, `ERR`, `E`            |
| warning  | 30     | `WARNING`, `WARN`, `WRN`, `W`  |
| info     | 20     | `INFO`, `INF`, `I`             |
| debug    | 10     | `DEBUG`, `DBG`, `D`            |

A number between two levels works as a threshold, so `NU_LOG_LEVEL=15` shows `log info` but not `log debug`. When the variable isn't set, or holds a name that isn't in the table, the level is `INFO`.

Note that `$env.NU_LOG_LEVEL` is different from `nu --log-level`, which sets the log level for built-in native Rust Nushell commands. It does not influence the `std/log` logging used in custom commands and scripts.

```nu
nu --log-level 'debug' -c '1 | print; use std/log; log debug 1111; 9 | print'
# => … a lot more log messages, with references to the Nushell command Rust source files
#      and without our own `log debug` message
# => 1
# => 9
# => …
```

`--log-level` takes `error`, `warn`, `info`, `debug`, `trace`, or `perf`. `perf` shows only the `perf:` lines that report how long each step of startup and evaluation took. By default the messages go to stderr, and only those from Nushell's own Rust modules (`nu`, `nu_cli`, `nu_command`, and so on) are shown, not those from the libraries it uses. The other logging flags change that. Without `--log-level`, Nushell logs nothing:

- `--log-target` sends the messages to `stderr` (the default), `stdout`, `mixed`, or `file`. `mixed` writes error messages to stderr and the others to stdout. `file` requires `--log-file`.
- `--log-file` names the file for `--log-target file`. It requires `--log-target file` and `--log-level`. Nushell empties the file when it starts.
- `--log-include` shows only the messages from Rust modules whose names start with the given prefixes, in place of the default `nu` filter. `--log-include nu_cli`, for example, drops the `perf:` lines, which come from the `nu` module.
- `--log-exclude` hides the messages from modules whose names start with the given prefixes.

`--log-include` and `--log-exclude` take several prefixes, as separate arguments or separated by commas, optionally in brackets: `--log-include nu_cli nu_command` or `--log-include '[nu_cli, nu_command]'`. They take every argument that follows, up to the next flag. So in `nu --log-level debug --log-include nu_cli script.nu`, `script.nu` is read as a prefix, and Nushell starts the REPL instead of the script. Attach the value with `=` to end the list: `--log-include=nu_cli script.nu`.

### `$env.NU_PLUGIN_DIRS`

A list of directories that [`plugin add`](/commands/docs/plugin_add.md) searches for a plugin given by a relative path, after the current directory and the `$NU_PLUGIN_DIRS` constant. It starts as an empty list. `plugin use`, `plugin rm`, and `plugin stop` don't search it.

A `NU_PLUGIN_DIRS` that Nushell inherits as a string stays a single string. Unlike `NU_LIB_DIRS`, it isn't split, and the plugin commands ignore a value that isn't a list. Set it as a list in `config.nu`.

See also:

- [Plugin Search Path](./plugins.md#plugin-search-path)

### `$env.NU_VENDOR_AUTOLOAD_DIR`

Adds a directory to `$nu.vendor-autoload-dirs`. Packagers can also set it when building Nushell. See [Configuration - Startup Variables](./configuration.md#startup-variables).

### `$env.NU_VERSION`

The current Nushell version. The same as `(version).version`, but, as an environment variable, it is exported to and can be read by child processes.

From outside Nushell, `nu --version` (`-v`) prints the same version number and nothing else. For the build details, such as the commit, the Rust version, and the enabled features, run the [`version`](/commands/docs/version.md) command.

### `$env.NUSHELL_SHELLS`, `$env.NUSHELL_CURRENT_SHELL`, and `$env.NUSHELL_LAST_SHELL`

Leftovers from the built-in `shells` and `enter` commands of older Nushell versions. Nothing in Nushell reads them, but they can show up in `$env`. When you change directories at the prompt by typing just a path (auto-cd), the REPL writes the new directory into the `NUSHELL_SHELLS` list, at the index in `NUSHELL_CURRENT_SHELL` (`0` when it isn't set), and sets `NUSHELL_LAST_SHELL`. [`cd`](/commands/docs/cd.md) doesn't touch them. To keep a list of directories and move between them, use the [`dirs` module](./directory_stack.md).

### `$env.PATH`

The search path for executing other applications. It is initially inherited from the parent process as a string, but converted to a Nushell `list` at startup for easy access.

It is converted back to a string before running a child-process. The child gets the entries joined with the operating system's separator (`:`, or `;` on Windows), with a leading `~` in each entry expanded:

```nu
$env.PATH = ['~/bin' '/usr/bin']
^printenv PATH
# => /Users/me/bin:/usr/bin
```

Assigning a string, as in `$env.PATH = '/opt/bin:/usr/bin'`, keeps it a string. [`load-env`](/commands/docs/load-env.md), [`with-env`](/commands/docs/with-env.md), a `PATH=... cmd` prefix, and the next assignment of `$env.ENV_CONVERSIONS` split a string `PATH` into a list. `load-env` and `with-env` fail with `PATH must be a list of strings` when they are given a `PATH` list that holds anything other than strings, and so does assigning `$env.ENV_CONVERSIONS` while `PATH` is such a list.

### `$env.PATHEXT`

On Windows, `PATHEXT` lists the file extensions that count as programs, separated by `;`, such as `.COM;.EXE;.BAT;.CMD`. Nushell uses it in two places:

- To run an external command, Nushell looks the name up with the `PATHEXT` it inherited when it started, so `foo` finds `foo.exe` or `foo.bat` on the path. Changing `$env.PATHEXT` inside Nushell doesn't affect this lookup. When the file it finds ends in an extension other than `.COM`, `.EXE`, `.BAT`, `.CMD`, or `.PS1`, Nushell runs it through `cmd.exe /D /C`, so a file association you made with `assoc` and `ftype` applies. For example, after you associate `.nu` files with `nu.exe` and add `.NU` to `PATHEXT` before starting Nushell, typing `myscript` runs `myscript.nu`. A `.PS1` file runs with `powershell.exe -File` instead.
- [`which`](/commands/docs/which.md) reads `$env.PATHEXT`, so it follows changes you make inside Nushell, including with `with-env`. After `hide-env PATHEXT`, `which` doesn't fall back to the inherited value.

Other platforms ignore `PATHEXT`.

### `$env.PROCESS_PATH`

When _executing a script_, this variable represents the name and relative path of the script. Unlike `CURRENT_FILE` and `FILE_PWD`, it is not present when sourcing a file or importing a module.

It holds the path exactly as it was given on the command line, such as `./tool.nu` for `nu ./tool.nu`, while `CURRENT_FILE` holds the absolute path. Neither one resolves symbolic links.

Only `nu script.nu` sets it. [`run`](/commands/docs/run.md) sets `CURRENT_FILE` and `FILE_PWD` for the script it runs, but not `PROCESS_PATH`, so that script sees the value of its caller: the calling script's path, or nothing in the REPL.

### `$env.PROMPT_*` and `$env.TRANSIENT_PROMPT_*`

A number of variables are available for configuring the Nushell prompt that appears on each commandline. See also:

- [Configuration - Prompt Configuration](./configuration.md#prompt-configuration)
- `config nu --doc`

### `$env.PWD`

The current directory, as an absolute path. [`cd`](/commands/docs/cd.md) changes it, and the change follows the same scoping rules as other environment variables. Nushell sets `PWD`, `FILE_PWD`, and `CURRENT_FILE` itself, so assigning or hiding them is an error. See [Automatic variables](./environment.md#automatic-variables).

At startup, `PWD` is the directory the `nu` process starts in, even if the parent passed a `PWD` variable that names another directory. External commands start in `$env.PWD`.

### `$env.RUST_BACKTRACE`

If Nushell itself crashes (a Rust "panic"), it prints the panic message and suggests setting `RUST_BACKTRACE=1`. With that variable set, the report also lists the Rust functions that were running when the crash happened. Include that backtrace when you report the crash as a bug.

Nushell reads `RUST_BACKTRACE` from the environment it was started with, so assigning it inside the session that crashes doesn't help. Start a new `nu` with it set, then repeat the steps that led to the crash:

```nu
RUST_BACKTRACE=1 nu
```

`RUST_BACKTRACE=full` prints a longer backtrace. This variable is about crashes in Nushell's Rust code. To trace an error through the Nushell commands that led to it, use [`NU_BACKTRACE`](#env-nu-backtrace).

### `$env.SHLVL`

`SHLVL` is incremented by most shells when entering a new subshell. It can be used to determine the number of nested shells. For instance,
if `$env.SHLVL == 2` then typing `exit` should return you to a parent shell.

Nushell adds one to it only when it starts a REPL, not for `nu -c` or a script. In the REPL, `SHLVL` is an int. Elsewhere it stays the string that Nushell inherited, if any. An inherited value that isn't a number counts as `0`.

### `$env.SSH_CLIENT`

SSH servers set `SSH_CLIENT` in the session they start. When it is set, the file names in `ls` output are not clickable links. Normally, with `$env.config.shell_integration.osc8` on, as it is by default, Nushell writes each name as an OSC 8 hyperlink to the local path, which the terminal can open. Over SSH, those paths are on the remote machine, so Nushell leaves the links out.

Nushell reads `SSH_CLIENT` from the environment it was started with, so assigning or hiding `$env.SSH_CLIENT` inside Nushell changes nothing. It checks only `SSH_CLIENT`, not `SSH_CONNECTION` or `SSH_TTY`.

### `$env.TERM_PROGRAM`

Many terminals set `TERM_PROGRAM` to their own name. Nushell looks for one value, `vscode`, which the terminal in Visual Studio Code sets. In that terminal, with `$env.config.shell_integration.osc633` on, as it is by default, the REPL marks the prompt, the command line, and each command's start and end with VS Code's OSC 633 escape sequences instead of the standard OSC 133 ones. It also sends VS Code the current directory and the text of each command it runs. With any other value, or with `osc633` turned off, the REPL sends OSC 133 marks when `$env.config.shell_integration.osc133` is on.

### `$env.XDG_CACHE_HOME`

Can be used to optionally override the `$nu.cache-dir` location. See [Configuration - Startup Variables](./configuration.md#startup-variables).

### `$env.XDG_CONFIG_HOME`

Can be used to optionally override the `$nu.default-config-dir` location. See [Configuration - Startup Variables](./configuration.md#startup-variables).

### `$env.XDG_DATA_HOME`

Can be used to optionally override the `$nu.data-dir` location. See [Configuration - Startup Variables](./configuration.md#startup-variables).

## `$in`

The `$in` variable represents the pipeline input into an expression. See [Pipelines - The Special `$in` Variable](./pipelines.md#pipeline-input-and-the-special-in-variable).

## `$it`

`$it` is a special variable that is only available in a "row condition", a convenient shorthand which simplifies field access. Row conditions are accepted by [`where`](/commands/docs/where.md), and also by [`any`](/commands/docs/any.md), [`all`](/commands/docs/all.md), [`take while`](/commands/docs/take_while.md), [`take until`](/commands/docs/take_until.md), [`skip while`](/commands/docs/skip_while.md), [`skip until`](/commands/docs/skip_until.md), [`chunk-by`](/commands/docs/chunk-by.md), and [`record where`](/commands/docs/record_where.md). In a row condition, `$it` is the current item, and the columns of a record can also be named directly. See `help where` for more information.

```nu
[1 5 12 3] | where $it > 4
# => ╭───┬────╮
# => │ 0 │  5 │
# => │ 1 │ 12 │
# => ╰───┴────╯
[1 5 12 3] | any $it > 10
# => true
```

`record where` filters the fields of a record, and the item is each field, as a record with `key` and `value` columns. With `--keys` or `--values`, `$it` is only the key or only the value:

```nu
{a: 1, b: 20, c: 7} | record where $it.value > 5
# => ╭───┬────╮
# => │ b │ 20 │
# => │ c │ 7  │
# => ╰───┴────╯
{a: 1, b: 20, c: 7} | record where --values $it > 5
# => ╭───┬────╮
# => │ b │ 20 │
# => │ c │ 7  │
# => ╰───┴────╯
```

## `$ans`

The `$ans` variable holds information about the most recent command run in the REPL: its `exit_code`, its `duration`, and the `command` text.

Only the REPL sets `$ans`. It is `null` until the first command at the prompt finishes, and always `null` in scripts and in `nu -c`. Pressing Enter on an empty line doesn't change it, and neither does changing directory by typing just a path (auto-cd).

`$ans.last` holds the most recent output, but only when `$env.config.max_last_result_size` is set to a size greater than zero. The default is `0b`, which disables it (and leaves `last` out of `$ans`). To enable it, add something like this to your `config.nu`:

```nu
$env.config.max_last_result_size = 1MB
```

Note that `$ans.last` only updates if the final part of the pipeline is an internal command. An external command output can be stored if piped into `collect`.

```nu
fd . | collect
# => bar/
# => foo.txt
$ans
# => ╭───────────┬──────────────────╮
# => │ last      │ bar/             │
# => │           │ foo.txt          │
# => │ exit_code │ 0                │
# => │ duration  │ 18ms 904µs 776ns │
# => │ command   │ fd . | collect   │
# => ╰───────────┴──────────────────╯
```

`max_last_result_size` can't be negative. Assigning a negative size is an `invalid_config` error. A result larger than `max_last_result_size` is truncated, and displaying `$ans.last` then prints a `nu::shell::last_result_truncated` warning. Running `$ans` (or `$ans.<field>`) by itself updates `exit_code`, `duration`, and `command`, but keeps the previous `last` value. `ans` is a reserved name, so `let ans = ...` is an error.

## `$NU_LIB_DIRS`

A constant version of `$env.NU_LIB_DIRS` - a list of directories which will be searched when using the `source`, `use`, or `overlay use` commands. See also:

- [Module Path](./modules/using_modules.md#module-path)
- [Configuration - `$NU_LIB_DIRS`](./configuration.md#nu-lib-dirs-constant)

## `$NU_PLUGIN_DIRS`

A constant version of `$env.NU_PLUGIN_DIRS` - a list of directories which will be searched when registering plugins with `plugin add`. `plugin add` looks for a relative plugin path in the current directory first, then in the directories of `$NU_PLUGIN_DIRS`, and then in those of `$env.NU_PLUGIN_DIRS`. [`plugin use`](/commands/docs/plugin_use.md), [`plugin rm`](/commands/docs/plugin_rm.md), and [`plugin stop`](/commands/docs/plugin_stop.md) don't search it: they resolve a file name against the current directory only.

By default it holds the `plugins` directory in the config directory and the directory that contains the `nu` executable. See also:

- [Plugin Search Path](./plugins.md#plugin-search-path)
