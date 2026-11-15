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
3. `login.nu` runs commands or handles configuration that should only take place when Nushell is running as a login shell.
4. `*.nu` files in `$nu.vendor-autoload-dirs` are loaded. These directories are intended for vendors' and package managers' startup files.
5. `*.nu` files in `$nu.user-autoload-dirs` are loaded. These files may be used for any startup tasks and are a good way to modularize the configuration.

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

The first time Nushell is launched, it will create the configuration directory and an empty (other than comments) `env.nu` and `config.nu`. It prints where it put them:

```
Environment config file created at: /home/me/.config/nushell/env.nu
Config file created at: /home/me/.config/nushell/config.nu
```

Nushell decides that this is the first launch only when the configuration directory doesn't exist. If you delete `config.nu` later, Nushell starts without it and doesn't write a new one. To get the commented `config.nu` back, run `config reset --nu --without-backup`. Plain [`config reset`](/commands/docs/config_reset.md) writes the same text into both files after renaming the current ones to `oldconfig-<date>.nu` and `oldenv-<date>.nu`, and fails if one of them is missing (see [`config reset`](#config-reset)). Nushell doesn't create the `autoload` directory; see [Autoload directories](#autoload-directories).

::: tip
You can quickly open `config.nu` in your default text editor using the `config nu` command. Likewise, the `config env` command will open `env.nu`. If Nushell was started with `--config` or `--env-config`, these commands open that file instead.

This requires that you have configured an editor. Nushell uses the first of these that is set:

1. Nushell's `$env.config.buffer_editor` setting
2. The `$env.VISUAL` environment variable
3. The `$env.EDITOR` environment variable

If none of them is set, `config nu` fails with a `No editor configured` error.

For example, place this in your `config.nu` to edit your files in Visual Studio Code:

```nu
$env.config.buffer_editor = 'code'
```

A string names only the program. To pass arguments to the editor, use a list, as in `['code', '--wait']`. See [`buffer_editor`](./config_reference.md#buffer-editor) for the `{file}`, `{line}`, and `{col}` placeholders.
:::

### Autoload directories

After `config.nu`, and after `login.nu` in a login shell, Nushell loads every file whose name ends in `.nu` from the autoload directories. It goes through the vendor directories first, in the order `$nu.vendor-autoload-dirs` lists them, then the user directory. Directories that don't exist are skipped.

Within a directory, files load in the byte order of their names, not in dictionary order. Digits come before uppercase letters, uppercase before lowercase, and `10.nu` before `9.nu`. If the order matters, start the names with zero-padded numbers, such as `01-path.nu` and `02-aliases.nu`. Nushell doesn't look inside subdirectories and skips files with other extensions.

`$nu.user-autoload-dirs` always holds exactly one directory, `autoload` inside the configuration directory, so it moves along with `XDG_CONFIG_HOME` and `--config-home`. Nushell doesn't create it. To start using it:

```nu
mkdir ($nu.user-autoload-dirs | first)
```

`$nu.vendor-autoload-dirs` is for files that package managers and other programs install. It lists, in load order:

1. On macOS, `/Library/Application Support/nushell/vendor/autoload`.
2. On Linux, macOS, and other Unix systems, `nushell/vendor/autoload` in each directory of `XDG_DATA_DIRS`, starting with the last one, so that the first directory loads last and wins. When `XDG_DATA_DIRS` is unset or empty, Nushell uses `/usr/local/share/:/usr/share/`, which packagers can change when they build Nushell. Relative entries are skipped.
3. On Windows, `nushell\vendor\autoload` in `%ProgramData%`.
4. The directory that packagers can compile in with `NU_VENDOR_AUTOLOAD_DIR`, if there is one.
5. `vendor/autoload` in `$nu.data-dir`.
6. The directory in the `NU_VENDOR_AUTOLOAD_DIR` environment variable, if it is set to an absolute path.

A directory that would appear twice is listed only once, in its first place. See [Startup Variables](#startup-variables) for the variables that change these directories.

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

To run an external command, Nushell looks for it in the `PATH` directories, in order. On Windows, it looks in the current directory first, before any `PATH` entry. Windows also tries the file extensions listed in `PATHEXT`. Nushell reads that list from the environment it was started with, so changing `$env.PATHEXT` inside Nushell doesn't change which files it finds.

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

`path add` takes one or more paths and changes `$env.PATH`, or `$env.Path` when there is no `PATH` variable:

- It expands each path with [`path expand --no-symlink`](/lang-guide/chapters/types/other_types/path.md#absolute-paths-with-path-expand), so `~` and relative paths become absolute and symbolic links are kept as they are.
- `--append` (`-a`) adds the paths at the end instead of the front.
- Afterwards, it removes repeated entries from the whole list, keeping the first. A directory that is already in the path moves to the front, or stays where it was with `--append`.
- `--ret` (`-r`) also returns the new list.
- A record picks a path by operating system, using the names that `$nu.os-info.name` reports, such as `linux`, `macos`, and `windows`. A record without a key for the current system adds nothing.
- With no paths, it fails with `Empty input`, and with a value that isn't a string or a record, `Invalid input`.

```nu
path add --append {linux: "/opt/tools/bin", macos: "/opt/homebrew/bin"}
```

::: tip
Notice the use of `path join` in the example above. This command properly joins two path
components regardless of whether or not the path separator is present. See
[Working with Paths](./working_with_paths.md) for more commands in this category.

[`path join`](/commands/docs/path_join.md) also joins a list of parts, and a part that is an absolute path replaces everything before it:

```nu
[$nu.home-dir ".cargo" "bin"] | path join
# => /home/me/.cargo/bin
"/home/me" | path join "/opt/tools" "bin"
# => /opt/tools/bin
```

:::

### Prompt Configuration

Nushell provides a number of prompt configuration options. By default, Nushell includes:

- A prompt which includes the current directory, abbreviated using `~` if it is (or is under)
  the home directory. The directory is green, or red when Nushell runs with administrator (root) rights.
- A prompt indicator which appears immediately to the right of the prompt. This defaults to `> ` when in normal editing mode, or a `: ` when in Vi-insert mode. Note extra space after the character to provide separation of the command from the prompt.
- A right-prompt with the date and time. When the last command failed, its exit code (`$env.LAST_EXIT_CODE`) appears in red in front of the date.
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

A job started from a prompt closure, or from a `pre_prompt` or `env_change` [hook](./hooks.md), can finish before the prompt is drawn, for example when `git` answers quickly. Its `commandline set-prompt` still shows on that prompt. The same is true when a hook or prompt closure calls `commandline set-prompt` directly: the pushed text replaces what the prompt variable gives that segment.

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

`path expand --no-symlink` makes each directory absolute without following symbolic links, so a linked directory keeps the path you gave it. See [Absolute paths with `path expand`](/lang-guide/chapters/types/other_types/path.md#absolute-paths-with-path-expand).

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

`config nu --default` prints the built-in `default_config.nu` instead, and `config env --doc` and `config env --default` do the same for `env.nu`. Each command takes only one of the two flags at a time; giving both is an error.

The [Configuration reference](./config_reference.md) lists every setting with its type, default, and accepted values. Some of the more recently added settings are:

- `error_style`: `"fancy"` (the default), `"plain"`, `"short"` for concise single-line error messages, or `"nested"` to show related errors nested under the main one. `error_lines` sets how many lines of source code the `fancy` and `nested` styles show above and below the line with the error (default `1`, and it can't be negative). See [Errors](./config_reference.md#errors).
- `auto_cd_implicit`: when `true`, typing just the name of a subdirectory (such as `src`) changes into it. By default, auto-cd requires a path such as `./src`. See [`auto_cd_implicit`](./config_reference.md#auto-cd-implicit) for how auto-cd works.
- `history.path`: a custom location for the history file, or `null` to keep no history file. `history.ignore_space_prefixed` (default `true`) keeps commands that start with a space out of the history. See [History](./config_reference.md#history).
- `completions.cache_size`: how many Tab-completion prefixes to remember (default `100`; `0` disables the cache). `completions.persistent_menus`: when `true`, completion and history menus stay open while you edit the commandline. See [`completions.cache_size`](./config_reference.md#completions-cache-size) for when Nushell empties the cache.

To avoid overwriting existing settings, it's best to simply assign updated values to the desired configuration keys, rather than the entire `config` record. In other words:

::: warning Wrong

```nu
$env.config = {
  show_banner: false
  color_config: { string: red }
}
```

Nushell merges a record assigned to `$env.config` into the current settings, so the keys it doesn't name keep their values. A key that holds a list or a free-form record is replaced whole, though. Here `color_config` ends up with only the `string` entry, and every other color setting is dropped. The same happens to `keybindings`, `menus`, `abbreviations`, `explore`, `tui`, `plugins`, `hooks.env_change`, and the `pre_prompt` and `pre_execution` hook lists.
:::

::: tip Right

```nu
$env.config.show_banner = false
$env.config.color_config.string = 'red'
```

This changes _only_ the `show_banner` and `color_config.string` values, leaving all other keys with their existing values.
:::

Certain keys are themselves also records. Assigning a record to one of them merges it the same way, so you only need to list the values you want to change. For example:

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

#### Errors in settings

Nushell checks every value you assign to `$env.config`. When something is wrong, the assignment raises a `nu::shell::invalid_config` error that lists each problem with its own code:

- `nu::shell::unknown_config_option` for a key Nushell doesn't know, often a typo.
- `nu::shell::invalid_value` for a value outside the accepted set. The label lists the values it accepts.
- `nu::shell::type_mismatch` for a value of the wrong type.
- `nu::shell::missing_required_column` for a record without a key it needs, such as `table.trim` without `methodology`.

Other errors can appear in the list too. For example, a keybinding without an `event` gives `nu::shell::column_not_found`. The history lock error above is reported the same way.

A setting with an error keeps its old value, and the other settings in the same assignment still change:

```nu
$env.config.completions = { case_sensitive: true, algorithm: "fast", partal: false }
# => Error: nu::shell::invalid_config
# =>
# =>   × Encountered 2 error(s) when updating config
# =>
# => Error: nu::shell::invalid_value
# =>
# =>   × Invalid value for $env.config.completions.algorithm
# =>    ╭─[repl_entry #1:1:62]
# =>  1 │ $env.config.completions = { case_sensitive: true, algorithm: "fast", partal: false }
# =>    ·                                                              ───┬──
# =>    ·                                                                 ╰── expected 'prefix' or 'fuzzy' or 'substring', but got 'fast'
# =>    ╰────
# =>
# => Error: nu::shell::unknown_config_option
# =>
# =>   × Unknown config option: $env.config.completions.partal
# =>    ╭─[repl_entry #1:1:78]
# =>  1 │ $env.config.completions = { case_sensitive: true, algorithm: "fast", partal: false }
# =>    ·                                                                              ──┬──
# =>    ·                                                                                ╰── remove this
# =>    ╰────
$env.config.completions.case_sensitive
# => true
```

The error stops the rest of the script, or the rest of `config.nu`, like any other error, unless you catch it with [`try`](/commands/docs/try.md). See [Problems with startup files](#problems-with-startup-files) for how startup continues after an error in `config.nu`.

A common mistake is leaving out the colons in a record. `{ mode light }` is a closure, not a record, and the error says so:

```nu
$env.config.table = { mode light }
# => Error: nu::shell::invalid_config
# =>
# =>   × Encountered 1 error(s) when updating config
# =>
# => Error: nu::shell::type_mismatch
# =>
# =>   × Type mismatch at $env.config.table
# =>    ╭─[repl_entry #1:1:21]
# =>  1 │ $env.config.table = { mode light }
# =>    ·                     ───────┬──────
# =>    ·                            ╰── expected record, but got closure
# =>    ╰────
# =>   help: If you meant a record, use `key: value` fields (colon required). A
# =>         missing `:` makes `{ … }` parse as a closure/block.
```

A few combinations only produce a warning (`nu::shell::incompatible_options`), and the value is still set. For example, setting `history.isolation = true` in `config.nu` while history uses the plain-text format warns that isolation needs SQLite history.

### The `config` commands

[`config`](/commands/docs/config.md) on its own only prints its help. The work is done by its subcommands:

| Command                                                                                  | What it does                                                                                                                    |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [`config nu`](/commands/docs/config_nu.md), [`config env`](/commands/docs/config_env.md) | Opens `config.nu` or `env.nu` in your editor. `--doc` prints the documented settings and `--default` the built-in startup file. |
| [`config default`](/commands/docs/config_default.md)                                     | Returns the settings Nushell starts with.                                                                                       |
| [`config flatten`](/commands/docs/config_flatten.md)                                     | Returns the current settings as one flat record.                                                                                |
| [`config reset`](/commands/docs/config_reset.md)                                         | Replaces `config.nu` and `env.nu` with the files Nushell writes on its first launch.                                            |
| [`config use-colors`](/commands/docs/config_use-colors.md)                               | Returns whether Nushell colors its output right now. See [`use_ansi_coloring`](./config_reference.md#use-ansi-coloring).        |

#### `config default`

`config default` returns the `$env.config` record as it is before any configuration file runs. In a session started with `nu -n`, `$env.config` and `config default` are equal. The record includes the keybindings and menus that Nushell adds, such as the <kbd>Tab</kbd> completion menu, but not Reedline's own key table, which [`keybindings default`](/commands/docs/keybindings_default.md) lists. `config default` also runs at parse time, so `const defaults = config default` works.

Compare it with `$env.config` to find the settings you have changed:

```nu
$env.config.show_banner = false
$env.config.edit_mode = "vi"
let defaults = config default
$env.config | columns | where {|key| ($env.config | get $key) != ($defaults | get $key) }
# => ╭───┬─────────────╮
# => │ 0 │ edit_mode   │
# => │ 1 │ show_banner │
# => ╰───┴─────────────╯
```

To put one group of settings back, assign it from the defaults, as in `$env.config.table = (config default).table`.

#### `config flatten`

`config flatten` returns the current settings as a single record with one entry per setting. Each key is the path to the setting, with its parts joined by `.`:

```nu
config flatten | transpose key value | where key starts-with history
# => ╭───┬───────────────────────────────┬───────────╮
# => │ # │              key              │   value   │
# => ├───┼───────────────────────────────┼───────────┤
# => │ 0 │ history.max_size              │    100000 │
# => │ 1 │ history.sync_on_enter         │ true      │
# => │ 2 │ history.file_format           │ Plaintext │
# => │ 3 │ history.isolation             │ false     │
# => │ 4 │ history.path                  │ Default   │
# => │ 5 │ history.ignore_space_prefixed │ true      │
# => ╰───┴───────────────────────────────┴───────────╯
```

Nushell builds this record from its internal form of the settings, not from `$env.config`, so the values look different in places:

- Many settings with a fixed set of values show Nushell's internal names, which start with a capital letter, such as `Plaintext`, `Rounded`, and `Fancy`. The values inside `keybindings` and `menus`, such as `none` and `columnar`, keep the spelling you wrote. `history.path` shows `Default` for the default location.
- A list gets one key per item, numbered from `0`, as in `keybindings.0.name` and `keybindings.0.mode.0`.
- Durations are integers in nanoseconds, so `plugin_gc.default.stop_after` is `10000000000`.
- A closure, such as a hook, shows as its source text.
- An empty list or record has no keys at all, so `hooks.pre_prompt`, `abbreviations`, and `plugins` are missing until they have entries. `buffer_editor` is missing until you set it.

Because the keys contain dots, quote a key to read it: `config flatten | get "table.mode"` returns `Rounded`. Without the quotes, `get` reads `table.mode` as a path and fails with `Name not found`.

#### `config reset`

`config reset` overwrites `config.nu` and `env.nu` in `$nu.default-config-dir` with the commented files that Nushell writes on its first launch. First it renames each current file to `oldconfig-<date>.nu` or `oldenv-<date>.nu` in the same directory, with the date and time down to the second, as in `oldconfig-2026-11-14-17-38-30.nu`. The running session keeps its settings. Start a new `nu` to load the reset files.

- `--nu` (`-n`) resets only `config.nu`, and `--env` (`-e`) only `env.nu`. Giving both flags resets neither file.
- `--without-backup` (`-w`) skips the renaming, so the old contents are lost.
- `config reset` always works on the files in `$nu.default-config-dir`. A file you passed to `nu` with `--config` or `--env-config` stays as it is.
- Unless you pass `--without-backup`, a missing file is an error, `config.nu could not be backed up` or `env.nu could not be backed up`, although the label says `Directory not found`. `config.nu` is handled first, so when only `env.nu` is missing, `config.nu` has already been reset when the error appears. To recreate a single deleted file, combine `--without-backup` with `--nu` or `--env`.
- With `--without-backup`, a file that can't be written, for example because the configuration directory doesn't exist, is skipped without an error, and nothing is written.

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

To keep only the line with the startup time, set `$env.config.show_banner = "short"` instead. The setting also accepts `"full"`, which is the same as `true`, and `"none"`, which is the same as `false`. The banner's colors come from `color_config.banner_foreground`, `banner_highlight1`, and `banner_highlight2`. See [`show_banner`](./config_reference.md#show-banner).

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

  An empty value is ignored. A relative path is ignored too, but Nushell reports it with a `nu::shell::xdg_config_home_invalid` error that names the directory it uses instead, and then starts normally with the platform's default directory.

  On macOS and Windows, where the platform's configuration directory isn't the XDG one, Nushell also warns when `<XDG_CONFIG_HOME>/nushell` is empty or missing while the platform's `nushell` directory still has files in it. It doesn't copy anything for you:

  ```
  WARNING: XDG_CONFIG_HOME has been set but /Users/me/dotfiles/nushell is empty.
  Nushell will not move your configuration files from /Users/me/Library/Application Support/nushell
  ```

  The configuration directory can also be chosen with the `--config-home <path>` flag when launching `nu`, which takes precedence over `XDG_CONFIG_HOME`. Unlike `XDG_CONFIG_HOME`, the path given to `--config-home` is the Nushell configuration directory itself (no `nushell` subdirectory is added), a leading `~` is expanded to your home directory, and a relative path is resolved against the current directory.

- `$env.XDG_DATA_HOME`: If this environment variable is set to an absolute path, Nushell sets the `$nu.data-dir` constant to `($env.XDG_DATA_HOME)/nushell`. Otherwise `$nu.data-dir` is the `nushell` directory under the platform's data directory, such as `~/Library/Application Support/nushell` on macOS, `~/.local/share/nushell` on Linux, or `%APPDATA%\nushell` on Windows. A relative or empty value is ignored without a warning. The `data-dir` is used in several startup tasks:

  - `($nu.data-dir)/completions` is added to the `const` variable [`$NU_LIB_DIRS`](./special_variables.md#nu-lib-dirs), as well as to `$env.NU_LIB_DIRS`, which starts with the same default list. The constant is the preferred way to configure the search path; see [`NU_LIB_DIRS` Constant](#nu-lib-dirs-constant) below.
  - `($nu.data-dir)/vendor/autoload` is added to `$nu.vendor-autoload-dirs` after the system vendor directories (such as those from `XDG_DATA_DIRS`). Files in this directory will be read after those in the other vendor autoload directories, thus overriding any of their settings.

  Note that the directory represented by `$nu.data-dir`, including any of its subdirectories, are NOT created by default. Creation and use of these directories is up to the user.

- `$env.XDG_DATA_DIRS` _(Unix Platforms Only)_: If this environment variable is set, it is used to populate the `$nu.vendor-autoload-dirs` directories. Following the XDG convention that earlier entries take precedence, the directories are processed in _reverse_ order: the first directory in `XDG_DATA_DIRS` is read last, giving it the ability to override definitions from the others. When the variable is unset or empty, Nushell uses `/usr/local/share/:/usr/share/`. Relative entries are skipped. See [Autoload directories](#autoload-directories) for the whole list.

- `$env.XDG_CACHE_HOME`: If this environment variable is set to an absolute path, Nushell sets the `$nu.cache-dir` constant to `($env.XDG_CACHE_HOME)/nushell`. Otherwise `$nu.cache-dir` is the `nushell` directory under the platform's cache directory, such as `~/Library/Caches/nushell` on macOS, `~/.cache/nushell` on Linux, or `%LOCALAPPDATA%\nushell` on Windows. A relative or empty value is ignored. Nushell doesn't store anything in this directory or create it. It is a standard place for your scripts and plugins to keep data they can rebuild.

- `$env.NU_VENDOR_AUTOLOAD_DIR`: If this environment variable is set to an absolute path, Nushell adds that directory to the end of `$nu.vendor-autoload-dirs`, after the `$nu.data-dir` one, so its files load last among the vendor files and can override the others. Unlike the other entries, the path is used as given, without `nushell/vendor/autoload` appended. A relative path is ignored, and a directory already in the list isn't added twice.

  Packagers can also set `NU_VENDOR_AUTOLOAD_DIR` when they build Nushell. The value is compiled into `nu` and placed just before the `$nu.data-dir` entry. The build-time and runtime values can be used together.

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
| 1.   | (main)                          | Processes commandline arguments such as `--plugin-config <file>`, `--plugins <list>`, `--experimental-options <list>`, and others. See [`nu` flags](#nu-flags) for a complete list.                                                                                                                                                                                                                                             |
| 2.   | (main)                          | Gets the configuration directory. This is OS-dependent (see [dirs::config_dir](https://docs.rs/dirs/latest/dirs/fn.config_dir.html)), but can be overridden using `XDG_CONFIG_HOME` on all platforms as discussed [above](#changing-default-directories), or with the `--config-home <path>` flag.                                                                                                                              |
| 3.   | (main)                          | Gets the path to `env.nu` and `config.nu`. By default, these are located in the config directory, but either or both can be overridden using the `--env-config <path>` and `--config <path>` flags. The data directory, the autoload directories, and the plugin registry file are located at this point as well.                                                                                                               |
| 4.   | (main)                          | Creates the initial `$env.NU_PLUGIN_DIRS` variable. By default, it is an empty list.                                                                                                                                                                                                                                                                                                                                            |
| 5.   | (main)                          | Creates the initial `$NU_PLUGIN_DIRS` constant. By default, this will include (1) the `plugins` directory under the configuration directory, and (2) the directory where the currently running `nu`/`nu.exe` is located.                                                                                                                                                                                                        |
| 6.   | (main)                          | Initializes the in-memory SQLite database. This allows the [`stor` family of commands](./working_with_sqlite.md#how-long-it-lasts) to be used in the following configuration files.                                                                                                                                                                                                                                             |
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
| 24.  | (config files)                  | Loops through the vendor autoload directories and loads any `.nu` files found. The directories are processed in the order found in `$nu.vendor-autoload-dirs`, and files in those directories are processed in the byte order of their names (see [Autoload directories](#autoload-directories)).                                                                                                                               |
| 25.  | (config files)                  | Loops through the user autoload directory and loads any `.nu` files found. `$nu.user-autoload-dirs` holds one directory, and files in it are processed in the byte order of their names.                                                                                                                                                                                                                                        |
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
| Script file         | `nu <script_file>`                         | Same as with Command-string, except that `--login/-l` doesn't add the **_(env.nu)_**, **_(config.nu)_**, and **_(login)_** steps.                                                                                                                                                                        |
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

- `nu -l test.nu`

  - Same as `nu test.nu`. Unlike with `-c`, `-l` doesn't make Nushell load `env.nu`, `config.nu`, or `login.nu` for a script file.

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

### `nu` flags

`nu --help` lists every flag with a one-line description. It prints the list in color only when its output goes to a terminal. The tables below say more about what each flag does. A command line is `nu [flags] [script file] [script arguments]`.

Running commands:

| Flag                          | What it does                                                                                                                                                                                                                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-c`, `--commands <string>`   | Runs the commands and exits. Any arguments after the commands go to their `main` command; see [Arguments with `nu -c`](./scripts.md#arguments-with-nu-c).                                                                                                                                                           |
| `-e`, `--execute <string>`    | Runs the commands after the startup files have loaded, then starts the REPL. It is ignored when `-c` or a script file is given.                                                                                                                                                                                     |
| `-l`, `--login`               | Starts a login shell, which also loads `login.nu`. Nushell starts as a login shell, too, when the name it was started under (`argv[0]`) begins with `-`, which is how `login` and `sshd` start a user's shell. With `-c`, `-l` also loads `env.nu` and `config.nu`; with a script file, it loads none of the three. |
| `-i`, `--interactive`         | Treats a `-c` or script run as an interactive session. On Unix, Nushell then takes control of the terminal and hands it to each external command while it runs, as the REPL does.                                                                                                                                   |
| `--stdin`                     | Lets the `-c` commands or the script read the input piped to `nu` as `$in`. See [Shebangs](./scripts.md#shebangs).                                                                                                                                                                                                  |
| `--no-newline`                | Prints the result of the `-c` commands without a newline at the end.                                                                                                                                                                                                                                                |
| `-m`, `--table-mode <string>` | Draws tables in this mode for the whole run, over the `table.mode` setting from the configuration files. `$env.config.table.mode` still shows the configured value.                                                                                                                                                 |
| `--error-style <string>`      | Sets the error style to `fancy`, `plain`, or `short` for a `-c` run. It has no effect on a script file or the REPL, and it doesn't accept `nested`; set `$env.config.error_style` for those.                                                                                                                        |

Configuration:

| Flag                            | What it does                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `-n`, `--no-config-file`        | Skips the plugin registry, `default_env.nu`, `env.nu`, `config.nu`, `login.nu`, and the autoload files. Nushell also ignores the `NU_EXPERIMENTAL_OPTIONS` variable. Plugins given with `--plugins` still load.                                                                                                                                                                                                    |
| `--no-std-lib`                  | Starts without the [Standard Library](./standard_library.md). The `std` modules, the banner, and the `pwd` command from the standard library aren't available; `pwd` then runs the external program of that name, if there is one.                                                                                                                                                                                 |
| `--no-history`                  | Starts the REPL without reading or writing the history file. `$nu.history-enabled` is `false`.                                                                                                                                                                                                                                                                                                                     |
| `-I`, `--include-path <string>` | Adds directories to `$NU_LIB_DIRS` and `$env.NU_LIB_DIRS`, after those from an inherited `NU_LIB_DIRS` variable and before the default ones. Separate several directories with `:`, `;`, or the ASCII record separator character, `(char record_sep)`, on every platform. Because `:` separates too, a Windows path with a drive letter, such as `C:\libs`, is split in two.                                       |
| `--config <path>`               | Loads this file instead of `config.nu`. `$nu.config-path` shows it, and `config nu` opens it.                                                                                                                                                                                                                                                                                                                      |
| `--env-config <path>`           | Loads this file instead of `env.nu`. `$nu.env-path` shows it, and `config env` opens it.                                                                                                                                                                                                                                                                                                                           |
| `--config-home <path>`          | Uses this directory as the configuration directory, instead of `<XDG_CONFIG_HOME>/nushell` or the platform default. See [Startup Variables](#startup-variables).                                                                                                                                                                                                                                                   |
| `--plugin-config <path>`        | Uses this file as the plugin registry instead of `plugin.msgpackz` in the configuration directory. Nushell loads the plugins registered in it at startup, [`plugin add`](/commands/docs/plugin_add.md), `plugin rm`, and `plugin use` read and write it, and `$nu.plugin-path` shows it. If the file's directory doesn't exist, Nushell reports `File not found` for that directory and starts without a registry. |
| `--plugins <path>`              | Loads these plugin executables for this session only, without adding them to the registry. Give several with repeated flags or a list, as in `--plugins '[/path/a /path/b]'`.                                                                                                                                                                                                                                      |
| `--experimental-options <list>` | Turns experimental options on or off. See [Experimental options](#experimental-options).                                                                                                                                                                                                                                                                                                                           |

In the four path flags, a leading `~` is expanded to your home directory, and a relative path is resolved against the current directory. A `--config` or `--env-config` file that doesn't exist is an error; see [Problems with startup files](#problems-with-startup-files). With `-n`, Nushell loads none of these files. `$nu.plugin-path` still shows the `--plugin-config` path, but `plugin add`, `plugin rm`, and `plugin use` fail with `Plugin registry file not set` unless you pass them their own `--plugin-config`.

Other flags:

| Flag                                                                                                   | What it does                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-h`, `--help`                                                                                         | Prints the list of flags and exits.                                                                                                                                             |
| `-v`, `--version`                                                                                      | Prints the version number and exits.                                                                                                                                            |
| `--log-level <string>`                                                                                 | Turns on Nushell's internal diagnostic log at `error`, `warn`, `info`, `debug`, `trace`, or `perf` level. This is unrelated to the [`std/log`](./standard_library.md) commands. |
| `--log-target <string>`, `--log-file <path>`                                                           | Sends the log to `stderr` (the default), `stdout`, `mixed`, or a `file` named with `--log-file`.                                                                                |
| `--log-include <string...>`, `--log-exclude <string...>`                                               | Keeps or drops log lines by the Rust module they come from, such as `nu_cli`.                                                                                                   |
| `--mcp`, `--mcp-transport`, `--mcp-port`, `--mcp-host`, `--mcp-allowed-hosts`, `--mcp-allowed-origins` | Start Nushell as a Model Context Protocol server. See [MCP Server](./mcp.md).                                                                                                   |
| `--lsp`                                                                                                | Starts Nushell as a language server. See [Language server](./language_server.md).                                                                                               |
| `--dap`                                                                                                | Starts Nushell as a debug adapter. See [Debugging Scripts](./debugging.md).                                                                                                     |
| `--ide-goto-def`, `--ide-hover`, `--ide-complete`, `--ide-check`, `--ide-ast`                          | Answer one question about the script file that follows and print the answer as JSON, for editor integrations.                                                                   |

### Passing flags to `nu`

`nu` reads its flags in the usual Unix styles:

- A long flag takes its value after a space or after `=`, as in `--table-mode light` or `--table-mode=light`.
- A short flag works the same way, as in `-m light` or `-m=light`. Writing the value right after the letter, as in `-mlight`, is an error.
- Short flags can share one `-`, so `-nl` means `-n -l`. Only the last letter of such a group can be a flag that takes a value. `nu -nc 'ls'` works, and `nu -cn 'ls'` is an error:

  ```nu
  nu -cn 'ls'
  # => Error: nu::shell::error
  # =>
  # =>   × `-c` expects a value
  # =>   help: Move `-c` to the end, then pass a value like `-c <value>` or
  # =>         `-c=<value>`.
  ```

- A value after `=` on a flag that doesn't take one, as in `-n=1`, is an error, and so is an empty value, as in `-c=`. A `-` on its own is an error too.

When a flag is unknown, `nu` suggests a flag with a similar name if it finds one:

```nu
nu --no-config
# => Error: nu::shell::error
# =>
# =>   × Unknown flag '--no-config'
# =>   help: Did you mean '--no-config-file'?
```

Flags that accept a fixed set of values, such as `--table-mode`, `--error-style`, `--log-level`, and `--experimental-options`, check the value the same way. A misspelled value gets a suggestion, so `--table-mode rouned` suggests `rounded`, and a value that is not close to any valid one gets the list of valid values. Any of these errors stops `nu` with exit status 1 before it runs anything.

### Starting the REPL without a terminal

The REPL needs a terminal to read from. When `nu` would start the REPL, because neither `-c` nor a script file was given, and its standard input isn't a terminal, it prints an error and exits with status 1:

```nu
"ls" | nu
# => Error:   × Nushell launched as a REPL, but STDIN is not a TTY; either launch in a
# =>   │ valid terminal or provide arguments to invoke a script!
```

The same happens when a program starts Nushell as a login shell with no command and no terminal. The check comes right before the line editor starts, after `env.nu`, `config.nu`, the autoload files, and any `--execute` commands have run, so their output appears before the error. `--stdin` doesn't change this. To run Nushell code from another program, pass it with `-c` or in a script file, and add `--stdin` if that code should read the piped input as `$in`.

### Problems with startup files

In the REPL, an error in `env.nu`, `config.nu`, `login.nu`, or an autoload file is printed, and startup goes on with the next file. A runtime error stops the rest of that file, but changes made before the error stay in effect. Commands that the file defines with `def` are available even when their definitions come after the error, because Nushell defines them when it parses the file. A parse error means none of the file runs.

With `-c` or a script file, the configuration files Nushell loads are strict. If one fails, `nu` stops before running the command or script and exits with that file's exit status, which is 1 for a Nushell error or the external command's own status. This covers the files given with `--env-config` and `--config`, and the default `env.nu` and `config.nu` that `-l` loads together with `-c`. `login.nu` is the exception. When it fails under `nu -l -c`, Nushell prints the error and still runs the command.

A path given with `--config` or `--env-config` that doesn't exist is an error:

```nu
nu --config missing.nu -c 'ls'
# => Error: File not found: missing.nu (config.nu)
# =>   help: Check the path passed to --config / --env-config, or create the file under your config directory.
```

With `-c` or a script file, `nu` then exits with status 1. The REPL prints the same error, with the full path, and starts without that file.

If Nushell itself panics while it loads the startup files for the REPL, it prints `A panic occurred while reading configuration files, using default configuration.`, resets `$env.config` to the defaults, and starts the REPL.

#### Broken symlinks

If you keep your configuration in another place, such as a dotfiles repository, and link to it, a broken link doesn't stop Nushell from starting. When the configuration directory, `env.nu`, `config.nu`, or `login.nu` is a symbolic link whose target doesn't exist, Nushell skips that file, keeps the built-in defaults, and prints a warning in the form `Warning: config.nu is a broken symlink (<link path> -> <target>); using built-in defaults.` For a broken configuration directory, the warning reads `config directory is a broken symlink`, and both `env.nu` and `config.nu` are skipped. Nushell never removes or replaces the link, and on first launch it doesn't create a configuration directory or default files in its place. A `--config` or `--env-config` path that is a broken link counts as a missing file and gets the `File not found` error above.

### Experimental options

Nushell ships some features as experimental options. An `opt-in` option is off until you turn it on, and an `opt-out` option is on until you turn it off. [`debug experimental-options`](/commands/docs/debug_experimental-options.md) lists them with their current state and a description:

```nu
debug experimental-options | select identifier enabled status
# => ╭───┬─────────────────────────────┬─────────┬────────────────────╮
# => │ # │         identifier          │ enabled │       status       │
# => ├───┼─────────────────────────────┼─────────┼────────────────────┤
# => │ 0 │ example                     │ false   │ deprecated-discard │
# => │ 1 │ dc-glob                     │ false   │ opt-in             │
# => │ 2 │ reorder-cell-paths          │ true    │ opt-out            │
# => │ 3 │ pipefail                    │ true    │ opt-out            │
# => │ 4 │ enforce-runtime-annotations │ true    │ opt-out            │
# => │ 5 │ native-clip                 │ false   │ opt-in             │
# => │ 6 │ cell-path-types             │ false   │ opt-in             │
# => ╰───┴─────────────────────────────┴─────────┴────────────────────╯
```

The other columns are `description`, `since`, which is the Nushell version that added the option, and `issue`, a link to the GitHub issue that tracks it. The `experimental_options` column of [`version`](/commands/docs/version.md) gives the same states as one string, which is handy to paste into a bug report:

```nu
version | get experimental_options
# => example=false, dc-glob=false, reorder-cell-paths=true, pipefail=true, enforce-runtime-annotations=true, native-clip=false, cell-path-types=false
```

Both show the options as they were set when this `nu` started. No command changes them in a running session.

You can set them when Nushell starts, with the `--experimental-options` flag or the `NU_EXPERIMENTAL_OPTIONS` environment variable. Each entry is an option name, which turns the option on, or `name=true` or `name=false`. A bare `all` turns on every option that isn't deprecated. The variable also accepts `all=false`, which turns all of them off, but the flag accepts only a bare `all`. The variable holds a comma-separated list:

```nu
NU_EXPERIMENTAL_OPTIONS='native-clip,pipefail=false' nu
```

Nushell reads `NU_EXPERIMENTAL_OPTIONS` once, before any configuration file, so it has to be in the environment that starts `nu`. Setting it in `config.nu` has no effect on that session. When both are given, the flag is applied after the variable, so the flag wins for an option that both name.

Problems in the variable are warnings, not errors. Nushell reports an unknown name or a value other than `true` or `false`, skips that entry, and starts anyway:

```nu
NU_EXPERIMENTAL_OPTIONS='native-clp,pipefail=nope' nu
# => Warning: nu::experimental_option::unknown
# =>
# =>   ⚠ Unknown experimental option `native-clp`
# =>    ╭────
# =>  1 │ NU_EXPERIMENTAL_OPTIONS=native-clp,pipefail=nope
# =>    ·                         ──────────
# =>    ╰────
# =>   help: Known experimental options are: example, dc-glob, reorder-cell-paths,
# =>         pipefail, enforce-runtime-annotations, native-clip, cell-path-types
# =>
# => Warning: nu::experimental_option::invalid_assignment
# =>
# =>   ⚠ Invalid assignment for `pipefail`, expected `true` or `false`, got `nope`
# =>    ╭────
# =>  1 │ NU_EXPERIMENTAL_OPTIONS=native-clp,pipefail=nope
# =>    ·                                    ─────────────
# =>    ╰────
```

Naming a deprecated option also prints a warning. For a `deprecated-discard` option, the warning says it will be removed. For a `deprecated-default` option, it says the behavior is now the default and that you can remove the option.

The variable follows the same rule as your configuration files. Nushell ignores it, while still applying `--experimental-options`, in these cases:

- with `-n` or `--no-config-file`
- with `-c`, unless `-l`, `--config`, or `--env-config` is also given
- with a script file, unless `--config` or `--env-config` is also given, since `-l` doesn't load configuration files for a script

The REPL always reads it, unless `-n` is given.
