# Working with the Terminal

Most Nushell commands work on data and leave the drawing to the display. The commands on this page deal with the terminal itself. They measure it, ask it questions, read what the user types, clear it, and produce text meant for it: grids, hyperlinks, and shorter escape sequences. To find out whether output is going to a terminal at all, see [Checking for a Terminal](./stdout_stderr_exit_codes.md#checking-for-a-terminal). Colors are covered in [Coloring Strings](./working_with_strings.md#coloring-strings) and [Coloring and Theming](./coloring_and_theming.md). For information about the machine rather than the terminal, such as the `sys` commands, see the [System cookbook](/cookbook/system.md).

## The size of the terminal

[`term size`](/commands/docs/term_size.md) returns the width of the terminal in `columns` and its height in `rows`. The parent command, [`term`](/commands/docs/term.md), only prints the help for `term size` and `term query`.

```nu
term size
# => ╭─────────┬─────╮
# => │ columns │ 120 │
# => │ rows    │ 50  │
# => ╰─────────┴─────╯
```

On Linux and macOS, `term size` asks the controlling terminal, so it gives the right answer even when Nushell's output goes into a pipe or a file. With no terminal at all, as in a cron job, it uses [`COLUMNS` and `LINES`](./special_variables.md#env-columns-and-env-lines) from the environment Nushell started with, or 80 by 24 unless both are set. A pseudo-terminal that was never given a size reports 0 by 0, and `term size` passes that on. On Windows, it returns 0 by 0 when Nushell has no console.

`table`, `grid`, and `help` wrap their output to this width, and the default [`display_output` hook](./hooks.md#changing-how-output-is-displayed) checks `(term size).columns` to decide whether to expand nested tables.

## Asking the terminal a question

Terminals answer some escape sequences by typing a reply back, as if it came from the keyboard. Examples are the cursor position, the background color, and, in terminals that allow it, the clipboard. [`term query`](/commands/docs/term_query.md) writes such a query and reads the reply from standard input. While it reads, it puts the terminal in raw mode, so the reply isn't echoed, and it throws away any key presses that were waiting before it sent the query. [`std/clip`](./standard_library/clip.md) uses it to paste from the clipboard.

The query is a string or binary, and the reply comes back as binary, since it can contain any bytes. Use [`decode`](/commands/docs/decode.md) to turn it into a string. `--prefix` (`-p`) and `--terminator` (`-t`) describe the shape of the reply. The prefix is checked byte by byte and removed, and reading stops at the terminator, which is removed too. `--keep` (`-k`) leaves both in the result. Here the terminal reports the cursor in row 12, column 40:

```nu
term query (ansi cursor_position) --prefix (ansi csi) --terminator R | decode | split row ';' | into int | {row: $in.0, column: $in.1}
# => ╭────────┬────╮
# => │ row    │ 12 │
# => │ column │ 40 │
# => ╰────────┴────╯
```

A few things can go wrong:

- A terminal that doesn't understand the query never replies, and `term query` keeps waiting. Press Ctrl+C. With a `--terminator`, that's an "Operation interrupted" error. Without one, `term query` always reads until Ctrl+C and returns everything it read, with no error.
- When the reply doesn't start with the `--prefix`, the error is "Input did not begin with expected sequence". Run the query without `--prefix` to see what the terminal sent.
- A custom completer can't read from the terminal, and `term query` there fails with "Interactive input is unavailable in this context". With no terminal at all, as in a cron job or an [MCP server](./mcp.md), which detaches from the terminal on Unix, it fails with an I/O error.

## Reading what the user types

[`input`](/commands/docs/input.md) shows an optional prompt, reads what the user types until Enter, and returns it as a string. Backspace deletes the last character. Ctrl+C stops `input` with an "Operation interrupted" error, and other Ctrl and Alt key combinations are ignored.

```nu
let name = input "Name: "
```

These flags change how it reads:

- `--suppress-output` (`-s`) doesn't show what the user types, for a password or a token.
- `--numchar` (`-n`) stops after that many bytes, without waiting for Enter, so `input -n 1` reads a single ASCII key. The number has to be at least 1. Combine it with `-s` to read a key without showing it.
- `--bytes-until-any` (`-u`) also stops at the first character that appears in the string you give it, and leaves that character out. After `input -u ",;"`, typing `ab,` returns `ab`. Enter still ends the input, and the result is a string. Use ASCII characters for the stop list.
- `--default` (`-d`) is the value returned when the user presses Enter without typing anything. With a prompt, `input` shows it after the prompt, as in `Name:  (default: guest)`.

`--reedline` reads the line with the same line editor as the Nushell prompt, so the user can move the cursor and edit the text. In this mode, a list of strings piped into `input` becomes a history that the Up arrow steps through, `--default` fills in the line ready to edit, and Ctrl+D returns `null`. `-s`, `-n` and `-u` have no effect.

```nu
[red green blue] | input --reedline "Color: "
```

`--history-file` keeps that history in a text file, one entry per line. `input` reads it at the start and saves the new line, and the strings piped in, to it. The file is created if it doesn't exist. `--max-history` sets how many entries the history holds, 1000 by default, and the file is cut down to that many. Each of the two flags turns on `--reedline` by itself.

Without a terminal, as in a cron job or an [MCP server](./mcp.md), which detaches from the terminal on Unix, `input` fails with an I/O error (`nu::shell::io::uncategorized_error`). In a [custom completer](./custom_completions.md), it fails with "Interactive input is unavailable in this context". To let the user pick from a list, use [`input list`](/commands/docs/input_list.md) (see [Select Lists](./tui.md#select-lists)), and to read single key presses with their modifiers, use [`input listen`](/commands/docs/input_listen.md).

## Clearing the screen

[`clear`](/commands/docs/clear.md) moves the cursor to the top left corner and clears the screen. It also clears the terminal's scrollback, so you can't scroll up to the earlier output. `--keep-scrollback` (`-k`) leaves the scrollback alone.

`clear` doesn't return anything. It writes its escape sequences straight to Nushell's standard output, so `clear | ignore` and `let x = (clear)` still clear the screen, and when a script's output is redirected to a file, the sequences end up in the file.

## Laying out lists in a grid

[`grid`](/commands/docs/grid.md) lays out a list in columns, the way `ls` does in other shells. Items run top to bottom, then left to right. The grid uses the width from `term size` unless you set `--width` (`-w`), and `--separator` (`-s`) replaces the default separator, `│` with a space on each side:

```nu
seq 1 12 | grid --width 30
# => 1 │ 3 │ 5 │ 7 │ 9  │ 11
# => 2 │ 4 │ 6 │ 8 │ 10 │ 12
[a b c d e f g h i j k l] | grid --width 20 --separator "  "
# => a  c  e  g  i  k
# => b  d  f  h  j  l
```

The result is a single string that ends in a line feed, so you can save it, or trim the line feed with `str trim` as the `lsg` command in [Aliases](./aliases.md) does. When an item is wider than the grid, `grid` fails with an error such as "Couldn't fit grid into 10 columns".

For a list of records, `grid` shows the `name` column, so `ls | grid` lists the file names. A record without a `name` column is shown whole, as `{a: 1, b: 2}`. Pass a column name or cell path to show something else, as in `grid size`. Then every record needs that column, or `grid` fails with "Cannot find column". Other values are turned into text, so a nested list shows as `[1, 2]`. The input has to be a list. A range fails with "Command does not support range input", or with "Input type not supported" when Nushell finds out only at run time, and a single string fails the same way, so turn a range into a list first, as `seq 1 12` does above.

`--color` (`-c`) colors each item the way `ls` colors file names, using [`LS_COLORS`](./coloring_and_theming.md#ls-colors-colors-for-the-ls-command). It treats each item as a path relative to the current directory, and it does nothing when [colors are turned off](./coloring_and_theming.md#turning-colors-on-and-off). `--icons` (`-i`) puts a file-type icon in front of each item, which needs a [Nerd Font](https://www.nerdfonts.com/) in the terminal.

## Hyperlinks

[`ansi link`](/commands/docs/ansi_link.md) wraps text in an OSC 8 escape sequence, which most current terminals show as a clickable link. The input string is the link target, and the visible text is the target itself, or the `--text` (`-t`) you give. A terminal without OSC 8 support shows only the text.

```nu
"https://www.nushell.sh" | ansi link --text Nushell | str replace --all "\e" '\e'
# => \e]8;;https://www.nushell.sh\e\Nushell\e]8;;\e\
```

The escape sequence counts toward the string's length. `str length` gives 43 for that link, and 7 after [`ansi strip`](/commands/docs/ansi_strip.md).

A list of strings becomes a list of links. For a table or a record, name the columns that hold the targets, as in `$sites | ansi link url`. `--text` gives every link the same text, so to take the text from another column, call `ansi link` for each row. In a terminal with OSC 8 support, the `url` column then shows clickable names:

```nu
[[name url]; [Nushell https://www.nushell.sh] [Reedline https://github.com/nushell/reedline]]
| update url {|row| $row.url | ansi link --text $row.name }
# => ╭───┬──────────┬──────────╮
# => │ # │   name   │   url    │
# => ├───┼──────────┼──────────┤
# => │ 0 │ Nushell  │ Nushell  │
# => │ 1 │ Reedline │ Reedline │
# => ╰───┴──────────┴──────────╯
```

A value that isn't a string, such as an int in the column you name, is a type mismatch error. So is a record or table passed without a column name. A column that's missing is a "Cannot find column" error. `ls` can make its file names clickable without `ansi link`; see [`ls.clickable_links`](./config_reference.md#ls).

## Shortening escape sequences

Colored output often carries more escape sequences than it needs: a reset right after a reset, or a color set again before any text uses it. [`ansi opt`](/commands/docs/ansi_opt.md) removes the sequences that have no effect and writes the rest in their shortest form, so the text looks the same in a terminal and takes fewer bytes. That helps when you store colored output or send it over a slow connection. Sequences it doesn't recognize pass through unchanged.

```nu
let colored = [error warn info] | each { $"(ansi reset)(ansi red_bold)($in)(ansi reset)" } | str join " "
$colored | ansi opt --stats | select input output saved fell_back
# => ╭───────────┬───────╮
# => │ input     │ 60 B  │
# => │ output    │ 46 B  │
# => │ saved     │ 14 B  │
# => │ fell_back │ false │
# => ╰───────────┴───────╯
```

A string comes back as a string and binary as binary. The output of an external command is shortened piece by piece as it streams, as in `^ls --color=always | ansi opt`. A whole string or binary never grows. When the shortened form would be longer, `ansi opt` returns the input as it was, and `--stats` reports `fell_back: true`. A stream has no such guarantee.

The result can rely on a color carrying over from one line to the next. Write it to the terminal as a whole; splitting it with `lines` can lose colors.

Three flags change how it shortens:

- `--compat` (`-c`) avoids shorthand that old terminals may reject, such as an empty parameter (`\e[;31m` becomes `\e[0;31m`) or a string ended with BEL.
- `--visual` drops colors that can't be seen, such as the foreground color of a space. Some tools that copy or record terminal output keep those colors, and they lose them.
- `--rep` writes a run of one character as the character plus a REP sequence, so `"──────────" | ansi opt --rep --show` gives `─\e[9b`. A terminal without REP support drops the repeated characters.

`--visual` and `--rep` together give the smallest output.

Instead of the shortened text, six flags each return a view of what changed. Only one can be used at a time; two are an "Incompatible parameters" error.

- `--show` returns the shortened text with each escape character written as `\e`.
- `--stats` (`-s`) returns a record with the sizes, the percentage saved, the number of sequences before and after, `fell_back`, a `breakdown` of the bytes by kind of sequence, and the `changes` made with the bytes each one saved.
- `--diff` returns a table with a row for each place between two pieces of text where the sequences changed: `from`, `to`, and `saved`.
- `--explain` returns a table with a row for each input sequence: what it means, its `outcome`, its `output`, and `why`. The outcomes are `kept`, `rewritten`, `folded` (written as part of a later sequence, once text needed it), `merged` (combined with neighboring movements or mode changes), `no effect`, `superseded` (replaced by a later sequence before it mattered), and `barrier` (copied as is, after which `ansi opt` stops assuming anything about the terminal's state).
- `--hotspot` returns a row for each line with the escape bytes it spent before and after, and its text shaded by cost.
- `--html` returns an HTML page that combines all the views. When the input came from a file opened with `open --raw`, the page is titled with the file's name.
