# `explore`

[`explore`](/commands/docs/explore.md) is a table pager, like `less` but for structured data. Pipe any value into it to scroll through it, drill down into nested records and tables, search, and run Nushell commands on what you are looking at.

## Signature

`> explore --head <bool> --index --tail --peek`

### Parameters

- `--head <bool>`: Show or hide column headers (default `true`)
- `--index, -i`: Show row indexes when viewing a list
- `--tail, -t`: Start with the viewport scrolled to the bottom
- `--peek, -p`: When quitting, output the value of the cell the cursor was on

## Get Started

```nu
ls | explore -i
```

![explore-ls-png](https://user-images.githubusercontent.com/20165848/207849604-421312e3-537f-4b2e-b83e-f1f83f2a79d5.png)

A few more ways to start:

```nu
# Explore the system host information record
sys host | explore

# Explore the output of ls without column names
ls | explore --head false

# Start at the end of a long list
help commands | explore --tail

# Explore a JSON file, then save the part you were looking at when you quit
open file.json | explore --peek | to json | save part.json
```

The input decides the first view:

- A list or a table opens as a table.
- A record opens transposed, with its keys down the first column.
- A single plain value, such as a number, a one-line string, or a one-item list, opens as plain text. A record with a single field that holds a plain value opens the same way and shows only the value.
- A string with several lines opens as a one-column table with a row per line.
- Binary data and byte streams open in the [hex view](#viewing-binary-data).
- No input, or an empty list or record, opens the help page.

## Moving Around

| Keys                                                   | Action                                         |
| ------------------------------------------------------ | ---------------------------------------------- |
| Arrow keys, or `h` `j` `k` `l`                         | Move the cursor                                |
| `Ctrl+p` / `Ctrl+n`                                    | Move up / down (Emacs style)                   |
| `PageUp` / `PageDown`, `Ctrl+b` / `Ctrl+f`, `Alt+v` / `Ctrl+v` | Page up / page down                    |
| `Home` / `End`, or `g` / `G`                           | Jump to the first / last row                   |
| `Enter` or `i`                                         | Enter cursor mode; in cursor mode, drill into the selected cell |
| `Esc` or `q`                                           | Leave cursor mode; otherwise go back up a level, and exit from the top level |
| `t`                                                    | Transpose (flip rows and columns), in view mode |
| `e`                                                    | Expand (show all nested data)                  |
| `Ctrl+C`, `Ctrl+D`, or `Ctrl+Q`                        | Exit from any view, even while typing a command or a search |

`explore` starts in _view_ mode (`VIEW` in the status bar), where the arrow keys scroll the table. Press `Enter` (or `i`) to switch to _cursor_ mode (`EDIT` in the status bar), where the arrow keys move a cursor from cell to cell. Pressing `Enter` again on a cell that holds a record or a list opens it in a new view, so you can walk down into nested data. `Esc` leaves cursor mode, and pressing it again goes back up one level.

## Searching

Press `/` to search forward or `?` to search backward. As you type, the view jumps to the first match and highlights the matches on screen. `Enter` keeps the query, and then `n` and `N` move to the next and previous match, wrapping around at the ends. The command bar at the bottom shows the query and a counter such as `[2/5]`. A backward search starts from the last match, and `n` moves up.

`Esc` closes the prompt and drops what you typed, but the last query you kept with `Enter` stays for `n` and `N`. `Backspace` on an empty prompt also closes it. When `Enter` finds nothing, the command bar shows `Pattern not found:` and the query.

The search is a plain substring test that respects case, not a regular expression, so `/alp` finds `alphabet` but not `Alpha`. In a table, it tests each column name and each cell on its own. In text, such as the help page or a plain value, it tests each line. The hex view can't be searched.

## Commands

[`explore`](/commands/docs/explore.md) has a few built-in commands. Press `:` and then type a command name:

| Command     | Action                                           |
| ----------- | ------------------------------------------------ |
| `:help`, `:h` | Show the help page                             |
| `:try`      | Open an interactive REPL on the current data     |
| `:nu <cmd>` | Run a Nushell command on the current data        |
| `:table`    | Open the current value in a new table view       |
| `:expand`, `:e` | Show the current value with all nested data expanded |
| `:q`, `:quit`, `:q!` | Exit `explore`                          |

While you type a command, `Left` and `Right` move the cursor, and `Up` and `Down` recall the commands you ran earlier in this `explore` session. `Esc`, or `Backspace` on an empty line, closes the command line. An unknown name shows `Error: command "foo" was not recognized`.

`:table` and `:expand` work on the current value, which is the selected cell in cursor mode and the whole table you are looking at in view mode. Both open a new view on top of the current one, and `Esc` goes back to it.

`:table` shows the value as a table that you can move around in, even when it is a plain value such as a string. `:expand`, which the `e` key also runs, draws the value as text, the way [`table --expand`](/commands/docs/table.md) does. Every nested list and record is drawn in full inside its cell, in the style set by `$env.config.table.mode`.

`:nu` pipes the current value into the command you give it, for example `:nu where size > 1kb | get name`. The command runs in the background, and its output opens as a new view that fills in as rows arrive. The status bar shows a spinner while it runs and then the number of rows. `Esc` closes the view and goes back. The command runs on a copy of your session, so a variable it defines is gone afterwards. `:nu` and `:try` refuse a command that contains `clear`, `explore`, `exit`, or `nu` as a separate word. `:nu` then reports `Command failed: Command ignored`, and `:try` reports an error that ends in `Command ignored`.

## Viewing Binary Data

When the input is binary data, `explore` shows a hex dump instead of a table. Each line has the offset of its first byte, the next sixteen bytes in hex, and the same bytes as characters:

```nu
0x[48 65 6c 6c 6f 2c 20 4e 75 21 00 09 0a 7f c3 a9] | explore
# =>  00000000 │ 4865 6c6c 6f2c 204e 7521 0009 0a7f c3a9 │ Hello, Nu!0__•××
```

In the character column, a printable ASCII character stands for itself, `0` is a null byte, `_` is whitespace other than a space (such as a tab or a newline), `•` is any other ASCII control character, and `×` is a byte outside ASCII.

A byte stream also opens in the hex view, even when it holds text. That includes the output of an external command and a text file read with [`open`](/commands/docs/open.md):

```nu
^echo hi there | explore
# =>  00000000 │ 6869 2074 6865 7265 0a                  │ hi there_
```

To see the text, convert it first, for example with [`lines`](/commands/docs/lines.md) or [`decode`](/commands/docs/decode.md). `explore` reads the whole stream into memory before it shows anything.

The hex view is simpler than the table view. You can scroll with the arrow keys, but there is no cursor mode, and the view can't be searched. Type `:q` or press `Ctrl+C` to exit.

## Config

`explore`'s colors are configured in `$env.config.explore`. Each value takes the same forms as [`color_config`](coloring_and_theming.md): a color name, a `#RRGGBB` hex code, or a `{fg, bg, attr}` record. For example:

```nu
$env.config.explore = {
    selected_cell: { bg: light_blue }
    highlight: { fg: black, bg: yellow }
    title_bar_text: { fg: white }
    title_bar_background: { bg: blue }
    status: {
        success: { fg: black, bg: green }
        error: { fg: white, bg: red }
    }
    try: { reactive: false }
}
```

These are the supported keys. The ones without a default use the terminal's own colors:

| Key                                            | Effect                                                                         | Default                    |
| ---------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------- |
| `selected_cell`                                | The cell under the cursor in cursor mode                                       | `{ bg: light_blue }`       |
| `highlight`                                    | Search matches                                                                 | `{ fg: black, bg: yellow }` |
| `title_bar_text`, `title_bar_background`       | The title bar at the top                                                       | none                       |
| `status_bar_text`, `status_bar_background`     | The status bar, second from the bottom, which shows the mode and position      | none                       |
| `command_bar_text`, `command_bar_background`   | The command bar at the bottom, where you type `:` commands and searches        | none                       |
| `status.success`                               | The name of a `:` command after it opens a view                                | `{ fg: black, bg: green }` |
| `status.error`                                 | Error messages, such as an unknown command or a failed `:nu` command           | `{ fg: white, bg: red }`   |
| `try.reactive`                                 | When `true`, `:try` re-runs your command as you type instead of on `Enter`     | `false`                    |

Run `config nu --doc` to see the documentation for every key.

## Examples

### Peeking a Value

```nu
$nu | explore --peek
```

![explore-peek-gif](https://user-images.githubusercontent.com/20165848/207854897-35cb7b1d-7f7d-4ae2-9ec8-df19ac04ac99.gif)

### `:try` Command

`:try` opens a command line above a results pane. Type a command and press `Enter` to run it on the current value, or set `try.reactive` to run it as you type. Errors show in the command bar. `:try <command>` opens the view and runs that command right away. The command line takes typed characters and `Backspace`, but has no cursor movement.

`Tab` or `Down` moves into the results, where the usual keys work, including `Enter` for cursor mode. `Tab`, `Esc`, or `Up` on the top row goes back to the command line. `Esc` in the command line closes `:try`.

![explore-try-gif](https://user-images.githubusercontent.com/20165848/208159049-0954c327-9cdf-4cb3-a6e9-e3ba86fde55c.gif)

#### Keeping the chosen value by `$nu`

Remember you can combine it with `--peek`. Quitting from `:try` outputs the result cell under the cursor in cursor mode, or else the whole result.

![explore-try-nu-gif](https://user-images.githubusercontent.com/20165848/208161203-96b51209-726d-449a-959a-48b205c6f55a.gif)

## Exploring Your Configuration

[`explore config`](/commands/docs/explore_config.md) opens your current `$env.config` as a tree, with an editor pane beside it. The editor pane shows the selected key's path, type, and value, along with the key's documentation from `config nu --doc`.

In the tree, the arrow keys or `j`/`k` move, `Right`/`Left` (or `l`/`h`) expand and collapse a node, and `Space` toggles it. `Home`, `End`, `PageUp`, and `PageDown` jump through the list. Press `/` or `Ctrl+F` and type to filter the tree down to the keys whose path contains the text, ignoring case. `Enter` keeps the filter, and `Esc` clears it.

`Enter` on a value starts editing it, and `Tab` switches between the tree and the editor pane, where `Enter` or `e` starts editing. In the editor, `Enter` adds a line, so press `Ctrl+S` or `Alt+Enter` to apply the edit to the tree, or `Esc` to cancel it. The text is read as the old value's type: plain text for a string, a number or `true`/`false` for those, and JSON for a record or a list. `explore config` refuses invalid JSON with a parse error.

After an edit, `q` won't quit and shows "Unsaved changes!" until you press `Ctrl+S` again while you aren't editing a value, which stages your changes. When `explore config` exits, every edit you applied to the tree is written to `$env.config` in the running session. The tree holds JSON, which has no closures, durations, filesizes, or dates. It shows closures and dates as strings, and durations and filesizes as plain numbers of nanoseconds and bytes. They all get their Nushell types back when the changes are applied.

Piped input switches `explore config` to a JSON viewer. The input must be JSON text, so use `open --raw` or `to json` rather than piping in a table or record. `--use-example-data` (`-e`) loads a built-in sample configuration instead. Neither one touches `$env.config`. `Ctrl+S` saves the whole document as indented JSON to the file named by `--output` (`-o`), or to `output.json` in the current directory. Using `--output` while editing your configuration is an `Invalid flag combination` error.

```nu
# Browse and edit the running configuration
explore config

# Explore any JSON data as a tree, and save edits with Ctrl+S
open --raw data.json | explore config --output edited.json

# Try the editor on sample data
explore config --use-example-data

# Print the tree without starting the TUI
open --raw data.json | explore config --tree
```

## Building Regular Expressions

[`explore regex`](/commands/docs/explore_regex.md) opens an interactive editor for building and testing a regular expression against some sample text. Piped text fills the test string pane. The pattern pane above it holds one line, and every match in the test string is highlighted, with the count in the pane's title. Patterns use the same regex engine as `=~`, so lookaround and backreferences work. Press `Ctrl+Q` to quit, and the text of the pattern pane is returned:

```nu
let pattern = open notes.txt | explore regex
open notes.txt | lines | where $it =~ $pattern
```

`Tab` switches between the two panes, and `Esc` goes back to the pattern. `F1` opens a quick reference of regex syntax, grouped by topic. Move through it with the arrow keys or `j`/`k`, scroll it sideways with `Left`/`Right` (or `h`/`l`), and press `Enter` to insert the highlighted pattern at the cursor. `Esc`, `Tab`, or `F1` closes it. `F2` shows a list of all the keys, and any key closes that list.

The panes use Emacs-style editing keys:

| Keys                                      | Action                                       |
| ----------------------------------------- | -------------------------------------------- |
| `Ctrl+A` / `Ctrl+E`                       | Start / end of the line                      |
| `Ctrl+B` / `Ctrl+F`, `Alt+B` / `Alt+F`    | Back / forward one character, or one word    |
| `Ctrl+K`, `Alt+U`                         | Delete to the end, or to the start, of the line |
| `Alt+Backspace`, `Alt+D`                  | Delete the word before, or after, the cursor |
| `Ctrl+U` / `Ctrl+R`                       | Undo / redo                                  |
| `Ctrl+V` or `Ctrl+Y`                      | Paste from the clipboard                     |
| `Enter` or `Ctrl+J`, `Ctrl+N` / `Ctrl+P`  | In the test string, add a line, or move to the next / previous line |

Characters typed with AltGr on international keyboard layouts, which terminals report as `Ctrl`+`Alt` combinations, are inserted as text.

## Building Your Own Interface

`explore` is a ready-made viewer. To build your own interactive interface, such as a picker, a form, or a dashboard, see [Building TUIs with `tui`](tui.md).
