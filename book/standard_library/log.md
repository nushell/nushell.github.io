# `std/log`

The `std/log` module writes log messages to stderr, each with a level, so a script can report what it is doing without mixing the messages into its output. Import it without a glob:

```nu
use std/log
```

[[toc]]

## Logging a message

There is one command for each of the five levels: `log debug`, `log info`, `log warning`, `log error` and `log critical`. Each takes the message as a string and prints one line to stderr, but only when its level is at or above the [current level](#choosing-which-messages-appear):

```nu
log warning "low disk space" --context {free: 2GB}
# => 2026-11-14T17:01:05.849|WRN|low disk space free="2.0 GB"
```

Because the line goes to stderr, it stays out of the pipeline and out of a file redirected with `o>`. See [`echo`, `print`, and `log` commands](../stdout_stderr_exit_codes.md#echo-print-and-log-commands).

The five commands take the same flags:

- `--short` (`-s`) uses the one-letter prefix, such as `W`, instead of `WRN`.
- `--format` (`-f`) takes a [format](#log-line-format) for this one line.
- `--context` (`-c`) takes a record, which is added to the line as `key="value"` pairs, as in the example above.

`log` by itself does nothing. `help log` shows the list of format placeholders.

## Choosing which messages appear

`$env.NU_LOG_LEVEL` sets the lowest level that is printed. When it isn't set, the level is `INFO`, so `log debug` prints nothing. The variable takes a level's number or its name:

| Level    | Number | Names accepted in `NU_LOG_LEVEL` |
| -------- | ------ | -------------------------------- |
| CRITICAL | 50     | `CRITICAL`, `CRIT`, `CRT`, `C`   |
| ERROR    | 40     | `ERROR`, `ERR`, `E`              |
| WARNING  | 30     | `WARNING`, `WARN`, `WRN`, `W`    |
| INFO     | 20     | `INFO`, `INF`, `I`               |
| DEBUG    | 10     | `DEBUG`, `DBG`, `D`              |

Names are case-insensitive. A name that isn't in the table, such as `"VERBOSE"` or a misspelled one, counts as `INFO`, without an error. A number doesn't have to be one of the five. With `25`, only warnings and above are printed. With `"err"`, only errors and critical messages are:

```nu
$env.NU_LOG_LEVEL = "err"
log warning "hidden"
log error "shown"
# => 2026-11-14T17:01:05.896|ERR|shown
```

`log set-level` sets the variable from a number. It stores the number as a string, so programs started from the shell, including other `nu` processes running your scripts, inherit the level. As you type its argument, the completions offer the five numbers, each described by its level's name:

```nu
log set-level (log log-level).DEBUG
log debug "shown"
# => 2026-11-14T17:01:05.872|DBG|shown
```

## Log line format

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

The template can contain any of these placeholders, in any order, as often as you like. All of them are optional, so even an empty template is valid:

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

Because these are environment variables, scripts you start from the shell, such as `nu build.nu`, inherit them and log in the same format. If a module of yours imports `std/log` and the variables aren't set, the commands use the default formats shown above.

### Colors in log lines

The color codes are part of the line whether or not stderr is a terminal, so a log saved to a file (`nu build.nu 2> build.log` in another shell) contains them as well. Leave `%ANSI_START%` and `%ANSI_STOP%` out of the template to get plain lines.

## Levels, prefixes and colors

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

These lookups let you name a level instead of hard-coding its number or prefix, as in the `log set-level (log log-level).DEBUG` example above.

## Custom levels with `log custom`

`log custom` takes a message, a template and a level number, in that order. The template works like `NU_LOG_FORMAT`, which `log custom` doesn't read. The level decides whether the message is printed, the same way as for the other commands, and if it is below the current level, `log custom` returns without doing anything. `--context` has no short form here.

`log custom` works out the `%LEVEL%` prefix and the `%ANSI_START%` color for itself only when the level is one of the five numbers in `log log-level`. For any other number it needs both `--level-prefix` (`-p`) and `--ansi` (`-a`), even if the template uses neither placeholder. Leave one out and it fails, naming what it couldn't work out:

```nu
log custom "disk check" "%LEVEL%|%MSG%" 25 --level-prefix NOTE
# => Error: nu::shell::error
# =>
# =>   × Cannot deduce ansi for given log level: 25.
# =>    ╭─[repl_entry #1:1:41]
# =>  1 │ log custom "disk check" "%LEVEL%|%MSG%" 25 --level-prefix NOTE
# =>    ·                                         ─┬
# =>    ·                                          ╰─┤ Invalid log level.
# =>    ·                                            │         Available log levels in log-level:
# =>    ·                                            │             CRITICAL: 50
# =>    ·                                            │             ERROR: 40
# =>    ·                                            │             WARNING: 30
# =>    ·                                            │             INFO: 20
# =>    ·                                            │             DEBUG: 10
# =>    ·                                            │
# =>    ╰────
```

Without `--level-prefix`, the message is `Cannot deduce log level prefix for given log level: 25.` instead. A color can come from an existing level:

```nu
log custom "retrying request" "%ANSI_START%%LEVEL% %MSG%%ANSI_STOP%" 25 --level-prefix NOTE --ansi (log log-ansi).WARNING
# => NOTE retrying request
```
