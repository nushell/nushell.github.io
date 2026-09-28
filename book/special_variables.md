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

- `default-config-dir`: The directory where the configuration files are stored and read.
- `config-path`: The path of the main Nushell config file, normally `config.nu` in the config directory.
- `env-path`: The optional environment config file, normally `env.nu` in the config directory.
- `history-path`: The text or SQLite file storing the command history.
- `loginshell-path`: The optional config file which runs for login shells, normally `login.nu` in the config directory.
- `plugin-path`: The plugin registry file, normally `plugin.msgpackz` in the config directory.
- `home-dir`: The user's home directory which can be accessed using the shorthand `~`.
- `data-dir`: The data directory for Nushell, which includes the `./vendor/autoload` directories loaded at startup and other user data.
- `cache-dir`: A directory for non-essential (cached) data.
- `vendor-autoload-dirs`: A list of directories where third-party applications should install configuration files that will be auto-loaded during startup.
- `user-autoload-dirs`: A list of directories where the user may create additional configuration files which will be auto-loaded during startup.
- `temp-dir`: A path for temporary files that should be writable by the user.
- `pid`: The PID of the currently running Nushell process.
- `os-info`: Information about the host operating system.
- `startup-time`: How long Nushell took to start (a duration), measured up to the point where the first prompt is ready. This includes loading configuration files and plugins, running startup hooks, and rendering the prompt. The startup banner shows this value; use `banner --no-startup-time` to hide it.
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

  Note: When started as an interactive shell, startup config files are processed. When started as a non-interactive shell, no config files are read unless explicitly called via flag.

- `is-login`: Indicates whether or not Nushell was started as a login shell.
- `history-enabled`: History may be disabled via `nu --no-history`, in which case this constant will be `false`.
- `current-exe`: The full path to the currently-running `nu` binary. Can be combined with `path dirname` (which is constant) to determine the directory where the binary is located.
- `is-lsp`: `true` when Nushell was started as a Language Server Protocol (LSP) server with `nu --lsp`.
- `is-mcp`: `true` when Nushell is running as a Model Context Protocol (MCP) server, started with `nu --mcp`.
- `is-dap`: `true` when Nushell was started as a Debug Adapter Protocol (DAP) server with `nu --dap`.

  In these three modes, `print` writes to stderr so that it doesn't interfere with the protocol messages on stdout.

## `$env`

`$env` is a special mutable variable containing the current environment variables. As with any process, the initial environment is inherited from the parent process which started `nu`.

There are also several environment variables that Nushell uses for specific purposes:

### `$env.CMD_DURATION_MS`

The amount of time in milliseconds that the previous command took to run.

### `$env.config`

`$env.config` is the main configuration record used in Nushell. Settings are documented in `config nu --doc`.

### `$env.CURRENT_FILE`

Inside a script, module, or sourced-file, this variable holds the fully-qualified filename. Note that this
information is also available as a constant through the [`path self`](/commands/docs/path_self.md) command.

### `$env.ENV_CONVERSIONS`

Allows users to specify how to convert certain environment variables to Nushell types. See [ENV_CONVERSIONS](./configuration.md#env-conversions).

### `$env.FILE_PWD`

Inside a script, module, or sourced-file, this variable holds the fully qualified name of the directory in which
the file resides. Note that this value is also available as a constant, using [`path self`](/commands/docs/path_self.md) in the script or module file:

```nu
const this_dir = path self | path dirname
```

### `$env.LAST_EXIT_CODE`

The exit code of the last command, usually used for external commands — Equivalent to `$?` from POSIX. If several external commands in a pipeline fail, it holds the exit code of the rightmost one that failed (see [Pipelines - Failing External Commands in a Pipeline](./pipelines.md#failing-external-commands-in-a-pipeline)). Note that this information is also made available to the `catch` block in a `try` expression for external commands. For instance:

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

### `$env.NU_LIB_DIRS`

::: tip

Prefer the `$NU_LIB_DIRS` constant (see below), which is also available at parse time. At startup, `$env.NU_LIB_DIRS` and `$NU_LIB_DIRS` are both set to the same list: any directories inherited from a `NU_LIB_DIRS` environment variable or passed with `nu --include-path`, followed by the default directories. The environment variable is searched after the constant.

:::

A list of directories which will be searched when using the `source`, `use`, or `overlay use` commands. See also:

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

Note that `$env.NU_LOG_LEVEL` is different from `nu --log-level`, which sets the log level for built-in native Rust Nushell commands. It does not influence the `std/log` logging used in custom commands and scripts.

```nu
nu --log-level 'debug' -c '1 | print; use std/log; log debug 1111; 9 | print'
# => … a lot more log messages, with references to the Nushell command Rust source files
#      and without our own `log debug` message
# => 1
# => 9
# => …
```

### `$env.NU_PLUGIN_DIRS`

A list of directories which will be searched when registering plugins with `plugin add`. See also:

- [Plugin Search Path](./plugins.md#plugin-search-path)

### `$env.NU_VERSION`

The current Nushell version. The same as `(version).version`, but, as an environment variable, it is exported to and can be read by child processes.

### `$env.PATH`

The search path for executing other applications. It is initially inherited from the parent process as a string, but converted to a Nushell `list` at startup for easy access.

It is converted back to a string before running a child-process.

### `$env.PROCESS_PATH`

When _executing a script_, this variable represents the name and relative path of the script. Unlike the two variables
above, it is not present when sourcing a file or importing a module.

Note: Also unlike the two variables above, the exact path (including symlinks) that was used to _invoke_ the file is returned.

### `$env.PROMPT_*` and `$env.TRANSIENT_PROMPT_*`

A number of variables are available for configuring the Nushell prompt that appears on each commandline. See also:

- [Configuration - Prompt Configuration](./configuration.md#prompt-configuration)
- `config nu --doc`

### `$env.SHLVL`

`SHLVL` is incremented by most shells when entering a new subshell. It can be used to determine the number of nested shells. For instance,
if `$env.SHLVL == 2` then typing `exit` should return you to a parent shell.

### `$env.XDG_CONFIG_HOME`

Can be used to optionally override the `$nu.default-config-dir` location. See [Configuration - Startup Variables](./configuration.md#startup-variables).

### `$env.XDG_DATA_HOME`

Can be used to optionally override the `$nu.data-dir` location. See [Configuration - Startup Variables](./configuration.md#startup-variables).

## `$in`

The `$in` variable represents the pipeline input into an expression. See [Pipelines - The Special `$in` Variable](./pipelines.md#pipeline-input-and-the-special-in-variable).

## `$it`

`$it` is a special variable that is only available in a "row condition" — a convenient shorthand which simplifies field access. Row conditions are accepted by [`where`](/commands/docs/where.md), and also by [`any`](/commands/docs/any.md), [`all`](/commands/docs/all.md), [`take while`](/commands/docs/take_while.md), [`take until`](/commands/docs/take_until.md), [`skip while`](/commands/docs/skip_while.md), [`skip until`](/commands/docs/skip_until.md), and [`chunk-by`](/commands/docs/chunk-by.md). In a row condition, `$it` is the current item, and the columns of a record can also be named directly. See `help where` for more information.

```nu
[1 5 12 3] | where $it > 4
# => ╭───┬────╮
# => │ 0 │  5 │
# => │ 1 │ 12 │
# => ╰───┴────╯
[1 5 12 3] | any $it > 10
# => true
```

## `$ans`

The `$ans` variable holds information about the most recent command run in the REPL: its `exit_code`, its `duration`, and the `command` text.

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

A result larger than `max_last_result_size` is truncated, and displaying `$ans.last` then prints a `nu::shell::last_result_truncated` warning. Running `$ans` (or `$ans.<field>`) by itself updates `exit_code`, `duration`, and `command`, but keeps the previous `last` value. `ans` is a reserved name, so `let ans = ...` is an error.

## `$NU_LIB_DIRS`

A constant version of `$env.NU_LIB_DIRS` - a list of directories which will be searched when using the `source`, `use`, or `overlay use` commands. See also:

- [Module Path](./modules/using_modules.md#module-path)
- [Configuration - `$NU_LIB_DIRS`](./configuration.md#nu-lib-dirs-constant)

## `$NU_PLUGIN_DIRS`

A constant version of `$env.NU_PLUGIN_DIRS` - a list of directories which will be searched when registering plugins with `plugin add`. See also:

- [Plugin Search Path](./plugins.md#plugin-search-path)
