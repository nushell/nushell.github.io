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
- `home-path`: The user's home directory which can be accessed using the shorthand `~`.
- `data-dir`: The data directory for Nushell, which includes the `./vendor/autoload` directories loaded at startup and other user data.
- `cache-dir`: A directory for non-essential (cached) data.
- `vendor-autoload-dirs`: A list of directories where third-party applications should install configuration files that will be auto-loaded during startup.
- `user-autoload-dirs`: A list of directories where the user may create additional configuration files which will be auto-loaded during startup.
- `temp-path`: A path for temporary files that should be writeable by the user.
- `pid`: The PID of the currently running Nushell process.
- `os-info`: Information about the host operating system.
- `startup-time`: The amount of time (in duration) that it took for Nushell to start and process all configuration files.
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

## `$env`

`$env` is a special mutable variable containing the current environment variables. As with any process, the initial environment is inherited from the parent process which started `nu`.

::: tip In other shells and languages ...

::: tabs
@tab Nu

```nu
# Set an environment variable
$env.VARNAME = "Content"

# Access an environment variable
$env.VARNAME
# => Content

# View all environment variables
$env
```

@tab Bash/POSIX

````bash:no-line-numbers
# Set an environment variable
VARNAME="Content"
export VARNAME
# or
export VARNAME="Content"

# Access an environment variable
echo $VARNAME
# => Content

# View all environment variables
env

@tab PowerShell

```powershell
# Set an environment variable
$env:VARNAME = "Content"

# Access an environment variable
$env:VARNAME
# => Content
````

<!-- Please add additional languages -->

:::

There are also several environment variables that Nushell uses for specific purposes:

### `$env.config`

`$env.config` is the main configuration record used in Nushell. Settings are documented in `config nu --doc`.

### `$env.PATH`

The search path for executing other applications. It is initially inherited from the parent process as a string, but converted to a Nushell `list` at startup for easy access.

It is converted back to a string before running a child-process.

### `$env.ENV_CONVERSIONS`

Allows users to specify how to convert certain environment variables to Nushell types. See [ENV_CONVERSIONS](./configuration.md#env_conversions).

### `$env.LAST_EXIT_CODE`

The exit code of the last command, usually used for external commands — Equivalent to `$?` from POSIX. Note that this information is also made available to the `catch` block in a `try` expression for external commands. For instance:

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

::: tip In other shells and languages ...

::: tabs

@tab Nu

```nu
$env.LAST_EXIT_CODE
```

@tab Bash/POSIX

```bash
$?
```

@tab PowerShell

```powershell
# Code
$LASTEXITCODE

# Successful - true or false
$?
```

@tab Perl

```perl
$? >> 8
```

:::

### `env.CMD_DURATION_MS`

The amount of time in milliseconds that the previous command took to run.

### `$env.NU_VERSION`

The current Nushell version. The same as `(version).version`, but, as an environment variable, it is exported to and can be read by child processes.

### `$env.CURRENT_FILE`

Inside a script, module, or sourced-file, this variable holds the fully-qualified filename. Note that this
information is also available as a constant through the [`path self`](/commands/docs/path_self.md) command.

### `$env.FILE_PWD`

Inside a script, module, or sourced-file, this variable holds the fully qualified name of the directory in which
the file resides. Note that this value is also available as a constant through:

```nu
path self | path dirname
```

::: tip In other shells and languages ...

::: tabs

@tab Nu

```nu
$env.FILE_PWD
```

@tab PowerShell

```powershell
$PSCommandPath
```

:::

### `$env.PROCESS_PATH`

When _executing a script_, this variable represents the name and relative path of the script. Unlike the two variables
above, it is not present when sourcing a file or importing a module.

Note: Also unlike the two variables above, the exact path (including symlinks) that was used to _invoke_ the file is returned.

::: tip In other shells and languages ...

::: tabs
@tab Nushell

```nu
print $env.PROCESS_PATH
```

@tab Bash

```bash
echo $0
```

:::

### `$env.NU_LIB_DIRS`

A list of directories which will be searched when using the `source`, `use`, or `overlay use` commands. See also:

- The `$NU_LIB_DIRS` constant below
- [Module Path](./modules/using_modules.md#module-path)
- [Configuration - `$NU_LIB_DIRS`](./configuration.md#nu_lib_dirs-constant)

### `$env.NU_PLUGIN_DIRS`

A list of directories which will be searched when registering plugins with `plugin add`. See also:

- [Plugin Search Path](./plugins.md#plugin-search-path)

### `$env.PROMPT_*` and `$env.TRANSIENT_PROMPT_*`

A number of variables are available for configuring the Nushell prompt that appears on each commandline. See also:

- [Configuration - Prompt Configuration](./configuration.md#prompt-configuration)
- `config nu --doc`

### `$env.SHLVL`

`SHLVL` is incremented by most shells when entering a new subshell. It can be used to determine the number of nested shells. For instance,
if `$env.SHLVL == 2` then typing `exit` should return you to a parent shell.

### `$env.XDG_CONFIG_HOME`

Can be used to optionally override the `$nu.default-config-dir` location. See [Configuration - Startup Variables](./configuration.md#startup-variables).

### `$env.XDG_DATA_DIR`

Can be used to optionally override the `$nu.data-dir` location. See [Configuration - Startup Variables](./configuration.md#startup-variables).

## `$in`

The `$in` variable represents the pipeline input into an expression. See [Pipelines - The Special `$in` Variable](./pipelines.md#pipeline-input-and-the-special-in-variable).

## `$it`

`$it` is a special variable that is _only_ available in a `where` "row condition" — a convenient shorthand which simplifies field access. See `help where` for more information.

## `$NU_LIB_DIRS`

A constant version of `$env.NU_LIB_DIRS` - a list of directories which will be searched when using the `source`, `use`, or `overlay use` commands. See also:

- [Module Path](./modules/using_modules.md#module-path)
- [Configuration - `$NU_LIB_DIRS`](./configuration.md#nu_lib_dirs-constant)

## `$NU_PLUGIN_DIRS`

A constant version of `$env.NU_PLUGIN_DIRS` - a list of directories which will be searched when registering plugins with `plugin add`. See also:

- [Plugin Search Path](./plugins.md#plugin-search-path)
