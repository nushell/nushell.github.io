# Configuration Reference

This page lists every setting in the `$env.config` record, grouped the way `config nu --doc` groups them. For each one it gives the type, the default, the values Nushell accepts, and what the setting changes.

Set a value by assigning to its cell path, usually in `config.nu`:

```nu
$env.config.table.mode = "light"
```

[Changing Settings in the `$env.config` Record](./configuration.md#changing-settings-in-the-env-config-record) explains how assigning a whole record merges into the current settings, and [Errors in settings](./configuration.md#errors-in-settings) explains what Nushell does with a value it can't use. `$env.config` shows the values in effect, and [`config default`](/commands/docs/config_default.md) shows the built-in defaults.

[[toc]]

## History

| Setting                         | Type             | Default       |
| ------------------------------- | ---------------- | ------------- |
| `history.file_format`           | string           | `"plaintext"` |
| `history.max_size`              | int              | `100_000`     |
| `history.sync_on_enter`         | bool             | `true`        |
| `history.isolation`             | bool             | `false`       |
| `history.path`                  | string or `null` | `""`          |
| `history.ignore_space_prefixed` | bool             | `true`        |

Nushell reads `file_format`, `max_size`, `isolation`, and `path` once, when the REPL starts, so set them in `config.nu`. Changing one of them later raises a `nu::shell::config_option_locked_after_startup` error. The other two take effect at the next prompt. Commands run with `nu -c` or in a script are never added to the history.

`max_size` is the number of entries plain-text history keeps. Once it is reached, each new entry pushes out the oldest one. SQLite history doesn't use it.

### `history.file_format`

`"plaintext"` stores one command per line, in a file named `history.txt`. `"sqlite"` stores the history in an SQLite database named `history.sqlite3`, and records more about each command: when it started, how long it ran, its exit status, the directory it ran in, the host name, and the session it came from. [`history --long`](/commands/docs/history.md) shows those columns, and `history.isolation` needs them. After you change `file_format`, [`history import`](/commands/docs/history_import.md) with no input copies the entries from the other format's file in the configuration directory into the file now in use.

A `nu` built without its `sqlite` feature still accepts `"sqlite"`, but it warns and keeps using plain text.

### `history.sync_on_enter`

This setting only affects plain-text history. With `true`, after each command Nushell writes the new entries to the file and reads in the entries that other open Nushell sessions have written, so their commands show up when you press <kbd>Up</kbd>. With `false`, Nushell writes the file only when it exits. SQLite history saves every command as soon as you run it.

### `history.isolation`

With SQLite history, `true` hides the commands that other Nushell sessions run while this one is open, so they don't appear when you walk through the history with <kbd>Up</kbd> and <kbd>Down</kbd>. Commands from before the session started still do. Plain-text history can't tell sessions apart, so with `file_format: "plaintext"` this setting does nothing, and setting it to `true` gives a `nu::shell::incompatible_options` warning.

### `history.path`

| Value              | History file                                                           |
| ------------------ | ---------------------------------------------------------------------- |
| `""` (the default) | `history.txt` or `history.sqlite3` in the configuration directory      |
| a directory        | `history.txt` or `history.sqlite3` in that directory                   |
| any other path     | that file                                                              |
| `null`             | none. The session remembers its own commands in memory until it exits. |

`$nu.history-path` shows the file in use.

Give an absolute path built from one of the [`$nu` constants](./configuration.md#nu-constant):

```nu
$env.config.history.path = ($nu.home-dir | path join ".nu_history.txt")
```

### `history.ignore_space_prefixed`

With `true`, a command line that starts with a space isn't saved to the history. A leading tab doesn't count. You can still bring the command back with <kbd>Up</kbd> until you run another command; after that it's gone. With `false`, every command is saved.

## Startup and miscellaneous

| Setting                | Type           | Default |
| ---------------------- | -------------- | ------- |
| `show_banner`          | bool or string | `true`  |
| `rm.always_trash`      | bool           | `false` |
| `recursion_limit`      | int            | `50`    |
| `max_last_result_size` | filesize       | `0b`    |
| `auto_cd_implicit`     | bool           | `false` |

### `show_banner`

| Value               | What Nushell shows when the REPL starts    |
| ------------------- | ------------------------------------------ |
| `true` or `"full"`  | The welcome message, then the startup time |
| `"short"`           | Only the `Startup Time:` line              |
| `false` or `"none"` | Nothing                                    |

Reading the setting back gives `true`, `"short"`, or `false`. The banner is the standard library's `banner` command, so `nu --no-std-lib` never shows it. Three `color_config` entries color it: `banner_foreground` for the text (default `"attr_normal"`), and `banner_highlight1` (default `"green"`) and `banner_highlight2` (default `"purple"`) for the highlighted words. See also [Remove Welcome Message](./configuration.md#remove-welcome-message).

### `rm.always_trash`

With `true`, [`rm`](/commands/docs/rm.md) moves files to the system trash as if you had passed `--trash`. With `false`, it deletes them permanently. The `--trash` and `--permanent` flags always win over this setting. Given both flags, `rm` uses the trash. When moving a file to the trash fails, the error suggests `--permanent`.

The trash needs a `nu` built with the `trash-support` feature, which the default build includes (`version | get features` lists it), and it isn't available on Android or iOS. Without it, `rm --trash` fails. Leave `rm.always_trash` at `false` there.

### `recursion_limit`

How deeply calls to custom commands and closures may nest. Each call to a custom command or closure, including those that [`each`](/commands/docs/each.md), `do`, and hooks make, adds one level. Going deeper raises `nu::shell::recursion_limit_reached` instead of crashing Nushell. The value must be greater than 1.

### `max_last_result_size`

How much memory `$ans.last` may hold. The default, `0b`, leaves `last` out of `$ans`. See [`$ans`](./special_variables.md#ans).

### `auto_cd_implicit`

At the prompt, you can change directories by typing just the path, without `cd`. This is called auto-cd:

```nu
./src
~
..
```

Nushell treats a line as auto-cd when all of these are true:

- The line is a single token. Wrapping it in backticks lets it contain spaces, as in `` `./My Documents` ``.
- The token looks like a path. It starts with `.`, `~`, `/`, or `\`, or it ends with the path separator (`/`, or `\` on Windows). On Windows, a drive such as `D:` or `D:\data` also counts.
- It names a directory that exists.

`auto_cd_implicit: true` drops the second rule, so typing just `src` changes into the `src` subdirectory. The directory wins over a command of the same name. With a subdirectory named `ls`, typing `ls` changes into it, and you need `^ls` or `%ls` to run the command.

Auto-cd sets `$env.OLDPWD` the way [`cd`](/commands/docs/cd.md) does, so `cd -` goes back, and it sets `$env.LAST_EXIT_CODE` to `0`. If you don't have permission to enter the directory, Nushell reports the error and stays where it is. A line that doesn't name an existing directory isn't auto-cd at all, so Nushell runs it as a command and reports that the command wasn't found. Auto-cd only works at the prompt, not in scripts.

## Clipboard

| Setting              | Type | Default                            |
| -------------------- | ---- | ---------------------------------- |
| `clip.resident_mode` | bool | `true` on Linux, `false` elsewhere |
| `clip.default_raw`   | bool | `false`                            |

These settings are for the built-in `clip copy` and `clip paste` commands, which only exist when the `native-clip` [experimental option](./configuration.md#experimental-options) is on. The standard library's `clip copy52` and `clip paste52` don't read them.

### `clip.resident_mode`

Only Linux uses this setting. On Linux, a program that copies text has to keep running to hand that text to other programs, unless a clipboard manager takes it over. With `true`, `clip copy` passes the text to a background thread inside Nushell, which keeps serving it until Nushell exits. To turn the thread off, set the older plugin-style setting, `$env.config.plugins.clip.NO_RESIDENT = true`.

### `clip.default_raw`

`clip paste` parses clipboard text that starts with `{`, `[`, or `"` as JSON and returns the value, and returns any other text, or text that isn't valid JSON, as a string. `clip paste --raw` always returns a string. `default_raw: true` swaps the two, so plain `clip paste` returns a string and `clip paste --raw` parses JSON.

`clip copy` doesn't read this setting. It copies a string as it is and copies any other value as the plain-text table that Nushell would print for it.

## Line editor

| Setting                     | Type                            | Default     |
| --------------------------- | ------------------------------- | ----------- |
| `edit_mode`                 | string                          | `"emacs"`   |
| `buffer_editor`             | string, list of strings, `null` | `null`      |
| `cursor_shape.emacs`        | string                          | `"inherit"` |
| `cursor_shape.vi_insert`    | string                          | `"inherit"` |
| `cursor_shape.vi_normal`    | string                          | `"inherit"` |
| `cursor_shape.vi_visual`    | string                          | `"inherit"` |
| `cursor_shape.helix_normal` | string                          | `"inherit"` |
| `cursor_shape.helix_select` | string                          | `"inherit"` |
| `cursor_shape.helix_insert` | string                          | `"inherit"` |
| `show_hints`                | bool                            | `true`      |
| `hinter.closure`            | closure or `null`               | `null`      |
| `status_line.enable`        | bool                            | `true`      |
| `status_line.errors`        | bool                            | `true`      |
| `status_line.signature`     | bool                            | `true`      |
| `status_line.type`          | bool                            | `true`      |
| `status_line.preview`       | bool                            | `true`      |

- `edit_mode` is `"emacs"`, `"vi"`, or `"helix"`. See [Setting the Editing Mode](./line_editor.md#setting-the-editing-mode).
- Each `cursor_shape` entry is one of `"block"`, `"underscore"`, `"line"`, `"blink_block"`, `"blink_underscore"`, `"blink_line"`, or `"inherit"`, which leaves the terminal's cursor alone. `vi_visual: "inherit"` uses the `vi_normal` shape.
- `show_hints` and `hinter.closure` control the gray suggestion after the cursor. See [Hints](./line_editor.md#hints).
- `status_line` controls the line under the one you are editing. See [Status Line](./line_editor.md#status-line).

### `buffer_editor`

The editor that <kbd>Ctrl</kbd>+<kbd>O</kbd> opens to edit the current command line, and that [`config nu`](/commands/docs/config_nu.md) and [`config env`](/commands/docs/config_env.md) open. When it is `null`, an empty string, or an empty list, Nushell uses `$env.VISUAL`, and when that isn't set either, `$env.EDITOR`. With none of them set, those commands fail with `No editor configured`.

A string is the name of the program and nothing else. `"code --wait"` makes Nushell look for a program named `code --wait`, and fail. To pass arguments, use a list:

```nu
$env.config.buffer_editor = ["code", "--wait"]
```

An argument can contain the placeholders `{file}`, `{line}`, and `{col}`. Nushell replaces them with the path of the file to edit and a line and column, both counted from 1. For <kbd>Ctrl</kbd>+<kbd>O</kbd>, the line and column are where the cursor is in the command line; `config nu` and `config env` use line 1, column 1. Nushell adds the file path as the last argument unless an argument contains `{file}` or is the file path itself.

```nu
$env.config.buffer_editor = ["hx", "{file}:{line}:{col}"]
$env.config.buffer_editor = ["vim", "+{line}"]   # the file path is appended
```

## Completions

| Setting                            | Type                    | Default    |
| ---------------------------------- | ----------------------- | ---------- |
| `completions.algorithm`            | string                  | `"prefix"` |
| `completions.sort`                 | string                  | `"smart"`  |
| `completions.case_sensitive`       | bool                    | `false`    |
| `completions.quick`                | bool                    | `true`     |
| `completions.partial`              | bool                    | `true`     |
| `completions.persistent_menus`     | bool                    | `false`    |
| `completions.use_ls_colors`        | bool                    | `true`     |
| `completions.cache_size`           | int                     | `100`      |
| `completions.external.enable`      | bool                    | `true`     |
| `completions.external.max_results` | int                     | `100`      |
| `completions.external.completer`   | closure, record, `null` | `null`     |

- `algorithm` is `"prefix"` (match from the start), `"substring"` (match anywhere), or `"fuzzy"`.
- `sort` is `"smart"` or `"alphabetical"`. `"smart"` sorts alphabetically for `prefix` and `substring`, and by match score for `fuzzy`.
- `quick: true` fills in the only remaining suggestion without opening a menu.
- `partial: true` fills in the part that all suggestions share. With `apple`, `apricot`, and `apron` in a directory, <kbd>Tab</kbd> after `ls a` fills in `ap`.
- `persistent_menus: true` keeps a menu open while you delete text or empty the line, refiltering it instead. The menu closes on <kbd>Esc</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd>, or when you accept a value. This applies to the history menu too.
- `use_ls_colors` colors file and directory suggestions with `LS_COLORS`.
- `external.enable: false` stops Nushell from searching `PATH` for command names, which helps when `PATH` includes slow file systems. `external.max_results` limits how many it collects.
- `external.completer` is a closure that completes arguments of external commands. See [External Completions](./custom_completions.md#external-completions).

### `completions.cache_size`

Nushell remembers the suggestions it computed for the text up to the cursor, such as `ls ap`, and reuses them the next time you complete the same text, instead of reading the directory or the list of commands again. `cache_size` is how many of these it keeps. When the cache is full, the one used least recently is dropped. `0` turns the cache off, so every completion is computed again.

The cache lasts from one prompt to the next. Nushell empties it when anything that could change the answers changes:

- the current directory, or the files in it
- `PATH`
- the set of commands, for example after you define or import one
- `$env.config`

Answers from [custom completers](./custom_completions.md) and from `completions.external.completer` are cached the same way. A completer that lists data that changes on its own, such as Git branches, can therefore show an old list until one of the changes above happens. A completer that runs an `@interactive` command is never cached. See [Interactive Completers](./custom_completions.md#interactive-completers).

## Terminal integration

| Setting                                    | Type             | Default                    |
| ------------------------------------------ | ---------------- | -------------------------- |
| `use_kitty_protocol`                       | bool             | `false`                    |
| `shell_integration.osc2`                   | bool             | `true`                     |
| `shell_integration.osc7`                   | bool             | `true`, `false` on Windows |
| `shell_integration.osc8`                   | bool             | `true`                     |
| `shell_integration.osc9_9`                 | bool             | `false`, `true` on Windows |
| `shell_integration.osc133`                 | bool             | `true`                     |
| `shell_integration.osc633`                 | bool             | `true`                     |
| `shell_integration.reset_application_mode` | bool             | `true`                     |
| `bracketed_paste`                          | bool             | `true`                     |
| `use_ansi_coloring`                        | bool or `"auto"` | `"auto"`                   |

Each of these makes Nushell send escape sequences that the terminal has to understand. Turn off the ones your terminal doesn't support.

- `use_kitty_protocol` turns on the Kitty keyboard protocol, which lets the terminal report keys that otherwise look the same, such as <kbd>Ctrl</kbd>+<kbd>I</kbd> and <kbd>Tab</kbd>.
- `osc2` sets the window or tab title to the current directory and the running command.
- `osc7` tells the terminal the current directory, so a new tab or window can open there. `osc9_9` does the same for ConEmu and Windows Terminal.
- `osc8` makes file names in [`ls`](/commands/docs/ls.md) output clickable. See [`ls.clickable_links`](#ls).
- `osc133` marks where prompts, commands, and their output start and end, and reports exit codes, for terminals that can jump between prompts or select a command's output. `osc633` sends the VS Code variant of the same marks.
- `reset_application_mode` sends `ESC[?1l` after each command, which keeps the arrow keys working after an SSH session to a host that changed the cursor key mode.
- `bracketed_paste` lets you paste several lines without running each one as it arrives. It isn't supported on Windows.

### `use_ansi_coloring`

`true` always colors output and `false` never does. `"auto"` checks these in order and uses the first that applies:

1. `FORCE_COLOR` set to anything other than `0`, `false`, or an empty string turns colors on.
2. `NO_COLOR` set the same way turns them off.
3. `CLICOLOR` turns them off when it is `0`, `false`, or empty, and on when it has any other value.
4. `TERM` set to `dumb` turns them off.
5. Otherwise, Nushell colors output when its standard output is a terminal.

Without colors, error messages are drawn with plain ASCII characters instead of line-drawing ones. The [`ansi`](/commands/docs/ansi.md) command ignores this setting.

[`config use-colors`](/commands/docs/config_use-colors.md) runs this check and returns the answer as a `bool`. Use it in your own commands instead of reading `$env.config.use_ansi_coloring`, which may hold `"auto"`:

```nu
def warn [msg: string] {
    if (config use-colors) { print $"(ansi yellow)($msg)(ansi reset)" } else { print $msg }
}
```

A change to `$env.config.use_ansi_coloring` counts right away. The environment variables are read from the session's global environment, though, not from the current scope. A change to `FORCE_COLOR`, `NO_COLOR`, `CLICOLOR`, or `TERM` made in `config.nu` or `env.nu` counts. One made at the prompt counts from the next command line on. One made inside a script, with `nu -c`, or with [`with-env`](/commands/docs/with-env.md) doesn't change the answer. The terminal check looks at Nushell's own standard output, so `config use-colors` gives the same answer whether or not its result is piped.

## Errors

| Setting                             | Type   | Default   |
| ----------------------------------- | ------ | --------- |
| `error_style`                       | string | `"fancy"` |
| `error_lines`                       | int    | `1`       |
| `display_errors.exit_code`          | bool   | `false`   |
| `display_errors.termination_signal` | bool   | `true`    |

### `error_style`

- `"fancy"` draws the source code around the error and points at the problem with line-drawing characters.
- `"nested"` is like `"fancy"`, and shows related errors nested under the main one.
- `"plain"` describes the error and its location in plain sentences, which works better with screen readers.
- `"short"` prints the error on one line.

`nu --error-style` sets the style for a `nu -c` run, and takes `fancy`, `plain`, or `short`. For scripts and the REPL, set `error_style` in your configuration.

### `error_lines`

How many lines of source code `"fancy"` and `"nested"` errors show above and below the line with the error. `0` shows only that line. The value must be `0` or more. `"plain"` errors always show one line of context, and `"short"` errors show none.

### `display_errors`

`exit_code: true` makes Nushell print an error when an external command exits with a non-zero code. With `false`, you see only what the command itself printed. Either way, the failure stops the rest of the pipeline and script. A core dump is always reported, and `SIGPIPE` is never treated as an error.

`termination_signal: true` makes Nushell print an error when a signal ends an external command.

## Tables

| Setting                       | Type          | Default                                                    |
| ----------------------------- | ------------- | ---------------------------------------------------------- |
| `table.mode`                  | string        | `"rounded"`                                                |
| `table.index_mode`            | string        | `"always"`                                                 |
| `table.show_empty`            | bool          | `true`                                                     |
| `table.padding`               | record or int | `{left: 1, right: 1}`                                      |
| `table.trim`                  | record        | `{methodology: "wrapping", wrapping_try_keep_words: true}` |
| `table.header_on_separator`   | bool          | `false`                                                    |
| `table.abbreviated_row_count` | int or `null` | `null`                                                     |
| `table.footer_inheritance`    | bool          | `false`                                                    |
| `table.missing_value_symbol`  | string        | a cross mark (U+274E)                                      |
| `table.batch_duration`        | duration      | `1sec`                                                     |
| `table.stream_page_size`      | int           | `1000`                                                     |
| `footer_mode`                 | string or int | `25`                                                       |

`table.mode` sets the border style. [Table Borders](./coloring_and_theming.md#table-borders) shows the styles, and `table --list` lists their names. `nu --table-mode` (`-m`) overrides it for one run, and `table --theme` for one table.

### `table.index_mode`

- `"always"` shows the `#` column.
- `"never"` hides it.
- `"auto"` shows it only for data that has a column named `index`.

When the data has an `index` column and the `#` column is shown, the `#` column shows that column's values instead of row numbers. With `"never"`, `index` is an ordinary column.

```nu
$env.config.table.index_mode = "auto"
[[name size]; [a 1] [b 2]]
# => ╭──────┬──────╮
# => │ name │ size │
# => ├──────┼──────┤
# => │ a    │    1 │
# => │ b    │    2 │
# => ╰──────┴──────╯
[[index name]; [x a] [y b]]
# => ╭───┬──────╮
# => │ # │ name │
# => ├───┼──────┤
# => │ x │ a    │
# => │ y │ b    │
# => ╰───┴──────╯
```

[`table --index false`](/commands/docs/table.md) hides the column for one table, and `table --index 1` numbers the rows from 1. Neither brings the column back when `index_mode` hides it.

### `table.show_empty`

With `true`, an empty list prints as a small table that reads `empty list`, and an empty record as one that reads `empty record`. With `false`, they print nothing. Empty lists and records inside a table are always shown as `[list 0 items]` and `{record 0 fields}`.

### `table.padding`

The number of spaces between a cell's border and its text, on the left and on the right. Each must be `0` or more. An int sets both sides at once:

```nu
$env.config.table.padding = 0
[[name size]; [a 1] [b 2]]
# => ╭─┬────┬────╮
# => │#│name│size│
# => ├─┼────┼────┤
# => │0│a   │   1│
# => │1│b   │   2│
# => ╰─┴────┴────╯
```

Reading the setting back always gives a record, such as `{left: 0, right: 0}`.

### `table.trim`

What Nushell does with a table that is wider than the terminal. The record must have a `methodology` key, which is `"wrapping"` or `"truncating"`:

- `{methodology: "wrapping", wrapping_try_keep_words: true}` wraps text that doesn't fit onto more lines. With `wrapping_try_keep_words: true`, it breaks lines between words where it can; with `false`, it breaks them anywhere.
- `{methodology: "truncating", truncating_suffix: "..."}` keeps each row on one line and cuts text that doesn't fit, ending it with `truncating_suffix`. Without a suffix, or with `null`, the text is cut with no marker.

Each method ignores the other's key. If you switch methods without giving the key, `wrapping_try_keep_words` becomes `false`, and `truncating_suffix` becomes empty.

```nu
let row = [[name description]; [alpha "the quick brown fox jumps over the lazy dog"]]
$row | table --width 40
# => ╭───┬───────┬──────────────────────────╮
# => │ # │ name  │       description        │
# => ├───┼───────┼──────────────────────────┤
# => │ 0 │ alpha │ the quick brown fox      │
# => │   │       │ jumps over the lazy dog  │
# => ╰───┴───────┴──────────────────────────╯
$env.config.table.trim = {methodology: "truncating", truncating_suffix: "..."}
$row | table --width 40
# => ╭───┬───────┬──────────────────────────╮
# => │ # │ name  │       description        │
# => ├───┼───────┼──────────────────────────┤
# => │ 0 │ alpha │ the quick brown fox j... │
# => ╰───┴───────┴──────────────────────────╯
```

When the columns don't fit even after shrinking, Nushell shows as many as it can, each at least 10 characters wide or as wide as its contents if that is less, and replaces the rest with a single column of `...`. That marker is not `truncating_suffix`:

```nu
[{name: alpha, size: 1234, owner: someone, modified: "2024-01-01", note: "long text here"}] | table --width 40
# => ╭───┬───────┬──────┬─────────┬─────╮
# => │ # │ name  │ size │  owner  │ ... │
# => ├───┼───────┼──────┼─────────┼─────┤
# => │ 0 │ alpha │ 1234 │ someone │ ... │
# => ╰───┴───────┴──────┴─────────┴─────╯
```

### `table.header_on_separator`

With `true`, the column names are drawn in the top border, and in the bottom border when there is a footer:

```nu
$env.config.table.header_on_separator = true
[[name size]; [a 1] [b 2]]
# => ╭─#─┬─name─┬─size─╮
# => │ 0 │ a    │    1 │
# => │ 1 │ b    │    2 │
# => ╰───┴──────┴──────╯
```

A column is always at least as wide as its name. If a column name contains a character that isn't one column wide, such as a CJK character, an emoji, or a newline, the names go back to their own row. The `markdown` and `restructured` modes always keep the names in their own row, so the output stays valid markup.

### `table.abbreviated_row_count`

With an int `n`, a list or table longer than that shows its first `n` and last `n` rows, with a row of `...` between them. The `#` column numbers the rows that are shown, so it doesn't match their positions in the data. A record with more than `2n + 1` fields is shortened the same way. `null` shows every row.

```nu
$env.config.table.abbreviated_row_count = 2
1..10
# => ╭───┬─────╮
# => │ 0 │   1 │
# => │ 1 │   2 │
# => │ 2 │ ... │
# => │ 3 │   9 │
# => │ 4 │  10 │
# => ╰───┴─────╯
```

[`table --abbreviated`](/commands/docs/table.md) (`-a`) sets the count for one table. While abbreviation is on, Nushell reads the whole stream before it prints anything, so `batch_duration` and `stream_page_size` don't apply, and an endless stream prints nothing.

### `footer_mode` and `table.footer_inheritance`

A footer repeats the column names below the last row. `footer_mode` decides when a table gets one:

- `"always"` and `"never"` do what they say.
- An int `n`, such as the default `25`, adds a footer when the table has `n` rows or more.
- `"auto"` adds a footer when the table has at least as many rows as the terminal has lines, so that its header would scroll out of sight.

`table.footer_inheritance` matters for nested tables, as drawn by [`table --expand`](/commands/docs/table.md) and by the default display at 100 or more terminal columns. With `false`, each table counts only its own rows. With `true`, a table counts the rows of the tables nested in it too, so a short outer table around a long inner one gets a footer as well.

### `table.missing_value_symbol`

What a table shows in a cell when the row has no value for that column. The default is the cross-mark emoji U+274E. Its color comes from `color_config.empty`. A `null` value is different, and shows as an empty cell.

```nu
$env.config.table.missing_value_symbol = "-"
[{name: a, size: 1} {name: b}]
# => ╭───┬──────┬──────╮
# => │ # │ name │ size │
# => ├───┼──────┼──────┤
# => │ 0 │ a    │    1 │
# => │ 1 │ b    │  -   │
# => ╰───┴──────┴──────╯
```

### `table.batch_duration` and `table.stream_page_size`

Nushell prints a list in batches, as separate tables, so that the rows of a slow stream show up before the stream ends. A batch ends when it has `stream_page_size` rows or when `batch_duration` has passed since it started, whichever comes first. `stream_page_size` must be between 1 and 65535.

A list that is already complete is split by `stream_page_size` too. With the default, a list of 1500 rows prints as one table of 1000 rows and one of 500, which may have different column widths. [`collect`](/commands/docs/collect.md) doesn't change this.

```nu
$env.config.table.stream_page_size = 2
1..5
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => ╰───┴───╯
# => ╭───┬───╮
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => ╰───┴───╯
# => ╭───┬───╮
# => │ 4 │ 5 │
# => ╰───┴───╯
```

## Dates, file sizes, and numbers

| Setting                  | Type             | Default    |
| ------------------------ | ---------------- | ---------- |
| `datetime_format.normal` | string or `null` | `null`     |
| `datetime_format.table`  | string or `null` | `null`     |
| `filesize.unit`          | string           | `"metric"` |
| `filesize.show_unit`     | bool             | `true`     |
| `filesize.precision`     | int or `null`    | `1`        |
| `duration_max_unit`      | string           | `"wk"`     |
| `float_precision`        | int              | `2`        |

### `datetime_format`

`normal` formats a date printed on its own and a date in string interpolation. `table` formats dates inside tables, lists, and records. Each one is a format string as used by [`format date`](/commands/docs/format_date.md); `format date --list` lists the specifiers. A format string Nushell can't use prints as `Invalid format string` followed by the string.

With `null`, a date on its own prints as an RFC 2822 date followed by how long ago it was, such as `Tue, 2 Jan 2024 03:04:05 +0000 (2 years ago)`, and a date in a table prints only the relative part, such as `2 years ago`.

```nu
$env.config.datetime_format.normal = "%Y-%m-%d %H:%M"
2024-01-02T03:04:05Z
# => 2024-01-02 03:04
$env.config.datetime_format.table = "%Y-%m-%d"
[2024-01-02T03:04:05Z]
# => ╭───┬────────────╮
# => │ 0 │ 2024-01-02 │
# => ╰───┴────────────╯
```

[`into string`](/commands/docs/into_string.md) and [`format date`](/commands/docs/format_date.md) don't use these settings.

### `filesize`

`filesize.unit` is `"metric"` (the default), `"binary"`, or a fixed unit. `"metric"` picks a unit for each value in powers of 1000 (kB, MB, GB), and `"binary"` in powers of 1024 (KiB, MiB, GiB). A fixed unit shows every value in that unit, and is one of `"B"`, `"kB"`, `"MB"`, `"GB"`, `"TB"`, `"PB"`, `"EB"`, `"KiB"`, `"MiB"`, `"GiB"`, `"TiB"`, `"PiB"`, or `"EiB"`. The names are case-sensitive.

`filesize.precision` is the number of decimal places. Extra digits are cut off, not rounded, so 1,999,999 bytes shows as `1.9 MB`. A value in bytes never has decimals. `null` shows every significant digit. The value can't be negative.

`filesize.show_unit: false` leaves the unit off. Use it with a fixed unit, since with `"metric"` or `"binary"` the numbers no longer say which unit they are in.

```nu
[1_999_999b 1_000b 500b]
# => ╭───┬────────╮
# => │ 0 │ 1.9 MB │
# => │ 1 │ 1.0 kB │
# => │ 2 │  500 B │
# => ╰───┴────────╯
$env.config.filesize.precision = null
[1_999_999b 1_000b 500b]
# => ╭───┬─────────────╮
# => │ 0 │ 1.999999 MB │
# => │ 1 │        1 kB │
# => │ 2 │       500 B │
# => ╰───┴─────────────╯
$env.config.filesize = {unit: "kB", show_unit: false, precision: 1}
[1_999_999b 1_000b 500b]
# => ╭───┬─────────╮
# => │ 0 │ 1,999.9 │
# => │ 1 │     1.0 │
# => │ 2 │     0.5 │
# => ╰───┴─────────╯
```

### `duration_max_unit`

The largest unit used to print a duration. Nushell splits a duration into units from this one down. The values are `"wk"`, `"day"`, `"hr"`, `"min"`, `"sec"`, `"ms"`, `"us"` (also written `"µs"`), and `"ns"`.

```nu
365day
# => 52wk 1day
$env.config.duration_max_unit = "day"
[365day 90min]
# => ╭───┬───────────╮
# => │ 0 │    365day │
# => │ 1 │ 1hr 30min │
# => ╰───┴───────────╯
```

[`into string`](/commands/docs/into_string.md) uses this setting too.

### `float_precision`

The number of decimal places for floats in tables, lists, and records. Nushell rounds to it and pads with zeros. A float printed on its own shows all its digits.

```nu
[3.14159 2.0]
# => ╭───┬──────╮
# => │ 0 │ 3.14 │
# => │ 1 │ 2.00 │
# => ╰───┴──────╯
3.14159
# => 3.14159
```

## `ls`

| Setting              | Type | Default |
| -------------------- | ---- | ------- |
| `ls.use_ls_colors`   | bool | `true`  |
| `ls.clickable_links` | bool | `true`  |

`ls.use_ls_colors` colors file names in [`ls`](/commands/docs/ls.md) output with the `LS_COLORS` environment variable. With `false`, Nushell doesn't use `LS_COLORS` for them. See [`LS_COLORS` Colors for the `ls` Command](./coloring_and_theming.md#ls-colors-colors-for-the-ls-command).

`ls.clickable_links` makes each file name in `ls` output an OSC 8 hyperlink to the file, which terminals that support OSC 8 let you click. Nushell only adds the links when all of these hold:

- `ls.clickable_links` and `shell_integration.osc8` are both `true`.
- `ls.use_ls_colors` is `true` and the output is colored (see [`use_ansi_coloring`](#use-ansi-coloring)).
- The `SSH_CLIENT` environment variable isn't set. Nushell leaves the links out in SSH sessions, where they wouldn't work.
- The file exists.

## Prompt and highlighting

| Setting                            | Type   | Default            |
| ---------------------------------- | ------ | ------------------ |
| `render_right_prompt_on_last_line` | bool   | `false`            |
| `highlight_resolved_externals`     | bool   | `false`            |
| `color_config`                     | record | the built-in theme |

`render_right_prompt_on_last_line: true` draws the right prompt on the last line of a multi-line left prompt instead of the first. See [Prompt Configuration and Coloring](./coloring_and_theming.md#prompt-configuration-and-coloring).

`highlight_resolved_externals: true` colors an external command name at the prompt with `color_config.shape_external_resolved` (default `light_yellow_bold`) when Nushell finds the command on `PATH`, so you can tell a typo before you press <kbd>Enter</kbd>. With `false`, every external command name gets `shape_external`. The setting is off by default because looking up names on `PATH` while you type can slow highlighting down.

`color_config` sets the colors of output values, syntax highlighting, and parts of the interface. It is a free-form record, so assigning a whole record replaces all of it; change single entries instead, as in `$env.config.color_config.string = "red"`. See [Coloring and Theming](./coloring_and_theming.md).

## Hooks, keybindings, menus, and abbreviations

| Setting                   | Type                    | Default                                                       | Documentation                                        |
| ------------------------- | ----------------------- | ------------------------------------------------------------- | ---------------------------------------------------- |
| `hooks.pre_prompt`        | list                    | `[]`                                                          | [Hooks](./hooks.md)                                  |
| `hooks.pre_execution`     | list                    | `[]`                                                          | [Hooks](./hooks.md)                                  |
| `hooks.env_change`        | record                  | `{}`                                                          | [Hooks](./hooks.md#changing-environment)             |
| `hooks.display_output`    | string, closure, `null` | `"if (term size).columns >= 100 { table -e } else { table }"` | [Hooks](./hooks.md#changing-how-output-is-displayed) |
| `hooks.command_not_found` | closure or `null`       | `null`                                                        | [Hooks](./hooks.md)                                  |
| `keybindings`             | list                    | Nushell's menu keybindings                                    | [Keybindings](./line_editor.md#keybindings)          |
| `menus`                   | list                    | the completion, IDE completion, history, and help menus       | [Menus](./line_editor.md#menus)                      |
| `abbreviations`           | record                  | `{}`                                                          | [Abbreviations](./line_editor.md#abbreviations)      |

`keybindings`, `menus`, the hook lists, `hooks.env_change`, and `abbreviations` are replaced whole when you assign them. Add to them with `++=` or [`merge`](/commands/docs/merge.md), as those pages show, to keep the entries already there.

## Plugins

| Setting                        | Type     | Default |
| ------------------------------ | -------- | ------- |
| `plugins`                      | record   | `{}`    |
| `plugin_gc.default.enabled`    | bool     | `true`  |
| `plugin_gc.default.stop_after` | duration | `10sec` |
| `plugin_gc.plugins`            | record   | `{}`    |

`plugins` holds settings for each plugin, under the plugin's name (see [Plugin configuration](./plugins.md#plugin-configuration)). Assigning a whole record to it replaces the settings of every plugin. `plugin_gc` decides when Nushell stops plugins that have been idle. See [Plugin Garbage Collector](./plugins.md#plugin-garbage-collector).

## `explore` and `tui`

`explore` holds the colors of the [`explore`](/commands/docs/explore.md) viewer, and `tui` holds the colors and the `border_type` of the [`tui`](./tui.md) commands. Both are free-form, so assigning a whole record replaces it. See [`explore` Config](./explore.md#config) and [Theming the `tui` commands](./tui.md#theming).
