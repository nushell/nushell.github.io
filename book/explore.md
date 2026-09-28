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

`explore` starts in _view_ mode (`VIEW` in the status bar), where the arrow keys scroll the table. Press `Enter` (or `i`) to switch to _cursor_ mode (`EDIT` in the status bar), where the arrow keys move a cursor from cell to cell. Pressing `Enter` again on a cell that holds a record or a list opens it in a new view, so you can walk down into nested data. `Esc` leaves cursor mode, and pressing it again goes back up one level.

## Searching

Press `/` to search forward or `?` to search backward. Results are highlighted as you type. Then use `n` and `N` to move between the matches.

## Commands

[`explore`](/commands/docs/explore.md) has a few built-in commands. Press `:` and then type a command name:

| Command     | Action                                           |
| ----------- | ------------------------------------------------ |
| `:help`     | Show the help page                               |
| `:try`      | Open an interactive REPL on the current data     |
| `:nu <cmd>` | Run a Nushell command on the current data        |
| `:q`        | Exit `explore`                                   |

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

The supported keys are `selected_cell`, `highlight`, `status_bar_text`, `status_bar_background`, `command_bar_text`, `command_bar_background`, `title_bar_text`, `title_bar_background`, `status` (with `info`, `success`, `warn`, and `error` entries), and `try.reactive`. When `try.reactive` is `true`, `:try` re-runs your command as you type instead of only when you press `Enter`.

Run `config nu --doc` to see the documentation and defaults for every key.

## Examples

### Peeking a Value

```nu
$nu | explore --peek
```

![explore-peek-gif](https://user-images.githubusercontent.com/20165848/207854897-35cb7b1d-7f7d-4ae2-9ec8-df19ac04ac99.gif)

### `:try` Command

There's an interactive environment which you can use to navigate through data using `nu`.

![explore-try-gif](https://user-images.githubusercontent.com/20165848/208159049-0954c327-9cdf-4cb3-a6e9-e3ba86fde55c.gif)

#### Keeping the chosen value by `$nu`

Remember you can combine it with `--peek`.

![explore-try-nu-gif](https://user-images.githubusercontent.com/20165848/208161203-96b51209-726d-449a-959a-48b205c6f55a.gif)

## Exploring Your Configuration

[`explore config`](/commands/docs/explore_config.md) opens your current `$env.config` as a tree with an editor pane. Use `Tab` to switch between the tree and the editor, the arrow keys to move and to expand or collapse nodes, and `Enter` to start editing a value. Press `Ctrl+S` to apply an edit. When you quit with `q`, your changes are applied to the running session; `Ctrl+C` quits without saving them.

```nu
# Browse and edit the running configuration
explore config

# Explore any JSON data as a tree
open --raw data.json | explore config

# Print the tree without starting the TUI
open --raw data.json | explore config --tree
```

## Building Regular Expressions

[`explore regex`](/commands/docs/explore_regex.md) opens an interactive editor for building and testing a regular expression against some sample text. Press `Ctrl+Q` to quit, and the expression you built is returned:

```nu
let pattern = open notes.txt | explore regex
open notes.txt | lines | where $it =~ $pattern
```

## Building Your Own Interface

`explore` is a ready-made viewer. To build your own interactive interface, such as a picker, a form, or a dashboard, see [Building TUIs with `tui`](tui.md).
