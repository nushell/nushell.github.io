# Configuration

## Quickstart

While Nushell provides many options for managing its startup and configuration, new users
can get started with just a few simple steps:

1. Tell Nushell what editor to use:

   ```nu
   $env.config.buffer_editor = <path_to_your_preferred_editor>
   ```

   For example:

   ```nu
   $env.config.buffer_editor = "code"
   # or
   $env.config.buffer_editor = "nano"
   # or
   $env.config.buffer_editor = "hx"
   # or
   $env.config.buffer_editor = "vi"
   # etc.
   ```

2. Edit `config.nu` using:

   ```nu
   config nu
   ```

   This will open the current `config.nu` in the editor defined above.

3. Add commands to this file that should run each time Nushell starts. A good first example might be the `buffer_editor` setting above.

   You can find a detailed list of available settings using:

   ```nu
    config nu --doc | nu-highlight | less -R
   ```

4. Save, exit the editor, and start a new Nushell session to load these settings.

That's it! More details are below when you need them ...

---

[[toc]]

::: tip
To view a simplified version of this documentation from inside Nushell, run:

```nu
config env --doc | nu-highlight | less -R
```

:::

## Configuration Overview

Nushell uses multiple, optional configuration files. These files are loaded in the following order:

1. The first file loaded is `env.nu`, which was historically used to override environment variables. However, the current "best-practice" recommendation is to set all environment variables (and other configuration) using `config.nu` and the autoload directories below.

2. `config.nu` is typically used to override default Nushell settings, define (or import) custom commands, or run any other startup tasks.
3. Files in `$nu.vendor-autoload-dirs` are loaded. These files can be used for any purpose and are a convenient way to modularize a configuration.
4. `login.nu` runs commands or handles configuration that should only take place when Nushell is running as a login shell.

By default, `env.nu`, `config.nu`, and `login.nu` are read from the `$nu.default-config-dir` directory. For example:

```nu
$nu.default-config-dir
# macOS
# => /Users/me/Library/Application Support/nushell
# Linux
# => /home/me/.config/nushell
# Windows
# => C:\Users\me\AppData\Roaming\nushell
```

The first time Nushell is launched, it will create the configuration directory and an empty (other than comments) `env.nu` and `config.nu`.

::: tip
You can quickly open `config.nu` in your default text editor using the `config nu` command. Likewise, the `config env` command will open `env.nu`.

This requires that you have configured a default editor using either:

- Nushell's `$env.config.buffer_editor` setting
- The `$env.VISUAL` or `$env.EDITOR` environment variables

For example, place this in your `config.nu` to edit your files in Visual Studio Code:

```nu
$env.config.buffer_editor = 'code'
```

:::

## Common Configuration Tasks in `config.nu`:

::: tip
Some users will prefer a "monolithic" configuration file with most or all startup tasks in one place. `config.nu` can be used for this purpose.

Other users may prefer a "modular" configuration where each file handles a smaller, more focused set of tasks. Files in the autoload dirs can be used to create this experience.
:::

`config.nu` is commonly used to:

- Set [environment variables](#set-environment-variables) for Nushell and other applications
- Set Nushell settings in [`$env.config`](#nushell-settings-in-the-envconfig-record)
- Load modules or source files so that their commands are readily available
- Run any other applications or commands at startup

## Set Environment Variables

::: tip See Also
The [Environment](./environment.md) Chapter covers additional information on how to set and access environment variables.
:::

### Path Configuration

As with most shells, Nushell searches the environment variable named `PATH` (or variants).
The `env.nu` file is often used to add (and sometimes remove) directories on the path.

:::tip
Unlike some shells, Nushell attempts to be "case agnostic" with environment variables. `Path`, `path`, `PATH`, and even `pAtH` are all allowed variants of the same environment variable. See [Environment - Case Sensitivity](./environment.md#case-sensitivity) for details.
:::

When Nushell is launched, it usually inherits the `PATH` as a string. However, Nushell automatically converts this to a Nushell list for easy access. This means that you can _append_ to
the path using, for example:

```nu
$env.path ++= ["~/.local/bin"]
```

The Standard Library also includes a helper command. The default `path add` behavior is to _prepend_
a directory so that it has higher precedence than the rest of the path. For example, the following can be
added to `env.nu`:

```nushell
use std/util "path add"
path add "~/.local/bin"
path add ($env.CARGO_HOME | path join "bin")
```

::: tip
Notice the use of `path join` in the example above. This command properly joins two path
components regardless of whether or not the path separator is present. See `help path` for
more commands in this category.
:::

### Prompt Configuration

Nushell provides a number of prompt configuration options. By default, Nushell includes:

- A prompt which includes the current directory, abbreviated using `~` if it is (or is under)
  the home directory.
- A prompt indicator which appears immediately to the right of the prompt. This defaults to `> ` when in normal editing mode, or a `: ` when in Vi-insert mode. Note extra space after the character to provide separation of the command from the prompt.
- A right-prompt with the date and time
- An indicator which is displayed when the current commandline extends over multiple lines - `::: ` by default

The environment variables which control these prompt components are:

- `$env.PROMPT_COMMAND`: The prompt itself
- `$env.PROMPT_COMMAND_RIGHT`: A prompt which can appear on the right side of the terminal
- `$env.PROMPT_INDICATOR`: Emacs mode indicator
- `$env.PROMPT_INDICATOR_VI_NORMAL`: Vi-normal mode indicator
- `$env.PROMPT_INDICATOR_VI_INSERT`: Vi-insert mode indicator
- `$env.PROMPT_MULTILINE_INDICATOR`: The multi-line indicator

Each of these variables accepts either:

- A string, in which case the component will be statically displayed as that string.
- A closure (with no parameters), in which case the component will be dynamically displayed based on the closure's code.
- `null`, in which case the component will revert to its internal default value.

::: tip
To disable the right-prompt, for instance, add the following to `env.nu`:

```nu
$env.PROMPT_COMMAND_RIGHT = ""
# or
$env.PROMPT_COMMAND_RIGHT = {||}
```

:::

#### Transient Prompts

Nushell also supports transient prompts, which allow a different prompt to be shown _after_ a commandline has been executed. This can be useful in several situations:

- When using a multi-line prompt, the transient prompt can be a more condensed version.
- Removing the transient multiline indicator and right-prompt can simplify copying from the terminal.

As with the normal prompt commands above, each transient prompt can accept a (static) string, a (dynamic) closure, or a `null` to use the Nushell internal defaults.

The environment variables which control the transient prompt components are:

- `$env.TRANSIENT_PROMPT_COMMAND`: The prompt itself after the commandline has been executed
- `$env.TRANSIENT_PROMPT_COMMAND_RIGHT`: A prompt which can appear on the right side of the terminal
- `$env.TRANSIENT_PROMPT_INDICATOR`: Emacs mode indicator
- `$env.TRANSIENT_PROMPT_INDICATOR_VI_NORMAL`: Vi-normal mode indicator
- `$env.TRANSIENT_PROMPT_INDICATOR_VI_INSERT`: Vi-insert mode indicator
- `$env.TRANSIENT_PROMPT_MULTILINE_INDICATOR`: The multi-line indicator

::: tip
Nushell sets `TRANSIENT_PROMPT_COMMAND_RIGHT` and `TRANSIENT_PROMPT_MULTILINE_INDICATOR` to an empty string (`""`) so that each disappears after the previous command is entered. This simplifies copying and pasting from the terminal.

To disable this feature and always show those items, set:

```nu
$env.TRANSIENT_PROMPT_COMMAND_RIGHT = null
$env.TRANSIENT_PROMPT_MULTILINE_INDICATOR = null
```

:::

### ENV_CONVERSIONS

Certain variables, such as those containing multiple paths, are often stored as a
colon-separated string in other shells. Nushell can convert these automatically to a
more convenient Nushell list. The ENV_CONVERSIONS variable specifies how environment
variables are:

- converted from a string to a value on Nushell startup (from_string)
- converted from a value back to a string when running external commands (to_string)

`ENV_CONVERSIONS` is a record, where:

- each key is an environment variable to be converted
- each value is another record containing a:
  ```nu
  {
    from_string: <closure>
    to_string: <closure>
  }
  ```

::: tip
As mentioned above, the OS Path variable is automatically converted by Nushell. As a result, it can be treated as a list within `env.nu` without needing to be present in `ENV_CONVERSIONS`. Other colon-separated paths, like `XDG_DATA_DIRS`, are not automatically converted.
:::

To add an additional conversion, [`merge`](/commands/docs/merge.md) it into the `$env.ENV_CONVERSIONS` record. For example, to add a conversion for the `XDG_DATA_DIRS` variable:

```nu
$env.ENV_CONVERSIONS = $env.ENV_CONVERSIONS | merge {
    "XDG_DATA_DIRS": {
        from_string: {|s| $s | split row (char esep) | path expand --no-symlink }
        to_string: {|v| $v | path expand --no-symlink | str join (char esep) }
    }
}
```

### `LS_COLORS`

As with many `ls`-like utilities, Nushell's directory listings make use of the `LS_COLORS` environment variable for defining styles/colors to apply to certain file types and patterns.

## Nushell Settings in the `$env.config` Record

### Changing Settings in the `$env.config` Record

The primary mechanism for changing Nushell's behavior is the `$env.config` record. While this record is accessed as an environment variable, unlike most other variables it is:

- Not inherited from the parent process. Instead, it is populated by Nushell itself with certain defaults.
- Not exported to child processes started by Nushell.

To examine the current settings in `$env.config`, just type the variable name:

```nu
$env.config
```

::: tip
Since Nushell provides so many customization options, it may be better to send this to a pager like:

```nu
$env.config | table -e | less -R
# or, if bat is installed:
$env.config | table -e | bat -p
```

:::

An appendix documenting each setting will be available soon. In the meantime, abbreviated documentation on each setting can be viewed in Nushell using:

```nu
config nu --doc | nu-highlight | bat
# or
config nu --doc | nu-highlight | less -R
```

To avoid overwriting existing settings, it's best to simply assign updated values to the desired configuration keys, rather than the entire `config` record. In other words:

::: warning Wrong

```nu
$env.config = {
  show_banner: false
}
```

This would reset any _other_ settings that had been changed, since the entire record would be overwritten.
:::

::: tip Right

```nu
$env.config.show_banner = false
```

This changes _only_ the `show_banner` key/value pair, leaving all other keys with their existing values.
:::

Certain keys are themselves also records. It's okay to overwrite these records, but it's best-practice
to set all values when doing so. For example:

```nu
$env.config.history = {
  file_format: sqlite
  max_size: 1_000_000
  sync_on_enter: true
  isolation: true
}
```

### Remove Welcome Message

:::note
This section is linked directly from the banner message, so it repeats some information from above.
:::

To remove the welcome message that displays each time Nushell starts:

1. Type `config nu` to edit your configuration file.
2. If you receive an error regarding the editor not being defined:

   ```nu
   $env.config.buffer_editor = <path to your preferred editor>
   # Such as:
   $env.config.buffer_editor = "code"
   $env.config.buffer_editor = "vi"
   # Or with editor arguments:
   $env.config.buffer_editor: ["emacsclient", "-s", "light", "-t"],
   ```

   Then repeat step 1.

3. Add the following line to the end of the file:

   ```nu
   $env.config.show_banner = false
   ```

4. Save and exit your editor.
5. Restart Nushell to test the change.

## Additional Startup Configuration

### Changing default directories

::: warning Important
As discussed below, variables in this section must be set **before** Nushell is launched.
:::

Some variables that control Nushell startup file locations must be set **before** Nushell is loaded. This is often done by a parent process such as:

- The terminal application in which Nushell is run

- The operating system or window manager. When running Nushell as a login shell, this will likely be the only mechanism available.

  For example, on Windows, you can set environment variables through the Control Panel. Choose the Start Menu and search for _"environment variables"_.

  On Linux systems using PAM, `/etc/environment` (and other system-specific mechanisms) can be used.

- A parent shell. For example, exporting the value from `bash` before running `nu`.

### Startup Variables

The variables that affect Nushell file locations are:

- `$env.XDG_CONFIG_HOME`: If this environment variable is set, it is used to change the directory that Nushell searches for its configuration files such as `env.nu`, `config.nu`, and `login.nu`. The history and plugin files are also stored in this directory by default.

  Once Nushell starts, this value is stored in the `$nu.default-config-path` constant. See [Using Constants](#using-constants) below.

- `$env.XDG_DATA_HOME`: If this environment variable is set, Nushell sets the `$nu.data-dir` constant to this value. The `data-dir` is used in several startup tasks:

  - `($nu.data-dir)/nushell/completions` is added to the `$env.NU_LIB_DIRS` search path.
  - `($nu.data-dir)/vendor/autoloads` is added as the last path in `nu.vendor-autoload-dirs`. This means that files in this directory will be read last during startup (and thus override any definitions made in earlier files).

  Note that the directory represented by `$nu.data-dir`, nor any of its subdirectories, are created by default. Creation and use of these directories is up to the user.

- `$env.XDG_DATA_DIRS` _(Unix Platforms Only)_: If this environment variable is set, it is used to populate the `$nu.vendor-auto-load` directories in the order listed. The first directory in the list is processed first, meaning the last one read will have the ability to override previous definitions.

::: warning
The `XDG_*` variables are **not** Nushell-specific and should not be set to a directory with only Nushell files. Instead, set the environment variable to the directory _above_ the one with the `nushell` directory.

For example, if you set `$env.XDG_CONFIG_HOME` to:

```
/users/username/dotfiles/nushell
```

... Nushell will look for config files in `/Users/username/dotfiles/nushell/nushell`. The proper setting would be:

```
/users/username/dotfiles
```

Also keep in mind that if the system has already set `XDG` variables, then there may already be files in use in those directories. Changing the location may require that you move other application's files to the new directory.
:::

::: tip
You can easily test out config changes in a "fresh" environment using the following recipe. The following is run from inside Nushell, but can be
adapted to other shells as well:

```nu
# Create an empty temporary directory
let temp_home = (mktemp -d)
# Set the configuration path to this directory
$env.XDG_CONFIG_HOME = $temp_home
# Set the data-dir to this directory
$env.XDG_DATA_HOME = $temp_home
# Remove other potential autoload directories
$env.XDG_DATA_DIRS = ""
# Run Nushell in this environment
nu

# Edit config
config nu
# Exit the subshell
exit
# Run the temporary config
nu
```

When done testing the configuration:

```nu
# Remove the temporary config directory, if desired
rm $temp_home
```

**Important:** Then exit the parent shell so that the `XDG` changes are not accidentally propagated to other processes.
:::

### Using Constants

Some important commands, like `source` and `use`, that help define custom commands (and other definitions) are parse-time keywords. Among other things, this means means that all arguments must be known at parse-time.

In other words, **_variable arguments are not allowed for parser keywords_**.

However, Nushell creates some convenience _constants_ that can be used to help identify common file locations. For instance, you can source a file in the default configuration directory using:

```
source ($nu.default-config-dir | path join "myfile.nu")
```

Because the constant value is known at parse-time, it can be used with parse-time keywords like `source` and `use`.

:::tip See Also
See [Parse-time Constant Evaluation](./how_nushell_code_gets_run.md#parse-time-constant-evaluation) for more details on this parse.
:::

#### `$nu` Constant

To see a list of the built-in Nushell constants, examine the record constant using `$nu` (including the dollar sign).

#### `NU_LIB_DIRS` Constant

Nushell can also make use of a `NU_LIB_DIRS` _constant_ which can act like the `$env.NU_LIB_DIRS` variable mentioned above. However, unlike `$env.NU_LIB_DIRS`, it can be defined _and_ used in `config.nu`. For example:

```nu
# Define module and source search path
const NU_LIB_DIRS = [
  '~/myscripts'
]
# Load myscript.nu from the ~/myscripts directory
source myscript.nu
```

If both the variable `$env.NU_LIB_DIRS` and the const `NU_LIB_DIRS` are defined, both sets
of paths will be searched. The constant `NU_LIB_DIRS` will be searched _first_ and have
precedence. If a file matching the name is found in one of those directories, the search will
stop. Otherwise, it will continue into the `$env.NU_LIB_DIRS` search path.

#### `NU_PLUGIN_DIRS` Constant

`const NU_PLUGIN_DIRS` works in the same way for the plugin search path.

The following `NU_PLUGIN_DIRS` configuration will allow plugins to be loaded from;

- The directory where the `nu` executable is located. This is typically where plugins are located in release packages.
- A directory in `$nu.data-dirs` named after the version of Nushell running (e.g. `0.100.0`).
- A `plugins` directory in your `$nu.config-path`.

```nu
const NU_PLUGIN_DIRS = [
  ($nu.current-exe | path dirname)
  ($nu.data-dir | path join 'plugins' | path join (version).version)
  ($nu.config-path | path dirname | path join 'plugins')
]
```

### Colors, Theming, and Syntax Highlighting

You can learn more about setting up colors and theming in the [associated chapter](coloring_and_theming.md).

### Configuring Nu as a Login Shell

The login shell is often responsible for setting certain environment variables which will be inherited by subshells and other processes. When setting Nushell as a user's default login shell, you'll want to make sure that the `login.nu` handles this task.

Many applications will assume a POSIX or PowerShell login shell, and will either provide instructions for modifying the system or user `profile` that is loaded by POSIX login-shells (or `.ps1` file on PowerShell systems).

As you may have noticed by now, Nushell is not a POSIX shell, nor is it PowerShell, and it won't be able to process a profile written for these. You'll need to set these values in `login.nu` instead.

To find environment variables that may need to be set through `login.nu`, examine the inherited environment from your login shell by running `nu` from within your previous login shell. Run:

```nu
$env | reject config | transpose key val | each {|r| echo $"$env.($r.key) = '($r.val)'"} | str join (char nl)
```

Look for any values that may be needed by third-party applications and copy these to your `login.nu`. Many of these will not be needed. For instance, the `PS1` setting is the current prompt in POSIX shells and won't be useful in Nushell.

When ready, add Nushell to your `/etc/shells` (Unix) and `chsh` as discussed in [the Installation Chapter](./default_shell.md).

### macOS: Keeping `/usr/bin/open` as `open`

Some tools such as Emacs rely on an [`open`](/commands/docs/open.md) command to open files on Mac.

Since Nushell has its own [`open`](/commands/docs/open.md) command with a different meaning which shadows (overrides) `/usr/bin/open`, these tools will generate an error when trying to use the command.

One way to work around this is to define a custom command for Nushell's [`open`](/commands/docs/open.md) and create an alias for the system's [`open`](/commands/docs/open.md) in your `config.nu` file like this:

```nu
alias nu-open = open
alias open = ^open
```

Place this in your `config.nu` to make it permanent.

The `^` symbol tells Nushell to run the following command as an _external_ command, rather than as a Nushell built-in. After running these commands, `nu-open` will be the Nushell _internal_ version, and the `open` alias will call the Mac, external `open` instead.

For more information, see [Running System (External) Commands](./running_externals.md).

## Detailed Configuration Startup Process

This section contains a more detailed description of how different configuration (and flag) options can be used to
change Nushell's startup behavior.

### Launch Stages

The following stages and their steps _may_ occur during startup, based on the flags that are passed to `nu`. See [Flag Behavior](#flag-behavior) immediately following this table for how each flag impacts the process:

| Step | Stage                           | Nushell Action                                                                                                                                                                                                                                                                                                                                                                     |
| ---- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.   | (misc)                          | Sets internal defaults via its internal Rust implementation. In practice, this may not take place until "first use" of the setting or variable, but there will typically be a Rust default for most (but not all) settings and variables that control Nushell's behavior. These defaults can then be superseded by the steps below.                                                |
| 1.   | (main)                          | Inherits its initial environment from the calling process. These will initially be converted to Nushell strings, but can be converted to other structures later using `ENV_CONVERSIONS` (see below).                                                                                                                                                                               |
| 2.   | (main)                          | Gets the configuration directory. This is OS-dependent (see [dirs::config_dir](https://docs.rs/dirs/latest/dirs/fn.config_dir.html)), but can be overridden using `XDG_CONFIG_HOME` on all platforms as discussed [above](#changing-default-directories).                                                                                                                          |
| 3.   | (main)                          | Creates the initial `$env.NU_LIB_DIRS` variable. By default, it includes (1) the `scripts` directory under the configuration directory, and (2) `nushell/completions` under the default data directory (either `$env.XDG_DATA_HOME` or [the default provided by the dirs crate](https://docs.rs/dirs/latest/dirs/fn.data_dir.html)). These directories are not created by default. |
| 4.   | (main)                          | Creates the initial `$env.NU_PLUGIN_DIRS` variable. By default, this will include the configuration directory.                                                                                                                                                                                                                                                                     |
| 5.   | (main)                          | Initializes the in-memory SQLite database. This allows the `stor` family of commands to be used in the following configuration files.                                                                                                                                                                                                                                              |
| 6.   | (main)                          | Processes commandline arguments such as `--plugin-config <file>`, `--plugins <list>`, and others. See `nu --help` for a complete list.                                                                                                                                                                                                                                             |
| 7.   | (main)                          | Gets the path to `env.nu` and `config.nu`. By default, these are located in the config directory, but either or both can be overridden using the `--env-config <path>` and `--config <path>` flags.                                                                                                                                                                                |
| 8.   | (main)                          | If the `--include-path (-I)` flag was used, it overrides the default `$env.NU_LIB_DIRS` that was obtained above.                                                                                                                                                                                                                                                                   |
| 9.   | (main)                          | Loads the initial `$env.config` values from the internal defaults.                                                                                                                                                                                                                                                                                                                 |
| 10.  | (stdlib)                        | Loads the [Standard Library](./standard_library.md) into the virtual filesystem. It is not parsed or evaluated at this point.                                                                                                                                                                                                                                                      |
| 11.  | (stdlib)                        | Parses and evaluates `std/core`, which brings the `banner` and `pwd` commands into scope.                                                                                                                                                                                                                                                                                          |
| 12.  | (main)                          | Generates the initial [`$nu` record constant](#using-constants) so that items such as `$nu.default-config-dir` can be used in the following config files.                                                                                                                                                                                                                          |
| 13.  | (main)                          | Loads any plugins that were specified using the `--plugin` flag.                                                                                                                                                                                                                                                                                                                   |
| 14.  | (config files) (plugin)         | Processes the signatures in the user's `plugin.msgpackz` (located in the configuration directory) so that added plugins can be used in the following config files.                                                                                                                                                                                                                 |
| 15.  | (config files)                  | If this is the first time Nushell has been launched, then it creates the configuration directory. "First launch" is determined by whether or not the configuration directory exists.                                                                                                                                                                                               |
| 16.  | (config files)                  | Also, if this is the first time Nushell has been launched, creates a mostly empty (other than a few comments) `env.nu` and `config .nu` in that directory.                                                                                                                                                                                                                         |
| 17.  | (config files) (default_env.nu) | Loads default environment variables from the internal `default_env.nu`. This file can be viewed with: `nu config env --default \| nu-highlight \| less -R`.                                                                                                                                                                                                                        |
| 18.  | (config files) (env.nu)         | Converts the `PATH` variable into a list so that it can be accessed more easily in the next step.                                                                                                                                                                                                                                                                                  |
| 19.  | (config files) (env.nu)         | Loads (parses and evaluates) the user's `env.nu` (the path to which was determined above).                                                                                                                                                                                                                                                                                         |
| 20.  | (config files) (config.nu)      | Processes any `ENV_CONVERSIONS` that were defined in the user's `env.nu` so that those environment variables can be treated as Nushell structured data in the `config.nu`.                                                                                                                                                                                                         |
| 21.  | (config files) (config.nu)      | Loads a minimal `$env.config` record from the internal `default_config.nu`. This file can be viewed with: `nu config nu --default \| nu-highlight \| less -R`. Most values that are not defined in `default_config.nu` will be auto-populated into `$env.config` using their internal defaults as well.                                                                            |
| 22.  | (config files) (config.nu)      | Loads (parses and evaluates) the user's `config.nu` (the path to which was determined above).                                                                                                                                                                                                                                                                                      |
| 23.  | (config files) (login)          | When Nushell is running as a login shell, loads the user's `login.nu`.                                                                                                                                                                                                                                                                                                             |
| 24.  | (config files)                  | Loops through autoload directories and loads any `.nu` files found. The directories are processed in the order found in `$nu.vendor-autoload-directories`, and files in those directories are processed in alphabetical order.                                                                                                                                                     |
| 25.  | (repl)                          | Processes any additional `ENV_CONVERSIONS` that were defined in `config.nu` or the autoload files.                                                                                                                                                                                                                                                                                 |
| 26.  | (repl) and (stdlib)             | Shows the banner if configured.                                                                                                                                                                                                                                                                                                                                                    |
| 27.  | (repl)                          | Nushell enters the normal commandline (REPL).                                                                                                                                                                                                                                                                                                                                      |

### Flag Behavior

| Mode                | Command/Flags                              | Behavior                                                                                                                                                                                                                                                                                     |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal Shell        | `nu` (no flags)                            | All launch steps **_except_** those marked with **_(login)_** occur.                                                                                                                                                                                                                         |
| Login Shell         | `nu --login/-l`                            | All launch steps occur.                                                                                                                                                                                                                                                                      |
| Command-string      | `nu --commands <command-string>` (or `-c`) | All Launch stages **_except_** those marked with **_(config files)_** or **_(repl)_** occur. However, **_(default_env)_** and **_(plugin)_** do occur. The first allows the path `ENV_CONVERSIONS` defined there can take place. The second allows plugins to be used in the command-string. |
| Script file         | `nu <script_file>`                         | Same as with Command-string.                                                                                                                                                                                                                                                                 |
| No config           | `nu -n`                                    | **_(config files)_** stages do **_not_** occur, regardless of other flags.                                                                                                                                                                                                                   |
| No Standard Library | `nu --no-std-lib`                          | Regardless of other flags, the steps marked **_(stdlib)_** will **_not_** occur.                                                                                                                                                                                                             |
| Force config file   | `nu --config <file>`                       | Forces steps marked with **_(config.nu)_** above to run with the provided config `<file>`, unless `-n` was also specified                                                                                                                                                                    |
| Force env file      | `nu --env-config <file>`                   | Forces steps marked with **_(default_env.nu)_** and **_(env.nu)_** above to run with the specified env `<file>`, unless `-n` was also specified                                                                                                                                              |

### Scenarios

- `nu`:

  - ✅ Makes the Standard Library available
  - ✅ Reads user's `plugin.msgpackz` file if it exists in the config directory
  - ✅ Sources the `default_env.nu` file internally
  - ✅ Sources the user's `env.nu` file if it exists in the config directory
  - ✅ Sources the `default_config.nu` file internally
  - ✅ Sources user's `config.nu` file if it exists if it exists in the config directory
  - ❌ Does not read `personal login.nu` file
  - ✅ Enters the REPL

- `nu -c "ls"`:

  - ✅ Makes the Standard Library available
  - ✅ Reads user's `plugin.msgpackz` file if it exists in the config directory
  - ✅ Sources the `default_env.nu` file internally
  - ❌ Does not source the user's `env.nu`
  - ❌ Does not read the internal `default_config.nu` file
  - ❌ Does not read the user's `config.nu` file
  - ❌ Does not read the user's `login.nu` file
  - ✅ Runs the `ls` command and exits
  - ❌ Does not enter the REPL

- `nu -l -c "ls"`:

  - ✅ Makes the Standard Library available
  - ✅ Reads user's `plugin.msgpackz` file if it exists in the config directory
  - ✅ Sources the `default_env.nu` file internally
  - ✅ Sources the user's `env.nu` file if it exists in the config directory
  - ✅ Sources the `default_config.nu` file internally
  - ✅ Sources user's `config.nu` file if it exists in the config directory
  - ✅ Sources the user's `login.nu` file if it exists in the config directory
  - ✅ Runs the `ls` command and exits
  - ❌ Does not enter the REPL

- `nu -l -c "ls" --config foo_config.nu`

  - Same as above, but reads an alternative config file named `foo_config.nu` from the config directory

- `nu -n -l -c "ls"`:

  - ✅ Makes the Standard Library available
  - ❌ Does not read user's `plugin.msgpackz`
  - ❌ Does not read the internal `default_env.nu`
  - ❌ Does not source the user's `env.nu`
  - ❌ Does not read the internal `default_config.nu` file
  - ❌ Does not read the user's `config.nu` file
  - ❌ Does not read the user's `login.nu` file
  - ✅ Runs the `ls` command and exits
  - ❌ Does not enter the REPL

- `nu test.nu`:

  - ✅ Makes the Standard Library available
  - ✅ Reads user's `plugin.msgpackz` file if it exists in the config directory
  - ✅ Sources the `default_env.nu` file internally
  - ❌ Does not source the user's `env.nu`
  - ❌ Does not read the internal `default_config.nu` file
  - ❌ Does not read the user's `config.nu` file
  - ❌ Does not read the user's `login.nu` file
  - ✅ Runs `test.nu` file as a script
  - ❌ Does not enter the REPL

- `nu --config foo_config.nu test.nu`

  - ✅ Makes the Standard Library available
  - ✅ Reads user's `plugin.msgpackz` file if it exists in the config directory
  - ✅ Sources the `default_env.nu` file internally
  - ❌ Does not source the user's `env.nu` (no `--env-config` was specified)
  - ✅ Sources the `default_config.nu` file internally. Note that `default_config.nu` is always handled before a user's config
  - ✅ Sources user's `config.nu` file if it exists in the config directory
  - ❌ Does not read the user's `login.nu` file
  - ✅ Runs `test.nu` file as a script
  - ❌ Does not enter the REPL

- `nu -n --no-std-lib` (fastest REPL startup):

  - ❌ Does not make the Standard Library available
  - ❌ Does not read user's `plugin.msgpackz`
  - ❌ Does not read the internal `default_env.nu`
  - ❌ Does not source the user's `env.nu`
  - ❌ Does not read the internal `default_config.nu` file
  - ❌ Does not read the user's `config.nu` file
  - ❌ Does not read the user's `login.nu` file
  - ✅ Enters the REPL

- `nu -n --no-std-lib -c "ls"` (fastest command-string invocation):

  - ❌ Does not make the Standard Library available
  - ❌ Does not read user's `plugin.msgpackz`
  - ❌ Does not read the internal `default_env.nu`
  - ❌ Does not source the user's `env.nu`
  - ❌ Does not read the internal `default_config.nu` file
  - ❌ Does not read the user's `config.nu` file
  - ❌ Does not read the user's `login.nu` file
  - ✅ Runs the `ls` command and exits
  - ❌ Does not enter the REPL
