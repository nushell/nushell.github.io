---
prev:
  text: Nu as a Shell
  link: /book/nu_as_a_shell.md
---

# Configuration

## Quickstart

While Nushell provides many options for managing its startup and configuration, new users
can get started with just a few simple steps:

1. Tell Nushell what editor to use:

   ```nu
   $env.config.buffer_editor = "<path_to_your_preferred_editor>"
   ```

   For example:

   ```nu
   $env.config.buffer_editor = ["code", "-w"]
   # or
   $env.config.buffer_editor = "nano"
   # or
   $env.config.buffer_editor = "hx"
   # or
   $env.config.buffer_editor = "vi"
   # with args
   $env.config.buffer_editor = ["emacsclient", "-s", "light", "-t"]
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
config nu --doc | nu-highlight | less -R
```

:::

## Configuration Overview

Nushell uses multiple, optional configuration files. These files are loaded in the following order:

1. The first file loaded is `env.nu`, which was historically used to override environment variables. However, the current "best-practice" recommendation is to set all environment variables (and other configuration) using `config.nu` and the autoload directories below.

2. `config.nu` is typically used to override default Nushell settings, define (or import) custom commands, or run any other startup tasks.
3. `*.nu` files in `$nu.vendor-autoload-dirs` are loaded. These directories are intended for vendors' and package managers' startup files.
4. `*.nu` files in `$nu.user-autoload-dirs` are loaded. These files may be used for any startup tasks and are a good way to modularize the configuration.
5. `login.nu` runs commands or handles configuration that should only take place when Nushell is running as a login shell.

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
- Set Nushell settings in [`$env.config`](#nushell-settings-in-the-env-config-record)
- Load modules or source files so that their commands are readily available
- Run any other applications or commands at startup

## Set Environment Variables

::: tip See Also
The [Environment](./environment.md) Chapter covers additional information on how to set and access environment variables.
:::

### Path Configuration

As with most shells, Nushell searches the environment variable named `PATH` (or variants).

:::tip
Unlike some shells, Nushell attempts to be "case agnostic" with environment variables. `Path`, `path`, `PATH`, and even `pAtH` are all allowed variants of the same environment variable. See [Environment - Case Sensitivity](./environment.md#case-sensitivity) for details.
:::

When Nushell is launched, it usually inherits the `PATH` as a string. However, Nushell automatically converts this to a Nushell list for easy access. This means that you can _append_ to the path using, for example:

```nu
$env.path ++= ["~/.local/bin"]
```

The Standard Library also includes a helper command. The default `path add` behavior is to _prepend_
a directory so that it has higher precedence than the rest of the path. For example, the following can be
added to your startup config:

```nu
use std/util "path add"
path add "~/.local/bin"
path add ($nu.home-dir | path join ".cargo" "bin")
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
To disable the right-prompt, for instance, add the following to your startup config:

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

#### Slow Prompt Segments

A prompt closure that takes a long time to run, such as one that calls `git`, delays every prompt. Instead, the closure can start a [background job](./background_jobs.md) and return right away. When the job finishes, it calls [`commandline set-prompt`](/commands/docs/commandline_set-prompt.md) to fill in the missing part without disturbing the line being edited. For example, to show the current Git branch in the right prompt:

```nu
$env.PROMPT_COMMAND_RIGHT = {
    job spawn {
        let branch = (git branch --show-current | complete | get stdout | str trim)
        commandline set-prompt --right $"(ansi yellow)($branch)(ansi reset)"
    }

    ""  # show nothing on the right until the background job fills it in
}
```

`commandline set-prompt` sets the left prompt by default. Use `--right`, `--indicator`, `--vi-insert`, `--vi-normal`, or `--multiline` to set the other prompt components. The new text lasts until the next prompt is drawn.

### ENV_CONVERSIONS

Certain variables, such as those containing multiple paths, are often stored as a
colon-separated string in other shells. Nushell can convert these automatically to a
more convenient Nushell list. The ENV_CONVERSIONS variable specifies how environment
variables are:

- converted from a string to a value (from_string). This happens as soon as `$env.ENV_CONVERSIONS` is assigned, for each listed variable that exists at that point (for example, one inherited from the parent process).
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
As mentioned above, the OS Path variable is automatically converted by Nushell. As a result, it can be treated as a list within your startup config without needing to be present in `ENV_CONVERSIONS`. Other colon-separated paths, like `XDG_DATA_DIRS`, are not automatically converted.
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

Abbreviated documentation on each setting can be viewed in Nushell using:

```nu
config nu --doc | nu-highlight | bat
# or
config nu --doc | nu-highlight | less -R
```

Some of the more recently added settings are:

- `error_style`: `"fancy"` (the default), `"plain"`, `"short"` for concise single-line error messages, or `"nested"` to show related errors nested under the main one. `error_lines` sets how many lines of source code are shown around the location of an error (default `1`).
- `auto_cd_implicit`: when `true`, typing just the name of a subdirectory (such as `src`) changes into it. By default, auto-cd requires a path such as `./src`.
- `history.path`: a custom location for the history file, or `null` to disable history. `history.ignore_space_prefixed` (default `true`) keeps commands that start with a space out of the history.
- `completions.cache_size`: how many Tab-completion prefixes to remember (default `100`; `0` disables the cache). `completions.persistent_menus`: when `true`, completion and history menus stay open while you edit the commandline.

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
# In config.nu
$env.config.history = {
  file_format: sqlite
  max_size: 1_000_000
  sync_on_enter: true
  isolation: true
}
```

::: note
The history settings `file_format`, `max_size`, `isolation`, and `path` are read once, when the REPL starts. Set them in `config.nu`; changing them afterwards (for example, at the prompt) raises a `nu::shell::config_option_locked_after_startup` error.
:::

### Remove Welcome Message

:::note
This section is linked directly from the banner message, so it repeats some information from above.
:::

To remove the welcome message that displays each time Nushell starts:

1. Type `config nu` to edit your configuration file.
2. If you receive an error regarding the editor not being defined:

   ```nu
   $env.config.buffer_editor = "<path to your preferred editor>"
   # Such as:
   $env.config.buffer_editor = "code"
   $env.config.buffer_editor = "vi"
   # Or with editor arguments:
   $env.config.buffer_editor = ["emacsclient", "-s", "light", "-t"]
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

- `$env.XDG_CONFIG_HOME`: If this environment variable is set to an absolute path, it is used to change the directory that Nushell searches for its configuration files such as `env.nu`, `config.nu`, `login.nu`, and the `<config>/autoload` directory. The history and plugin files are also stored in this directory by default.

  Once Nushell starts, this value is stored in the `$nu.default-config-dir` constant. See [Using Constants](#using-constants) below.

  The configuration directory can also be chosen with the `--config-home <path>` flag when launching `nu`, which takes precedence over `XDG_CONFIG_HOME`. Unlike `XDG_CONFIG_HOME`, the path given to `--config-home` is the Nushell configuration directory itself (no `nushell` subdirectory is added), and a relative path is resolved against the current directory.

- `$env.XDG_DATA_HOME`: If this environment variable is set, Nushell sets the `$nu.data-dir` constant to `($env.XDG_DATA_HOME)/nushell`. The `data-dir` is used in several startup tasks:

  - `($nu.data-dir)/completions` is added to the `const` variable [`$NU_LIB_DIRS`](./special_variables.md#nu-lib-dirs), as well as to `$env.NU_LIB_DIRS`, which starts with the same default list. The constant is the preferred way to configure the search path; see [`NU_LIB_DIRS` Constant](#nu-lib-dirs-constant) below.
  - `($nu.data-dir)/vendor/autoload` is added to `$nu.vendor-autoload-dirs` after the system vendor directories (such as those from `XDG_DATA_DIRS`). Files in this directory will be read after those in the other vendor autoload directories, thus overriding any of their settings.

  Note that the directory represented by `$nu.data-dir`, including any of its subdirectories, are NOT created by default. Creation and use of these directories is up to the user.

- `$env.XDG_DATA_DIRS` _(Unix Platforms Only)_: If this environment variable is set, it is used to populate the `$nu.vendor-autoload-dirs` directories. Following the XDG convention that earlier entries take precedence, the directories are processed in _reverse_ order: the first directory in `XDG_DATA_DIRS` is read last, giving it the ability to override definitions from the others.

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
# Replace the default XDG_DATA_DIRS vendor autoload directories (Unix only)
$env.XDG_DATA_DIRS = $temp_home
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
rm -r $temp_home
```

**Important:** Then exit the parent shell so that the `XDG` changes are not accidentally propagated to other processes.
:::

### Using Constants

Some important commands, like `source` and `use`, that help define custom commands (and other definitions) are parse-time keywords. Among other things, this means that all arguments must be known at parse-time.

In other words, **_variable arguments are not allowed for parser keywords_**.

However, Nushell creates some convenience _constants_ that can be used to help identify common file locations. For instance, you can source a file in the default configuration directory using:

```nu
source ($nu.default-config-dir | path join "myfile.nu")
```

Because the constant value is known at parse-time, it can be used with parse-time keywords like `source` and `use`.

:::tip See Also
See [Parse-time Constant Evaluation](./how_nushell_code_gets_run.md#parse-time-constant-evaluation) for more details on this process.
:::

#### `$nu` Constant

To see a list of the built-in Nushell constants, examine the record constant using `$nu` (including the dollar sign).

#### `NU_LIB_DIRS` Constant

The `NU_LIB_DIRS` _constant_ lists the directories that `source`, `use`, and `overlay use` search for files. By default, it contains the `scripts` directory under the configuration directory and the `completions` directory under `$nu.data-dir`. The `$env.NU_LIB_DIRS` environment variable starts with the same list and is still supported, but the constant is the preferred way to set the search path because, unlike `$env.NU_LIB_DIRS`, it can be defined _and_ used in `config.nu`. For example:

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
- A directory in `$nu.data-dir` named after the version of Nushell running (e.g. `0.116.0`).
- A `plugins` directory in the directory containing your `config.nu` (`$nu.config-path`).

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

The `^` symbol tells Nushell to run the following command as an _external_ command, rather than as a Nushell built-in. After running these commands, `nu-open` will be the Nushell _internal_ version, and the `open` alias will call the Mac, external `open` instead. You can also reach the built-in command with the `%` sigil, as `%open`, even though the alias shadows it.

For more information, see [Running System (External) Commands](./running_externals.md).

## Detailed Configuration Startup Process

This section contains a more detailed description of how different configuration (and flag) options can be used to
change Nushell's startup behavior.

### Launch Stages

The following stages and their steps _may_ occur during startup, based on the flags that are passed to `nu`. See [Flag Behavior](#flag-behavior) immediately following this table for how each flag impacts the process:

| Step | Stage                           | Nushell Action                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.   | (misc)                          | Sets internal defaults via its internal Rust implementation. In practice, this may not take place until "first use" of the setting or variable, but there will typically be a Rust default for most (but not all) settings and variables that control Nushell's behavior. These defaults can then be superseded by the steps below.                                                                                             |
| 1.   | (main)                          | Processes commandline arguments such as `--plugin-config <file>`, `--plugins <list>`, `--experimental-options <list>`, and others. See `nu --help` for a complete list.                                                                                                                                                                                                                                                         |
| 2.   | (main)                          | Gets the configuration directory. This is OS-dependent (see [dirs::config_dir](https://docs.rs/dirs/latest/dirs/fn.config_dir.html)), but can be overridden using `XDG_CONFIG_HOME` on all platforms as discussed [above](#changing-default-directories), or with the `--config-home <path>` flag.                                                                                                                              |
| 3.   | (main)                          | Gets the path to `env.nu` and `config.nu`. By default, these are located in the config directory, but either or both can be overridden using the `--env-config <path>` and `--config <path>` flags. The data directory, the autoload directories, and the plugin registry file are located at this point as well.                                                                                                               |
| 4.   | (main)                          | Creates the initial `$env.NU_PLUGIN_DIRS` variable. By default, it is an empty list.                                                                                                                                                                                                                                                                                                                                            |
| 5.   | (main)                          | Creates the initial `$NU_PLUGIN_DIRS` constant. By default, this will include (1) the `plugins` directory under the configuration directory, and (2) the directory where the currently running `nu`/`nu.exe` is located.                                                                                                                                                                                                        |
| 6.   | (main)                          | Initializes the in-memory SQLite database. This allows the `stor` family of commands to be used in the following configuration files.                                                                                                                                                                                                                                                                                           |
| 7.   | (main)                          | Loads the initial `$env.config` values from the internal defaults, and sets `$env.ENV_CONVERSIONS` to an empty record.                                                                                                                                                                                                                                                                                                          |
| 8.   | (main)                          | Inherits its initial environment from the calling process. These will initially be converted to Nushell strings, but can be converted to other structures later using `ENV_CONVERSIONS` (see above).                                                                                                                                                                                                                            |
| 9.   | (main)                          | Converts the search path (`PATH`, or `Path` on Windows) from the inherited `string` to a Nushell `list`.                                                                                                                                                                                                                                                                                                                        |
| 10.  | (main)                          | Creates the initial `$env.NU_LIB_DIRS` variable and `$NU_LIB_DIRS` constant, both with the same list: (1) any directories in an inherited `NU_LIB_DIRS` environment variable, (2) any directories given with the `--include-path (-I)` flag, then (3) the `scripts` directory under the configuration directory, and (4) `completions` under the data directory (`$nu.data-dir`). These directories are not created by default. |
| 11.  | (stdlib)                        | Loads the [Standard Library](./standard_library.md) and `std-rfc` into the virtual filesystem. It is not parsed or evaluated at this point.                                                                                                                                                                                                                                                                                     |
| 12.  | (stdlib)                        | Parses and evaluates `std/prelude`, which brings the `banner` and `pwd` commands into scope.                                                                                                                                                                                                                                                                                                                                    |
| 13.  | (main)                          | Generates the initial [`$nu` record constant](#using-constants) so that items such as `$nu.default-config-dir` can be used in the following config files.                                                                                                                                                                                                                                                                       |
| 14.  | (main)                          | Loads any plugins that were specified using the `--plugins` flag.                                                                                                                                                                                                                                                                                                                                                               |
| 15.  | (repl)                          | Sets several default environment variables that only apply in the REPL (prompt-related and `SHLVL`). Note that prompt-related variables using closures are set in `default_env.nu`.                                                                                                                                                                                                                                             |
| 16.  | (config files) (plugin)         | Processes the signatures in the user's `plugin.msgpackz` (located in the configuration directory) so that added plugins can be used in the following config files.                                                                                                                                                                                                                                                              |
| 17.  | (config files)                  | If this is the first time Nushell has been launched, then it creates the configuration directory. "First launch" is determined by whether or not the configuration directory exists.                                                                                                                                                                                                                                            |
| 18.  | (config files)                  | Also, if this is the first time Nushell has been launched, creates a mostly empty (other than a few comments) `env.nu` and `config.nu` in that directory.                                                                                                                                                                                                                                                                       |
| 19.  | (config files) (default_env.nu) | Loads default environment variables from the internal `default_env.nu`. This file can be viewed with: `config env --default \| nu-highlight \| less -R`.                                                                                                                                                                                                                                                                        |
| 20.  | (config files) (env.nu)         | Loads (parses and evaluates) the user's `env.nu` (the path to which was determined above).                                                                                                                                                                                                                                                                                                                                      |
| 21.  | (config files) (config.nu)      | Loads the internal `default_config.nu`, which is essentially empty, since the defaults for all `$env.config` settings are now built into Nushell (step 7). This file can be viewed with: `config nu --default \| nu-highlight \| less -R`.                                                                                                                                                                                      |
| 22.  | (config files) (config.nu)      | Loads (parses and evaluates) the user's `config.nu` (the path to which was determined above).                                                                                                                                                                                                                                                                                                                                   |
| 23.  | (config files) (login)          | When Nushell is running as a login shell, loads the user's `login.nu`.                                                                                                                                                                                                                                                                                                                                                          |
| 24.  | (config files)                  | Loops through the vendor autoload directories and loads any `.nu` files found. The directories are processed in the order found in `$nu.vendor-autoload-dirs`, and files in those directories are processed in alphabetical order.                                                                                                                                                                                              |
| 25.  | (config files)                  | Loops through the user autoload directories and loads any `.nu` files found. The directories are processed in the order found in `$nu.user-autoload-dirs`, and files in those directories are processed in alphabetical order.                                                                                                                                                                                                  |
| 26.  | (repl)                          | Runs the commands given with the `--execute (-e)` flag, if any.                                                                                                                                                                                                                                                                                                                                                                 |
| 27.  | (repl)                          | Sets up the line editor and the command history. From this point on, the `history.file_format`, `history.max_size`, `history.isolation`, and `history.path` settings can no longer be changed.                                                                                                                                                                                                                                  |
| 28.  | (repl) and (stdlib)             | Shows the welcome banner if configured.                                                                                                                                                                                                                                                                                                                                                                                         |
| 29.  | (repl)                          | Runs the `env_change` and `pre_prompt` [hooks](./hooks.md) and renders the prompt. At this point, `$nu.startup-time` is final, and the banner's startup time line is shown if configured.                                                                                                                                                                                                                                       |
| 30.  | (repl)                          | Nushell enters the normal commandline (REPL).                                                                                                                                                                                                                                                                                                                                                                                   |

### Flag Behavior

| Mode                | Command/Flags                              | Behavior                                                                                                                                                                                                                                                                                                 |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal Shell        | `nu` (no flags)                            | All launch steps **_except_** those marked with **_(login)_** occur.                                                                                                                                                                                                                                     |
| Login Shell         | `nu --login/-l`                            | All launch steps occur.                                                                                                                                                                                                                                                                                  |
| Command-string      | `nu --commands <command-string>` (or `-c`) | All Launch stages **_except_** those marked with **_(config files)_** or **_(repl)_** occur. However, **_(default_env.nu)_** and **_(plugin)_** do occur, so plugins can be used in the command-string. With `--login/-l`, the **_(env.nu)_**, **_(config.nu)_**, and **_(login)_** steps occur as well. |
| Script file         | `nu <script_file>`                         | Same as with Command-string.                                                                                                                                                                                                                                                                             |
| No config           | `nu -n`                                    | **_(config files)_** stages do **_not_** occur, regardless of other flags.                                                                                                                                                                                                                               |
| No Standard Library | `nu --no-std-lib`                          | Regardless of other flags, the steps marked **_(stdlib)_** will **_not_** occur.                                                                                                                                                                                                                         |
| Force config file   | `nu --config <file>`                       | Forces steps marked with **_(config.nu)_** above to run with the provided config `<file>`, unless `-n` was also specified                                                                                                                                                                                |
| Force env file      | `nu --env-config <file>`                   | Forces steps marked with **_(default_env.nu)_** and **_(env.nu)_** above to run with the specified env `<file>`, unless `-n` was also specified                                                                                                                                                          |

### Scenarios

- `nu`:

  - ✅ Makes the Standard Library available
  - ✅ Reads user's `plugin.msgpackz` file if it exists in the config directory
  - ✅ Sources the `default_env.nu` file internally
  - ✅ Sources the user's `env.nu` file if it exists in the config directory
  - ✅ Sources the `default_config.nu` file internally
  - ✅ Sources user's `config.nu` file if it exists in the config directory
  - ❌ Does not read `personal login.nu` file
  - ✅ Sources the files in `vendor-autoload-dirs`
  - ✅ Sources the files in `user-autoload-dirs`
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
  - ❌ Does not source the files in `vendor-autoload-dirs`
  - ❌ Does not source the files in `user-autoload-dirs`
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
  - ❌ Does not source the files in `vendor-autoload-dirs`
  - ❌ Does not source the files in `user-autoload-dirs`

- `nu -l -c "ls" --config foo_config.nu`

  - Same as above, but reads an alternative config file named `foo_config.nu` instead of the user's `config.nu`. A relative path like this one is resolved against the current directory, not the config directory.

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
  - ❌ Does not source the files in `vendor-autoload-dirs`
  - ❌ Does not source the files in `user-autoload-dirs`

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
  - ❌ Does not source the files in `vendor-autoload-dirs`
  - ❌ Does not source the files in `user-autoload-dirs`

- `nu --config foo_config.nu test.nu`

  - ✅ Makes the Standard Library available
  - ✅ Reads user's `plugin.msgpackz` file if it exists in the config directory
  - ✅ Sources the `default_env.nu` file internally
  - ❌ Does not source the user's `env.nu` (no `--env-config` was specified)
  - ✅ Sources the `default_config.nu` file internally. Note that `default_config.nu` is always handled before a user's config
  - ✅ Sources `foo_config.nu` (from the current directory) instead of the user's `config.nu`
  - ❌ Does not read the user's `login.nu` file
  - ✅ Runs `test.nu` file as a script
  - ❌ Does not enter the REPL
  - ❌ Does not source the files in `vendor-autoload-dirs`
  - ❌ Does not source the files in `user-autoload-dirs`

- `nu -n --no-std-lib` (fastest REPL startup):

  - ❌ Does not make the Standard Library available
  - ❌ Does not read user's `plugin.msgpackz`
  - ❌ Does not read the internal `default_env.nu`
  - ❌ Does not source the user's `env.nu`
  - ❌ Does not read the internal `default_config.nu` file
  - ❌ Does not read the user's `config.nu` file
  - ❌ Does not read the user's `login.nu` file
  - ❌ Does not source the files in `vendor-autoload-dirs`
  - ❌ Does not source the files in `user-autoload-dirs`
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
  - ❌ Does not source the files in `vendor-autoload-dirs`
  - ❌ Does not source the files in `user-autoload-dirs`

