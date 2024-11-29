# Configuration

## Nushell Configuration with `env.nu` and `config.nu`

Nushell uses a configuration system that loads and runs two Nushell script files at launch time:

- `env.nu` is used to define environment variables or write files before `config.nu` starts. For example [`$env.NU_LIB_DIRS`](/book/modules.md#dumping-files-into-directory) controls where Nu finds imports. Third party scripts, like prompts or [mise](https://mise.jdx.dev/getting-started.html#nushell), must already be saved to disk before `config.nu` can read them.
- `config.nu` is used to add definitions, aliases, and more to the global namespace. It can also use the environment variables and constants defined in `env.nu`. If you can't decide which file to add stuff, prefer `config.nu`.

Check where Nushell is reading these config files from by calling `$nu.env-path` and `$nu.config-path`.

```nu
> $nu.env-path
/Users/FirstNameLastName/Library/Application Support/nushell/env.nu
```

_(You can think of the Nushell config loading sequence as executing two [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) lines on startup: `source /path/to/env.nu` and `source /path/to/config.nu`. Therefore, using `env.nu` for environment and `config.nu` for other config is just a convention.)_

When you launch Nushell without these files set up, Nushell will prompt you to download the [default config files](https://github.com/nushell/nushell/tree/main/crates/nu-utils/src/default_files).

::: tip
To view a simplified version of this documentation from inside Nushell, run:

```nu
config env --sample | nu-highlight | less -R
config nu -- sample | nu-highlight | less -R
```

:::

## Overview

Nushell uses multiple, optional configuration files. These files are loaded in the following order:

1. `env.nu` is typically used to define or override environment variables.
2. `config.nu` is typically used to override default Nushell settings, define (or import) custom commands, or run any other startup tasks.
3. Files in `$nu.vendor-autoload-dirs` are sourced. These files can be used for any purpose, and are a convenient way to modularize a configuration.
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

## Configuring `env.nu`

::: tip See Also
The [Environment](./environment.md) Chapter covers additional information on how to set and access environment variables.
:::

Common configuration tasks in `env.conf`:

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
- A prompt indicator which appears immediately to the right of the prompt. This defaults to `> ` when in normal editing mode, or a `: ` when in Vi-insert mode. Note
  extra space after the character to provide separation of the command from the prompt.
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
To disable the right-prompt, for instance, add the following to the `env.nu`:

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
- `$env.PROMPT_COMMAND_RIGHT`: A prompt which can appear on the right side of the terminal
- `$env.TRANSIENT_PROMPT_INDICATOR`: Emacs mode indicator
- `$env.TRANSIENT_PROMPT_INDICATOR_VI_NORMAL`: Vi-normal mode indicator
- `$env.TRANSIENT_PROMPT_INDICATOR_VI_INSERT`: Vi-insert mode indicator
- `$env.TRANSIENT_PROMPT_MULTILINE_INDICATOR`: The multi-line indicator

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
The OS Path variable is automatically converted before `env.nu` loads. As a result, it can be treated as a list within `env.nu`. This conversion is handled via an initial, pre-defined `$env.ENV_CONVERSIONS` of:

```nu
$env.ENV_CONVERSIONS = {
  "Path": {
    from_string: { |s| $s | split row (char esep) | path expand --no-symlink }
    to_string: { |v| $v | path expand --no-symlink | str join (char esep) }
  }
}

```

Note that environment variables are not case-sensitive in Nushell, so the above will work
for both Windows and Unix-like platforms.
:::

To add an additional conversion, [`merge`](/commands/docs/merge.md) it into the `$env.ENV_CONVERSIONS` record. For example, to add a conversion for the `XDG_DATA_DIRS` variable:

```nu
$env.ENV_CONVERSIONS = $env.ENV_CONVERSIONS | merge {
    "XDG_DATA_DIRS": {
        from_string: { |s| $s | split row (char esep) | path expand --no-symlink }
        to_string: { |v| $v | path expand --no-symlink | str join (char esep) }
    }
}
```

### Others

LS_COLORS

### Additional `$env.nu` Notes

While `env.nu` is typically used for environment variable configuration, this is purely by convention. Environment variables can be set in _any_
of the available configuration files. Likewise, `env.nu` can be used for any purpose, if desired.

There are several configuration tasks where `env.nu` has advantages:

1. `$env.ENV_CONVERSIONS` can be defined in `env.nu` to translate certain environment variables to (and from) Nushell structured data types. This can make
   working with these variables in Nushell much more convenient. See below for details on this variable.

2. Modules or source files that are written or modified during `env.nu` can be imported or evaluated during `config.nu`. This is a fairly advanced, uncommon
   technique.

## `config.nu`

## Changing the Default Configuration Directory

Control which directory Nushell reads config files from with the `XDG_CONFIG_HOME` environment variable. When you set it to
an absolute path, Nushell will read config files from `$"($env.XDG_CONFIG_HOME)/nushell"`. For example, if you set it to
`C:\Users\bob\.config`, Nushell will read config files from `C:\Users\bob\.config\nushell\`.

::: warning
`XDG_CONFIG_HOME` must be set **before** starting Nushell. Setting it in `env.nu` or `config.nu` won't change where Nushell
looks for configuration files.
:::

On Windows, you can persistently set the `XDG_CONFIG_HOME` environment variable through the Control Panel. To get there, just
search for "environment variable" in the Start menu.

On other platforms, if Nushell isn't your login shell, then you can set `XDG_CONFIG_HOME` before launching Nushell. For example, if you
use MacOS and your login shell is Zsh, you could add the following to your `.zshrc`:

```zsh
export XDG_CONFIG_HOME="/Users/bob/.config"
```

If Nushell is your login shell, then ways to set `XDG_CONFIG_HOME` will depend on your OS.
Some Linux distros will let you set environment variables in `/etc/profile` or `/etc/profile.d`.
On modern Linux distros, you can also set it through PAM in `/etc/environment`.

::: warning
[`XDG_CONFIG_HOME`](https://xdgbasedirectoryspecification.com) is not a Nushell-specific environment variable and should not be set to the
directory that contains Nushell config files. It should be the directory _above_ the `nushell` directory. If you set it to
`/Users/username/dotfiles/nushell`, Nushell will look for config files in `/Users/username/dotfiles/nushell/nushell` instead.
In this case, you would want to set it to `/Users/username/dotfiles`.
:::

## Other Pre-Launch Environment Variables

## Configuring `$env.config`

Nushell's main settings are kept in the `config` environment variable as a record. This record can be created using:

```nu
$env.config = {
  ...
}
```

Note that setting any key overwrites its previous value. Likewise it's an error to reference any missing key. If `$env.config` already exists you can update or gracefully insert a [`cell-path`](/book/types_of_data.html#cell-paths) at any depth using [`upsert`](/commands/docs/upsert.md):

```nu
$env.config = ($env.config | upsert <field name> <field value>)
```

By convention, this variable is defined in the `config.nu` file.

### Environment

You can set environment variables for the duration of a Nushell session using the `$env.<var> = <val>` structure inside the `env.nu` file. For example:

```nu
$env.FOO = 'BAR'
```

_(Although $env.config is an environment variable, it is still defined by convention inside config.nu.)_

These are some important variables to look at for Nushell-specific settings:

- `LS_COLORS`: Sets up colors per file type in ls
- `PROMPT_COMMAND`: Code to execute for setting up the prompt (block or string)
- `PROMPT_COMMAND_RIGHT`: Code to execute for setting up the right prompt (block)
- `PROMPT_INDICATOR = "〉"`: The indicator printed after the prompt (by default ">"-like Unicode symbol)
- `PROMPT_INDICATOR_VI_INSERT = ": "`
- `PROMPT_INDICATOR_VI_NORMAL = "〉 "`
- `PROMPT_MULTILINE_INDICATOR = "::: "`

### Color Config Section

You can learn more about setting up colors and theming in the [associated chapter](coloring_and_theming.md).

### Remove Welcome Message

To remove the welcome message, you need to edit your `config.nu` by typing `config nu` in your terminal, then you go to the global configuration `$env.config` and set `show_banner` option to false, like this:

@[code](@snippets/installation/remove_welcome_message.nu)

## Configuring Nu as a Login Shell

To use Nu as a login shell, you'll need to configure the `$env` variable. This sets up the environment for external programs.

To get an idea of which environment variables are set up by your current login shell, start a new shell session, then run nu in that shell.

You can then configure some `$env.<var> = <val>` that setup the same environment variables in your nu login shell. Use this command to generate some `$env.<var> = <val>` for all the environment variables:

```nu
$env | reject config | transpose key val | each {|r| echo $"$env.($r.key) = '($r.val)'"} | str join (char nl)
```

This will print out `$env.<var> = <val>` lines, one for each environment variable along with its setting. You may not need all of them, for instance the `PS1` variable is bash specific.

Next, on some distros you'll also need to ensure Nu is in the /etc/shells list:

```sh
> cat /etc/shells
# /etc/shells: valid login shells
/bin/sh
/bin/dash
/bin/bash
/bin/rbash
/usr/bin/screen
/usr/bin/fish
/home/sophia/.cargo/bin/nu
```

With this, you should be able to `chsh` and set Nu to be your login shell. After a logout, on your next login you should be greeted with a shiny Nu prompt.

### Configuration with `login.nu`

If Nushell is used as a login shell, you can use a specific configuration file which is only sourced in this case. Therefore a file with name `login.nu` has to be in the standard configuration directory.

The file `login.nu` is sourced after `env.nu` and `config.nu`, so that you can overwrite those configurations if you need. There is an environment variable `$nu.loginshell-path` containing the path to this file.

What about customizing interactive shells, similar to `.zshrc`? By default `config.nu` is only loaded in interactive shells, not scripts.

### macOS: Keeping `/usr/bin/open` as `open`

Some tools (e.g. Emacs) rely on an [`open`](/commands/docs/open.md) command to open files on Mac.
As Nushell has its own [`open`](/commands/docs/open.md) command which has different semantics and shadows `/usr/bin/open`, these tools will error out when trying to use it.
One way to work around this is to define a custom command for Nushell's [`open`](/commands/docs/open.md) and create an alias for the system's [`open`](/commands/docs/open.md) in your `config.nu` file like this:

```nu
alias nu-open = open
alias open = ^open
```

The `^` symbol _escapes_ the Nushell `open` command, which invokes the operating system's `open` command.
For more about escape and `^` see the [chapter about escapes](escaping.md).

## PATH configuration

In Nushell, [the PATH environment variable](<https://en.wikipedia.org/wiki/PATH_(variable)>) (Path on Windows) is a list of paths. To append a new path to it, you can use `$env.<var> = <val>` and [`append`](/commands/docs/append.md) in `env.nu`:

```nu
$env.PATH = ($env.PATH | split row (char esep) | append '/some/path')
```

This will append `/some/path` to the end of PATH; you can also use [`prepend`](/commands/docs/prepend.md) to add entries to the start of PATH.

Note the `split row (char esep)` step. We need to add it because in `env.nu`, the environment variables inherited from the host process are still strings. The conversion step of environment variables to Nushell values happens after reading the config files (see also the [Environment](environment.md#environment-variable-conversions) section). After that, for example in the Nushell REPL when `PATH`/`Path` is a list , you can use [`append`](/commands/docs/append.md)/[`prepend`](/commands/docs/prepend.md) directly.

To add multiple paths only if not already listed, one can add to `env.nu`:

```nu
$env.PATH = (
  $env.PATH
  | split row (char esep)
  | append /usr/local/bin
  | append ($env.CARGO_HOME | path join bin)
  | append ($env.HOME | path join .local bin)
  | uniq # filter so the paths are unique
)
```

This will add `/usr/local/bin`, the `bin` directory of CARGO_HOME, the `.local/bin` of HOME to PATH. It will also remove duplicates from PATH.

::: tip
There's a convenience command for updating your system path but you must first open the [`std`](/book/standard_library.md) [module](/book/cheat_sheet.md#modules) (in preview):

```nu
use std *
path add /usr/local/bin ($env.CARGO_HOME | path join bin) # etc.
```

You can optionally `--append` paths to be checked last like the ones below.
:::

### Homebrew

[Homebrew](https://brew.sh/) is a popular package manager that often requires PATH configuration. To add it to your Nushell PATH:

```nu
# macOS ARM64 (Apple Silicon)
$env.PATH = ($env.PATH | split row (char esep) | prepend '/opt/homebrew/bin')

# Linux
$env.PATH = ($env.PATH | split row (char esep) | prepend '/home/linuxbrew/.linuxbrew/bin')
```

### Pyenv

[Pyenv](https://github.com/pyenv/pyenv) is a popular Python version manager. To add it to your Nushell PATH:

#### MacOS or Linux

```nu
# MacOS or Linux
$env.PATH = ($env.PATH | split row (char esep) | prepend $"(pyenv root)/shims")
```

#### Windows

Windows users need to install [pyenv-win](https://github.com/pyenv-win/pyenv-win)
and execute the `Get-Command pyenv` command in PowerShell to get the path of `pyenv.ps1` after the installation.

The result usually looks like: `C:\Users\<your-username>\.pyenv\pyenv-win\bin\pyenv.ps1`

Then add the path of pyenv to your Nushell PATH:

```nu
# Windows
$env.Path = ($env.Path | split row (char esep) | prepend $"~/.pyenv/pyenv-win/bin/pyenv.ps1")
```

## Detailed Configuration Startup Process

This section contains a more detailed description of how different configuration (and flag) options can be used to
change Nushell's startup behavior.

### Launch Stages

The following stages and their steps _may_ occur during startup, based on the flags that are passed to `nu`. See [Flag Behavior](#flag-behavior) immediately following this table for how each flag impacts the process:

| Step | Stage                           | Nushell Action                                                                                                                                                                                                                                                                                                                                                                     |
| ---- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.   | (misc)                          | Sets internal defaults via its internal Rust implementation. In practice, this may not take place until "first use" of the setting or variable, but there will typically be a Rust default for most (but not all) settings and variables that control Nushell's behavior. These defaults can then be superseded by the steps below.                                                |
| 1.   | (main)                          | Inherits its initial environment from the calling process. These will initially be converted to Nushell strings, but can be converted to other structures later using `ENV_CONVERSIONS` (see below).                                                                                                                                                                               |
| 2.   | (main)                          | Gets the configuration directory. This is OS-dependent (see [dirs::config_dir](https://docs.rs/dirs/latest/dirs/fn.config_dir.html)), but can be overridden using `XDG_CONFIG_HOME` on all platforms. (TODO: Link)                                                                                                                                                                 |
| 3.   | (main)                          | Creates the initial `$env.NU_LIB_DIRS` variable. By default, it includes (1) the `scripts` directory under the configuration directory, and (2) `nushell/completions` under the default data directory (either `$env.XDG_DATA_HOME` or [the default provided by the dirs crate](https://docs.rs/dirs/latest/dirs/fn.data_dir.html)). These directories are not created by default. |
| 4.   | (main)                          | Creates the initial `$env.NU_PLUGIN_DIRS` variable. By default, this will include the configuration directory.                                                                                                                                                                                                                                                                     |
| 5.   | (main)                          | Initializes the in-memory SQLite database. This allows the `stor` family of commands to be used in the following configuration files.                                                                                                                                                                                                                                              |
| 6.   | (main)                          | Processes commandline arguments.                                                                                                                                                                                                                                                                                                                                                   |
| 7.   | (main)                          | Gets the path to `env.nu` and `config.nu`. By default, these are located in the config directory, but either or both can be overridden using the `--env-config <path>` and `--config <path>` flags.                                                                                                                                                                                |
| 8.   | (main)                          | If the `--include-path` flag was used, it overrides the default `$env.NU_LIB_DIRS` that was obtained above.                                                                                                                                                                                                                                                                        |
| 9.   | (main)                          | Loads the initial `$env.config` values from the internal defaults.                                                                                                                                                                                                                                                                                                                 |
| 10.  | (stdlib)                        | Loads the [Standard Library](./standard_library.md) into the virtual filesystem. It is not parsed or evaluated at this point.                                                                                                                                                                                                                                                      |
| 11.  | (stdlib)                        | Parses and evaluates `std/core`, which brings the `banner` and `pwd` commands into scope.                                                                                                                                                                                                                                                                                          |
| 12.  | (main)                          | Generates the initial `$nu` record constant so that items such as `$nu.default-config-dir` can be used in the following config files.                                                                                                                                                                                                                                              |
| 13.  | (main)                          | Loads any plugins that were specified using the `--plugin` flag.                                                                                                                                                                                                                                                                                                                   |
| 14.  | (config files) (plugin)         | Processes the signatures in the user's `plugin.msgpackz` (located in the configuration directory) so that added plugins can be used in the following config files.                                                                                                                                                                                                                 |
| 15.  | (config files)                  | If this is the first time Nushell has been launched, then it creates the configuration directory. "First launch" is determined by whether or not the configuration directory exists.                                                                                                                                                                                               |
| 16.  | (config files)                  | Also, if this is the first time Nushell has been launched, creates a mostly empty (other than a few comments) `env.nu` and `config .nu` in that directory.                                                                                                                                                                                                                         |
| 17.  | (config files) (default_env.nu) | Loads default environment variables from the internal `default_env.nu`. This file can be viewed with: `nu config env --default \| nu-highlight \| less -R`.                                                                                                                                                                                                                        |
| 18.  | (config files) (env.nu)         | Converts the `PATH` variable into a list so that it can be accessed more easily in the next step.                                                                                                                                                                                                                                                                                  |
| 19.  | (config files) (env.nu)         | Loads (parses and evaluates) the user's `env.nu` (the path to which was determined above).                                                                                                                                                                                                                                                                                         |
| 20.  | (config files) (config.nu)      | Processes any `ENV_CONVERSIONS` that were defined in the user's `env.nu` so that those environment variables can be treated as Nushell structured data in the `config.nu`.                                                                                                                                                                                                         |
| 21.  | (config files) (config.nu)      | Loads a minimal `$env.config` record from the internal `default_config.nu`. This file can be viewed with: `nu config nu --default \| nu-highlight \| less -R`.                                                                                                                                                                                                                     |
| 21.  | (config files) (config.nu)      | Loads (parses and evaluates) the user's `config.nu` (the path to which was determined above).                                                                                                                                                                                                                                                                                      |
| 22.  | (config files) (login)          | When Nushell is running as a login shell, loads the user's `login.nu`.                                                                                                                                                                                                                                                                                                             |
| 23.  | (config files)                  | Loops through autoload directories and loads any `.nu` files found. The directories are processed in the order found in `$nu.vendor-autoload-directories`, and files in those directories are processed in alphabetical order.                                                                                                                                                     |
| 24.  | (repl)                          | Processes any additional `ENV_CONVERSIONS` that were defined in `config.nu` or the autoload files.                                                                                                                                                                                                                                                                                 |
| 25.  | (repl) and (stdlib)             | Shows the banner if configured.                                                                                                                                                                                                                                                                                                                                                    |
| 26.  | (repl)                          | Nushell enters the normal commandline (REPL).                                                                                                                                                                                                                                                                                                                                      |

## Flag Behavior

| Mode                | Command/Flags                              | Behavior                                                                                                                                                                                                                                                                                     |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal Shell        | `nu` (no flags)                            | All launch steps **_except_** those marked with **_(login)_** occur.                                                                                                                                                                                                                         |
| Login Shell         | `nu --login/-l`                            | All launch steps occur.                                                                                                                                                                                                                                                                      |
| Command-string      | `nu --commands <command-string>` (or `-c`) | All Launch stages **_except_** those marked with **_(config files)_** or **_(repl)_** occur. However, **_(default_env)_** and **_(plugin)_** do occur. The first allows the path `ENV_CONVERSIONS` defined there can take place. The second allows plugins to be used in the command-string. |
| Script file         | `nu <script_file>`                         | Same as with Command-string.                                                                                                                                                                                                                                                                 |
| No config           | `nu -n`                                    | **_(config files)_** stages do **_not_** occur, regardless of other flags.                                                                                                                                                                                                                   |
| No Standard Library | `nu --no-std-lib`                          | Regardless of other flags, the steps marked **_(stdlib)_** will **_not_** occur.                                                                                                                                                                                                             |
| Force config file   | `nu --config <file>`                       | Forces steps marked with **_(config.nu)_** above to run, unless `-n` was also specified                                                                                                                                                                                                      |
| Force env file      | `nu --env-config <file>`                   | Forces steps marked with **_(default_env.nu)_** and **_(env.nu)_** above to run, unless `-n` was also specified                                                                                                                                                                              |

## Simplified Examples

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
