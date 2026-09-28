# Building TUIs with `tui`

The `tui` family of commands lets you build interactive terminal user interfaces (TUIs) and pop-up dialogs from a Nushell pipeline, without writing any Rust. You compose widgets such as tables, trees, search boxes, previews, menus, text boxes, and buttons, then hand the result to [`tui run`](/commands/docs/tui_run.md). When the user quits or makes a selection, `tui run` returns a record describing what they picked and the state of every widget.

```nu
ls | tui label --title "files" | tui table | tui run
```

That one line opens a full-screen, scrollable file list. Use the arrow keys (or `j`/`k`) to move, press `Enter` to return the highlighted row, or press `q` or `Esc` to quit without a selection.

::: tip `tui` or `explore`?
[`explore`](explore.md) is a ready-made pager for looking through any structured value. `tui` is a toolkit for building your own interface: a file picker, a confirmation dialog, a history search, a dashboard, or a small form. Both commands use the same color conversions, so Nushell styles look the same in each.
:::

`tui run` always draws on the terminal's alternate screen, so your shell and scrollback come back untouched when the TUI closes. [`tui debug`](/commands/docs/tui_debug.md) draws the same interface into a string instead of the terminal. That makes it useful for scripts and tests, and every example on this page that shows output uses it.

## Commands at a Glance

Every `tui` command except `tui run` and `tui debug` is a _builder_: it adds a widget to a `tui` value and returns the updated value.

| Command                                          | Positional       | Notable flags                                                         | Purpose                                                                         |
| ------------------------------------------------ | ---------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [`tui label`](/commands/docs/tui_label.md)       | text or closure  | `--title`, `--status`                                                 | Static text, the title bar, or the status bar. A closure follows a row.         |
| [`tui table`](/commands/docs/tui_table.md)       | source closure   | `--columns`, `--multi`, `--index`, `--capture-keys`, `--on-select`    | A navigable table. Scalars show as a single `item` column.                      |
| [`tui tree`](/commands/docs/tui_tree.md)         | source closure   | `--walk`, `--column`, `--multi`, `--on-select`                        | Nested records and lists, or a directory walk.                                  |
| [`tui select`](/commands/docs/tui_select.md)     | list of items    | `--display`, `--multi`, `--index`, `--on-select`                      | A radio list, or a checkbox list with `--multi`.                                |
| [`tui log`](/commands/docs/tui_log.md)           | source closure   | `--max-lines`                                                         | An append-only log that follows the end of a stream.                            |
| [`tui progress`](/commands/docs/tui_progress.md) | source closure   | `--value`, `--total`, `--label`                                       | A progress bar.                                                                 |
| [`tui preview`](/commands/docs/tui_preview.md)   | closure          | `--from`, `--max-bytes`                                               | Text for the highlighted row: a file's contents, or whatever a closure returns. |
| [`tui search`](/commands/docs/tui_search.md)     |                  | `--bind`, `--placeholder`, `--fuzzy`, `--case-sensitive`, `--columns` | A search box that filters the lists in its scope as you type.                   |
| [`tui textbox`](/commands/docs/tui_textbox.md)   |                  | `--placeholder`, `--value`                                            | An editable text field.                                                         |
| [`tui button`](/commands/docs/tui_button.md)     | label, hook      |                                                                       | Runs a hook, or submits its label, when activated.                              |
| [`tui menu`](/commands/docs/tui_menu.md)         | list of entries  |                                                                       | A menu bar with mnemonics, drop-downs, and actions.                             |
| [`tui split`](/commands/docs/tui_split.md)       | list of children | `--vertical`, `--sizes`, `--ratio`                                    | Side-by-side (or stacked) panes with draggable dividers.                        |
| [`tui box`](/commands/docs/tui_box.md)           | title, children  |                                                                       | A titled, bordered group of widgets.                                            |
| [`tui tab`](/commands/docs/tui_tab.md)           | title, children  |                                                                       | A page in the tab bar.                                                          |
| [`tui bind`](/commands/docs/tui_bind.md)         | key, hook        |                                                                       | Runs a hook when a key is pressed anywhere.                                     |
| [`tui run`](/commands/docs/tui_run.md)           | hook             | `--dialog`, `--size`, `--refresh`, `--no-mouse`                       | Runs the interface until the user submits or quits.                             |
| [`tui debug`](/commands/docs/tui_debug.md)       | hook             | `--keys`, `--until`, `--size`, `--dialog`                             | Renders without a terminal and reports the layout, focus order, and pages.      |

In addition, every builder accepts `--id` (a stable name for the widget) and `--focus` (start with this widget focused). The data widgets (`label`, `table`, `tree`, `select`, `log`, and `progress`) also accept `--data` and `--from`, which are described in [Where Widgets Get Their Data](#where-widgets-get-their-data).

## Your First TUI

### Inspecting a `tui` Value

Because builders only describe the interface, you can look at what you have built before running it:

```nu
tui label --title "App" | tui table | describe
# => tui

tui label --title "App" | tui table | get widgets.type
# => ╭───┬───────╮
# => │ 0 │ label │
# => │ 1 │ table │
# => ╰───┴───────╯
```

Each widget record has an `id`, a `type`, and, for containers, `children`. Other fields depend on the kind of widget.

### Rendering Without a Terminal

`tui debug` returns a record. Its `screen` field holds the painted text:

```nu
tui label --title "hello" | tui label --status "ready" | tui debug --size [40 6] | get screen
# =>  hello
# =>
# =>
# =>
# =>
# =>  ready  tab:focus  [:page  q:quit
```

The status bar appends short hints about the keys that are available. The default canvas is 80×24; `--size [width height]` changes it.

### Getting a Selection Back

Pipe rows into [`tui table`](/commands/docs/tui_table.md) and run it. `Enter` submits the highlighted row:

```nu
let picked = ls | tui table --columns [name type size] | tui run
if $picked.action == "submit" {
    $picked.selected
}
```

`tui debug --keys` replays key presses, so you can check the same behavior in a script:

```nu
[{name: a}, {name: b}] | tui table | tui debug --keys [down enter] | get selected.name
# => b
```

If you don't pass `--columns`, the table shows every column of the input. Lists of scalars and ranges get a single `item` column:

```nu
1..20 | tui table | tui run
```

## Layout

### Stacking Widgets

Widgets in the outer pipeline stack from top to bottom in the order they are added. Adjacent [`tui button`](/commands/docs/tui_button.md)s are the exception: they share one row, left to right.

```nu
tui label "Delete everything?" | tui button Yes | tui button No | tui debug --size [30 4] | get screen
# => Delete everything?
# =>  [ Yes ]  [ No ]
```

A few widgets are _chrome_ that belongs to the whole interface, and they can only be used in the outer pipeline:

- `tui label --title` (the title bar at the top)
- `tui label --status` (the status bar at the bottom)
- `tui menu` (the menu bar)
- `tui tab` (pages)

Using one of them inside a container is an error.

### Splits

[`tui split`](/commands/docs/tui_split.md) divides its area between a list of child widgets: side by side by default, or stacked with `--vertical`. Children are built inside parentheses:

```nu
ls | tui split [ (tui table --columns [name type]) (tui preview) ] | tui run
```

`--sizes` gives one size per child. Missing entries default to `1fr`:

| Size                   | Meaning                                                |
| ---------------------- | ------------------------------------------------------ |
| `20`                   | 20 cells                                               |
| `"30%"` or `30%`       | 30 percent of the split                                |
| `"1fr"`, `"2fr"`       | A share of the remaining space; `2fr` gets twice `1fr` |
| `"min:10"`, `"max:40"` | At least, or at most, that many cells                  |

`--ratio 60` is shorthand for `--sizes [60% 1fr]`. Splits can be nested:

```nu
ls
| tui split --sizes [30 1fr] [
    (tui tree --walk)
    (tui split --vertical --ratio 70 [ (tui preview) (tui log) ])
  ]
| tui run
```

A one-cell handle sits between each pair of panes. Drag it with the mouse, or `Tab` to the split and use the arrow keys (or `hjkl`) to move the first divider by one percent at a time. `tui debug` reports the current sizes under `values`:

```nu
ls | tui split --ratio 60 [ (tui table) (tui preview) ] | tui debug | get values.split-0
# => ╭───┬─────╮
# => │ 0 │ 60% │
# => │ 1 │ 1fr │
# => ╰───┴─────╯
```

A split whose children all have a fixed height (buttons, labels, text boxes, and progress bars) is not divided into panes. It takes exactly the height of its children and draws no handle. Use this to stack buttons, or to place a text box next to a button:

```nu
tui split --vertical [ (tui button Yes) (tui button No) ] | tui debug --size [30 4] | get screen
# =>  [ Yes ]
# =>  [ No ]

tui label "name" | tui split [ (tui textbox --id name) (tui button Go) ] | tui debug --size [40 4] | get screen
# => name
# => ┌ input ───────────┐ [ Go ]
# => │▌                 │
# => └──────────────────┘
```

### Boxes

[`tui box`](/commands/docs/tui_box.md) draws a titled border around its children and can go anywhere, including inside a split:

```nu
ls | tui split [ (tui box "list" [ (tui search) (tui table) ]) (tui preview) ] | tui run
```

### Tabs

[`tui tab`](/commands/docs/tui_tab.md) turns a group of widgets into a page. The tab bar appears whenever there is at least one top-level tab:

```nu
ls
| tui tab "table" [ (tui table --columns [name type size]) ]
| tui tab "tree" [ (tui split [ (tui tree --walk) (tui preview) ]) ]
| tui run
```

Switch pages by clicking a tab, with `[` and `]`, with `Ctrl+Left` and `Ctrl+Right`, with `Ctrl+Tab` and `Ctrl+Shift+Tab`, or by pressing a digit (`1` to `9`) to jump to that page. Tabs cannot be nested.

```nu
ls | tui tab "a" [ (tui table) ] | tui tab "b" [ (tui table) ] | tui debug --keys ["2"] | get page
# => 1
```

### Widget IDs

Each widget gets an automatic id made of its type and a number, such as `table-0` or `search-0`, counted separately for each kind of widget. When two containers each hold a `table-0`, the second is renumbered to `table-1`:

```nu
tui split [ (tui box "a" [(tui table)]) (tui box "b" [(tui table)]) ] | tui debug | get focus.order
# => ╭───┬─────────╮
# => │ 0 │ table-0 │
# => │ 1 │ table-1 │
# => │ 2 │ split-0 │
# => ╰───┴─────────╯
```

An explicit `--id` is never renumbered, and using the same explicit id twice is an error. Give a widget an `--id` whenever something else needs to refer to it, such as a `--from` flag, or when you want to read its state from the result record by a predictable name.

## Where Widgets Get Their Data

Each data widget shows the first of these that exists:

1. Its own `--data`, or the value piped into it inside a container's child list, as in `[(ls | tui table)]`.
2. What its `--from` source produces (see [Following a Row](#following-a-row)).
3. The data of the nearest enclosing container.
4. The data piped into the outer pipeline.

This means one pipeline can feed every widget, or each pane can have its own rows:

```nu
ls | tui split [ (tui table) (tui tree) ] | tui run           # both show ls
tui split [ (ps | tui table) (ls | tui table) ] | tui run      # each has its own rows
tui split [ (tui table --data (ps)) (tui table --data (ls)) ] | tui run   # the same, spelled out
```

```nu
tui split [ ([1 2] | tui table) ([3] | tui table) ] | tui debug | get widgets.0.children.rows
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 1 │
# => ╰───┴───╯
```

### Streams

How a builder treats a stream depends on where the stream comes from:

- **Output of an external command** (for example `^tail -f app.log`) stays _live_. `tui run` reads it on a background thread, and new rows appear while the interface is open. If the interface closes while the command is still running, the command is stopped.
- **Everything else** (lists, internal streams, and ranges) is collected before the interface is shown, up to 100,000 rows. Anything beyond that stays live.

```nu
# Follow a growing log file until you press q
^tail -f app.log | tui label --title "app.log" | tui log | tui run
```

::: warning
Because internal streams are collected first, a slow, never-ending internal stream such as `1.. | each {|n| sleep 100ms; $n }` has to produce 100,000 rows before anything is drawn. To show data that changes over time, use an external command's output or the [`--refresh`](#refreshing-on-a-timer) flag of `tui run`.
:::

Rows that arrive from a live stream are kept in one shared store of at most `max(10000, --max-lines)` rows. A container's child list can only hold collected values, so keep live producers in the outer pipeline.

`tui debug` reads a finite stream to the end (for up to five seconds) before painting. Don't pipe an unbounded stream into it without a limit.

## Following a Row

### Previews

[`tui preview`](/commands/docs/tui_preview.md) shows text for the highlighted row of a list. Without a closure, it reads the file named in the row's `name` column. Directories and binary files show a short note instead, and at most `--max-bytes` bytes (65536 by default) are read:

```nu
ls | tui split [ (tui table --columns [name type]) (tui preview) ] | tui run
```

The arrow keys stay on the table, and the preview follows along. The preview follows the focused list, or else the nearest list in the same container, or else the first visible list. Use `--from <id>` to name the list explicitly.

A closure **without** parameters transforms the file text, which it receives as `$in`. ANSI colors in the result are drawn as colors, so `nu-highlight` or `bat` can add syntax highlighting:

```nu
ls | tui split [ (tui table) (tui preview { nu-highlight }) ] | tui run
```

A closure **with** one parameter receives the highlighted row. Nothing is read from disk; whatever the closure returns is shown:

```nu
$env.config.keybindings
| tui split [ (tui table --columns [name modifier keycode]) (tui preview {|row| $row.event | to nuon }) ]
| tui run
```

### Detail Views and Captions

Any data widget can follow a row in the same way. `--from <id>` names the source list, and a positional closure turns its highlighted row into this widget's data. A table becomes a detail view:

```nu
[{name: a, kids: [1 2]}, {name: b, kids: [3 4 5]}]
| tui split [ (tui table --id src --columns [name]) (tui table --from src {|r| $r.kids }) ]
| tui debug --keys [down] --size [50 7]
| get screen
# => ┌ table (2) ────────────┐│┌ table (3) ───────────┐
# => │  name                 │││  item                │
# => │  a                    │││▶ 3                   │
# => │▶ b                    │││  4                   │
# => │                       │││  5                   │
# => │                       │││                      │
# => └───────────────────────┘│└──────────────────────┘
```

A label becomes a caption for the highlighted row:

```nu
[{name: a, size: 1kb} {name: b, size: 2kb}]
| tui table --columns [name]
| tui label {|row| $"size: ($row.size)" }
| tui debug --keys [down] --size [40 6]
| get screen
# => ┌ table (2) ───────────────────────────┐
# => │  name                                │
# => │  a                                   │
# => │▶ b                                   │
# => └──────────────────────────────────────┘
# => size: 2.0 kB
```

Without `--from`, a widget with a source closure follows the nearest list, just like a preview does. Without a closure, the row itself becomes the widget's data. A source closure re-runs only when the highlighted row changes or the pane is resized. If `--from` names a widget that doesn't exist, `tui run` and `tui debug` stop with an error.

### Fitting Output to a Pane

Preview and source closures see the inner size of their pane as `$env.TUI_WIDTH` and `$env.TUI_HEIGHT`:

```nu
[{name: a}]
| tui split [ (tui table) (tui preview {|row| $"w=($env.TUI_WIDTH) h=($env.TUI_HEIGHT)" }) ]
| tui debug --size [60 6]
| get screen
# => ┌ table (1) ─────────────────┐│┌ a ────────────────────────┐
# => │  name                      │││w=27 h=4                   │
# => │▶ a                         │││                           │
# => │                            │││                           │
# => │                            │││                           │
# => └────────────────────────────┘│└───────────────────────────┘
```

This matters for commands that size themselves to the terminal. [`table`](/commands/docs/table.md) without `-w` uses the full terminal width and overflows a pane, so pass the pane width instead:

```nu
ps | tui split [ (tui table --columns [pid name]) (tui preview {|p| $p | table -e -w $env.TUI_WIDTH }) ] | tui run
```

## Searching and Filtering

[`tui search`](/commands/docs/tui_search.md) adds a search box. As you type, it filters tables, logs, trees, and selects:

```nu
ls
| tui label --title "files"
| tui search --placeholder "filter" --bind /
| tui table --columns [name type size]
| tui label --status "enter: pick  /: filter  q: quit"
| tui run
```

- Press the `--bind` key (here `/`) to focus the search box from anywhere except a text box. Give the search box `--focus` to start there, so typing filters right away.
- `Enter` submits the highlighted row of the filtered list.
- `Esc` clears the query; pressing `Esc` again leaves the search box. While typing in the box, `q` is just the letter q.

By default, matching is a case-insensitive substring search over every field. `--fuzzy` uses the same matcher as `input list --fuzzy`, `--case-sensitive` respects case, and `--columns` limits matching to the listed columns:

```nu
[{name: alpha}, {name: gamma}]
| tui search --fuzzy --columns [name] --bind /
| tui table
| tui debug --keys "/,type:gm,enter"
| get selected.name
# => gamma
```

### Search Scope

A search box's position decides what it filters. In the outer pipeline, it filters every list. Inside a `tui split` or `tui box`, it only filters the lists in that container, and each search box keeps its own query:

```nu
ls
| tui split [
    (tui box "files" [ (tui search --bind /) (tui table --id files) ])   # filters only `files`
    (tui table --id other)                                               # never filtered
  ]
| tui run
```

`tui debug` shows the search each list is attached to in its `search_scope` field.

### Filtering by Key Chord

With `--capture-keys`, a key chord pressed while a table is focused becomes the filter query. Rows with reedline-style `modifier` and `keycode` fields match chords, so the `control` + `char_r` row in `$env.config.keybindings` matches `Ctrl+R`:

```nu
[
    {name: "history", modifier: "control", keycode: "char_r", mode: "emacs"}
    {name: "clear", modifier: "control", keycode: "char_l", mode: "emacs"}
]
| tui table --capture-keys
| tui debug --keys "ctrl+r,enter"
| get selected.name
# => history
```

This makes a quick keybinding explorer:

```nu
def "keys ui" [] {
    $env.config.keybindings
    | tui label --title "keybindings"
    | tui search --placeholder "type to filter, or focus the list and press a chord" --bind /
    | tui table --capture-keys --columns [name modifier keycode]
    | tui label --status "/: search  chord: filter list  enter: pick  q: quit"
    | tui run
}
```

`Tab`, `Enter`, `Esc`, `q`, `[`, `]`, and the page digits keep their normal meaning.

## Lists, Trees, and Pickers

### Choosing Several Rows

`--multi` turns a table, tree, or select into a checklist. `Space` checks the highlighted row, and `Enter` submits the checked rows (or the highlighted row, if nothing is checked). `--index` (on tables and selects) submits positions instead of rows:

```nu
[a b c] | tui table --multi | tui debug --keys [space down space enter] | get selected
# => ╭───┬───╮
# => │ 0 │ a │
# => │ 1 │ b │
# => ╰───┴───╯

[a b c] | tui table --index | tui debug --keys [down enter] | get selected
# => 1
```

### Select Lists

[`tui select`](/commands/docs/tui_select.md) shows a radio list of items from its argument, `--data`, or the pipeline:

```nu
tui select [small medium large] | tui debug --keys [down enter] | get selected
# => medium
```

`--display` chooses the label for each item: either a column name or a closure. The original item is what gets selected, just as with `input list --display`:

```nu
[{n: 1, label: one} {n: 2, label: two}] | tui select --display label | tui debug --keys [down enter] | get selected
# => ╭───────┬─────╮
# => │ n     │ 2   │
# => │ label │ two │
# => ╰───────┴─────╯
```

With `--multi`, it becomes a list of checkboxes:

```nu
tui select --multi [a b c] | tui debug --keys [space down] --size [26 5] | get screen
# => ┌ select (3, 1 checked) ─┐
# => │[x] a                   │
# => │[ ] b                   │
# => │[ ] c                   │
# => └────────────────────────┘
```

### Trees

[`tui tree`](/commands/docs/tui_tree.md) shows nested records and lists. The top-level keys are the roots, and leaves are shown as `key: value`. `Right` (or `l`) expands a node, `Left` (or `h`) collapses it, and `Enter` submits it:

```nu
{a: {b: 1, c: 2}, d: [3, 4]} | tui tree | tui debug --keys [right down down down right] --size [30 9] | get screen
# => ┌ tree (6) ──────────────────┐
# => │▾ a                         │
# => │    b: 1                    │
# => │    c: 2                    │
# => │▾ d                         │
# => │    3                       │
# => │    4                       │
# => │                            │
# => └────────────────────────────┘
```

Any record expands into its fields, so the rows of `ls` open up to show `name`, `type`, `size`, and `modified`.

With `--walk`, rows whose `type` is `dir` are treated as folders, and their contents are listed from disk when they are expanded. Relative paths are resolved against the current directory, and `--column` selects the path column (`name` by default):

```nu
ls | tui split [ (tui tree --walk) (tui preview) ] | tui run
```

### Logs

[`tui log`](/commands/docs/tui_log.md) is an append-only view that follows the end of its data. Scrolling up (with the arrow keys, `PageUp`/`PageDown`, or the mouse wheel) pauses following, and the title changes to `log (paused)`. Scroll to the bottom, or press `End`, to resume. `--max-lines` (10000 by default) limits how many lines are kept:

```nu
1..30 | each {|n| $"tick ($n)" } | tui log | tui debug --size [30 6] | get screen
# => ┌ log ───────────────────────┐
# => │tick 27                     │
# => │tick 28                     │
# => │tick 29                     │
# => │tick 30                     │
# => └────────────────────────────┘
```

### Progress Bars

[`tui progress`](/commands/docs/tui_progress.md) shows `--value`, or else reads a number from its data: a number, the `value` field of a record, or the last number in a list. Values up to 1 are fractions; larger values are read against `--total` (100 by default):

```nu
tui progress --value 0.4 --label copying | tui debug --size [40 4] | get screen
# => ██████████████copying 40%

[10 20 30] | tui progress --label done | tui debug --size [30 4] | get screen
# => █████████  done 30%
```

Because the last number in a list is used, a live stream of numbers from an external command drives the bar as it runs. With `--from` and a closure, the bar follows another widget's highlighted row instead.

## Making It Interactive

### The Hook Contract

Every closure that reacts to the user follows the same contract. That includes `tui bind`, `tui button`, menu actions, `--on-select`, and the closure passed to `tui run` or `tui debug`. The hook receives the state record (the same record that `tui run` returns, described in [The Result Record](#the-result-record)) both as `$in` and as its first parameter, if it declares one. What the hook returns decides what happens next:

| The hook returns                  | Effect                                                            |
| --------------------------------- | ----------------------------------------------------------------- |
| nothing                           | Nothing changes                                                   |
| `{action: submit, selected: ...}` | The TUI closes with that selection                                |
| `{action: quit}`                  | The TUI closes without a selection                                |
| anything else                     | Replaces the shared data list; every widget that reads it redraws |

If a hook raises an error, the error is shown on the status bar as `error:...` and the TUI stays open:

```nu
[a b] | tui table | tui bind x {|| error make {msg: boom} } | tui label --status "ready" | tui debug --keys [x] --size [50 6] | get screen
# => ┌ table (2) ─────────────────────────────────────┐
# => │  item                                          │
# => │▶ a                                             │
# => │  b                                             │
# => └────────────────────────────────────────────────┘
# =>  ready  error:boom  focus:table-0  rows:2  tab:foc
```

### Key Bindings

[`tui bind`](/commands/docs/tui_bind.md) runs a hook when a key is pressed anywhere in the TUI. The key is a chord string such as `ctrl+s`, `alt+r`, `f5`, or `x`, or a reedline-style record like the ones in `$env.config.keybindings`:

```nu
ls
| tui table --columns [name type size]
| tui bind ctrl+r {|| ls }                                                  # reload
| tui bind s {|state| {action: submit, selected: $state.selected.name} }    # submit just the name
| tui run
```

```nu
[a b] | tui table | tui bind ctrl+r {|| [x y z] } | tui debug --keys ctrl+r | get rows
# => 3

[a b] | tui table | tui bind {modifier: control, keycode: char_q} {|| {action: quit} } | tui debug --keys ctrl+q | get action
# => quit
```

Bindings take precedence over the built-in keys, except `Ctrl+C`. A binding without a modifier doesn't fire while you are typing in a search box or text box.

### Reacting to the Selection

`--on-select` on a table, tree, or select runs a hook whenever the highlight moves. Use it for side effects outside the interface; printing from a hook would draw over the screen:

```nu
ls | tui table --on-select {|s| $s.selected.name | save -f last-picked.txt } | tui run
```

To show something about the selection on screen, use a widget that [follows the row](#following-a-row) instead:

```nu
ls | tui table --columns [name] | tui label {|row| $"selected: ($row.name)  ($row.size)" } | tui run
```

### Refreshing on a Timer

The closure passed to `tui run` is a hook that runs once before the first frame. With `--refresh`, it runs again at every interval, and its output replaces the shared data list. The highlight and any search query are kept, and a failing refresh keeps the last good rows:

```nu
ls | tui table | tui run --refresh 1sec { ls }
```

`tui debug` runs its closure once before painting:

```nu
[{name: old}] | tui table --columns [name] | tui debug { [{name: new}] } --size [30 4] | get screen
# => ┌ table (1) ─────────────────┐
# => │  name                      │
# => │▶ new                       │
# => └────────────────────────────┘
```

### Menus

[`tui menu`](/commands/docs/tui_menu.md) adds a menu bar. Each entry is a string or a record of the form `{name, items?, action?}`. `items` opens as a drop-down, and `action` is a hook:

```nu
ls
| tui label --title "Files"
| tui menu [
    {name: "&File", items: [
        {name: "&Reload", action: {|| ls }}
        {name: "&Parent", action: {|| ls .. }}
        "&Quit"
    ]}
    {name: "&Sort", items: [
        {name: "by &Name", action: {|| ls | sort-by name }}
        {name: "by &Size", action: {|| ls | sort-by size }}
        {name: "by &Modified", action: {|| ls | sort-by modified }}
    ]}
    "&Help"
  ]
| tui table --columns [name type size modified]
| tui label --status "alt+f: file  alt+s: sort  q: quit"
| tui run
```

- **Mnemonics:** An `&` before a letter picks that letter as the entry's shortcut and underlines it. Without `&`, the first letter is used. `Alt+F` opens the File menu from anywhere except a text field. Inside an open drop-down, the letter alone picks an entry, so `Alt+S` followed by `N` sorts by name.
- **Keys:** `Left`/`Right` (or `h`/`l`) move along the bar. `Down` or `Enter` opens the drop-down (or activates an entry without one). `Esc` closes the drop-down. Entries can also be clicked.
- **Actions:** An entry with an `action` runs it as a hook when activated.
- **Submitting:** An entry without an action submits and closes the TUI. For a drop-down entry, `selected` is `{menu, item, row}`, where `row` is the highlighted row of the table, so the choice can act on it. For a bar entry without a drop-down, `selected` is its name.

```nu
[{name: x.txt}] | tui menu [{name: "&File", items: ["&Open" "&Quit"]}] | tui table | tui debug --keys "alt+f,o" | get selected | to nuon
# => {menu: File, item: Open, row: {name: "x.txt"}}

[a b] | tui menu [{name: "&File", items: [{name: "&Reload", action: {|| [x y z] }} "&Quit"]}] | tui table | tui debug --keys "alt+f,r" | get rows
# => 3
```

### Forms: Text Boxes and Buttons

[`tui textbox`](/commands/docs/tui_textbox.md) is an editable field and [`tui button`](/commands/docs/tui_button.md) is a focusable label. Use `Tab` and `Shift+Tab` to move between them:

```nu
tui label --title "rename"
| tui label "new name"
| tui textbox --id name --placeholder "type a name"
| tui button Save {|s| $s.values.name | save name.txt; {action: quit} }
| tui button Cancel {|| {action: quit} }
| tui label --status "tab: next  enter: activate  esc: cancel"
| tui run
```

While a text box is focused, `q` is just a character and `Esc` leaves the field. `Enter` submits, with the text as `selected`. The text is also available by id in `values`, and `--value` sets the initial text:

```nu
tui textbox --id name | tui debug --keys "type:bob,enter" | select action selected values | to nuon
# => {action: submit, selected: bob, values: {name: bob}}
```

Press `Enter` or `Space` on a focused button, or click it, to activate it. A button with a hook behaves like `tui bind`. A button without a hook submits its own label, so two plain buttons make a confirmation dialog. `Left`/`Right` (or `h`/`l`) move between buttons on the same row:

```nu
tui label "Delete?" | tui button Yes | tui button No | tui debug --keys [right enter] | get selected
# => No
```

## Running the TUI

### Pop-up Dialogs

`tui run --dialog` (`-d`) shows the same interface in a smaller floating window on the alternate screen. Without `--size`, the dialog is about three quarters of the terminal, and at least 40×12. Drag the title bar to move it, drag the bottom-right corner to resize it, or click `x` to close it:

```nu
[a b c] | tui label --title "pick" | tui table | tui debug --dialog --size [40 10] | get screen
# => ┌ pick ───────────────────────────── x ┐
# => │ pick                                 │
# => │┌ table (3) ─────────────────────────┐│
# => ││  item                              ││
# => ││▶ a                                 ││
# => ││  b                                 ││
# => ││  c                                 ││
# => ││                                    ││
# => │└────────────────────────────────────┘│
# => └──────────────────────────────────────┘
```

`--no-mouse` turns off mouse capture, which lets your terminal's own text selection work.

### Keyboard and Mouse

| Keys                                                                          | Action                                                                                                                                                        |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Tab` / `Shift+Tab`                                                           | Move focus. The focused widget gets the `border_focused` color. Focus starts on the widget built with `--focus`, or else on the first list, input, or button. |
| Typing                                                                        | Goes to a focused search box or text box.                                                                                                                     |
| `Enter`                                                                       | Submit the focused widget's selection. On a menu, open the drop-down or activate the entry.                                                                   |
| `Space`                                                                       | Check the highlighted row of a `--multi` list, or activate a button.                                                                                          |
| `Esc`                                                                         | In a search box, clear the query, then leave the box. In a text box, leave the field. With a drop-down open, close it. Otherwise, quit.                       |
| Arrows, `hjkl`, `PageUp`/`PageDown`, `Home`/`End`                             | Move in tables, trees, and selects; scroll logs; move along a menu or a row of buttons; move a split's first divider.                                         |
| `Alt+`letter                                                                  | Open the menu entry with that mnemonic.                                                                                                                       |
| `q` (when not typing) or `Ctrl+C`                                             | Quit. `selected` is then `null`.                                                                                                                              |
| `[` / `]`, `Ctrl+Left` / `Ctrl+Right`, `Ctrl+Tab` / `Ctrl+Shift+Tab`, `1`-`9` | Switch pages.                                                                                                                                                 |
| Mouse                                                                         | Click to focus and select, scroll with the wheel, drag split handles, click menu entries and buttons.                                                         |

The focusable widgets are menus, tables, selects, trees, logs, search boxes, text boxes, buttons, and split handles. Labels, previews, progress bars, boxes, and tabs are not focusable.

### The Result Record

`tui run` returns a single record, and every hook receives the same record:

| Field      | Meaning                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `action`   | `submit`, `quit`, or (from `tui debug` only, when neither happened) `render`                                                          |
| `focused`  | The id of the focused widget                                                                                                          |
| `selected` | The focused widget's selection: a row, the checked rows, an index, a tree node, a `{menu, item, row}` record, text, or a button label |
| `page`     | The index of the current tab                                                                                                          |
| `values`   | The state of every widget, keyed by id                                                                                                |
| `rows`     | The length of the shared data list                                                                                                    |
| `live`     | Whether a stream is still producing rows                                                                                              |

`tui debug` adds `screen`, the resolved `widgets` tree, `focus` (the focus `order` and the `default` widget), and `pages`.

The shape of each entry in `values` depends on the widget:

| Widget           | Value                                          |
| ---------------- | ---------------------------------------------- |
| search, text box | The text                                       |
| table, select    | `{index, row}` (plus `checked` with `--multi`) |
| tree             | `{index, path, value}`                         |
| log              | `{rows, follow}`                               |
| preview          | `{title, text}`                                |
| split            | The list of sizes                              |
| progress         | The current value                              |
| button           | The label                                      |

```nu
[{name: alpha} {name: beta}] | tui search | tui table | tui debug --keys "tab,type:be" | get values | to nuon
# => {"search-0": be, "table-0": {index: 0, row: {name: beta}}}
```

Read a widget's state by the id you gave it:

```nu
tui textbox --id name | tui run | get values.name
```

## Testing with `tui debug`

`tui debug --keys` replays a list of key tokens (or a comma-separated string of them) and returns the result record, including `screen`:

| Token                                                              | Meaning                     |
| ------------------------------------------------------------------ | --------------------------- |
| `enter`, `esc`, `tab`, `shift+tab`                                 | Those keys                  |
| `up`, `down`, `left`, `right`, `home`, `end`, `pageup`, `pagedown` | Movement                    |
| `backspace`, `delete`, `space`, `insert`                           | Editing keys                |
| `ctrl+c`, `ctrl+r`, `alt+f`, `f1`                                  | Modifiers and function keys |
| A single character, such as `q` or `/`                             | That key                    |
| `type:hello`                                                       | Types those characters      |
| `click:COL,ROW`                                                    | A left click                |
| `drag:COL,ROW`                                                     | A left-button drag          |
| `scroll-up`, `scroll-down`                                         | The mouse wheel             |

In the string form, `click:10,5` keeps its comma. `--until` stops the replay as soon as its closure returns `true` for the state record:

```nu
[a b c d] | tui table | tui debug --keys [down down down] --until {|s| $s.values.table-0.index == 1 } | get values.table-0.index
# => 1
```

`--size` sets the canvas size (clamped to 16-400 columns and 4-200 rows), and `--dialog` paints the pop-up frame. This makes `tui debug` a good fit for tests:

```nu
use std/assert

def pick-size [] { tui select [small medium large] }

assert equal (pick-size | tui debug --keys [down enter] | get selected) "medium"
assert equal (pick-size | tui debug --keys [esc] | get action) "quit"
```

## Theming

Colors come from `$env.config.tui`, which has one entry per part of the interface. Each value takes the same forms as [`color_config`](coloring_and_theming.md): a color name, a `#RRGGBB` hex code, or a `{fg, bg, attr}` record.

| Key                           | Paints                                                               | Default                                        |
| ----------------------------- | -------------------------------------------------------------------- | ---------------------------------------------- |
| `title_bar`                   | The title bar from `tui label --title`                               | `{ fg: white, bg: blue, attr: b }`             |
| `status_bar`                  | The status bar from `tui label --status`                             | `{ fg: white, bg: dark_gray }`                 |
| `border` / `border_focused`   | Widget borders, and the border of the focused widget                 | `{ fg: dark_gray }` / `{ fg: cyan }`           |
| `selected`                    | The highlighted row in tables, trees, selects, and menus             | `{ attr: r }`                                  |
| `header`                      | Table column headers                                                 | `{ fg: green, attr: b }`                       |
| `muted`                       | Placeholders and empty-state text                                    | `{ fg: dark_gray }`                            |
| `highlight`                   | Search query text and check marks                                    | `{ fg: yellow, attr: b }`                      |
| `tab_active` / `tab_inactive` | The tab bar                                                          | `{ fg: cyan, attr: bu }` / `{ fg: dark_gray }` |
| `progress`                    | The filled part of a progress bar                                    | `{ fg: green }`                                |
| `button`                      | Button labels                                                        | `{ fg: white, bg: blue }`                      |
| `surface` / `backdrop`        | The fill behind widgets, and behind a `--dialog` (only `bg` is used) | unset (a near-black fill)                      |

```nu
$env.config.tui.title_bar = { fg: black, bg: yellow, attr: b }
$env.config.tui.border_focused = { fg: "#ff8800" }
```

Run `config nu --doc` to see the documentation for every key.

Table and tree cells are colored the same way as `table` and `ls` output: values by type through `color_config`, and path columns through `LS_COLORS` (following `$env.config.ls.use_ls_colors`). When `$env.config.use_ansi_coloring` is off, the TUI draws without colors and shows the selection in reverse video.

## Recipes

### File Picker with Preview and Search

```nu
ls
| tui label --title "files"
| tui search --bind /
| tui split [ (tui table --columns [name type size]) (tui preview { nu-highlight }) ]
| tui label --status "enter: pick  /: filter  q: quit"
| tui run
```

### Master and Detail

The table lists the contents of whichever directory is highlighted in the tree, and the preview follows the focused list:

```nu
ls
| tui split --sizes [30 1fr] [
    (tui tree --walk --id dirs)
    (tui split --vertical [
        (tui table --from dirs {|node| ls $node.name } --columns [name size modified])
        (tui preview)
    ])
  ]
| tui run
```

### Confirmation Dialog

```nu
def confirm [question: string]: nothing -> bool {
    let r = tui label $question | tui button Yes | tui button No | tui run --dialog --size [40 8]
    $r.action == "submit" and $r.selected == "Yes"
}

if (confirm "Delete build output?") {
    print "Deleting..."
}
```

### Pick Several Files

A checklist over `ls`: `Space` checks files and `Enter` returns the checked rows. When nothing is checked, `Enter` returns just the highlighted row, so the same picker works for a single file:

```nu
def "pick files" [] {
    let r = ls
        | tui label --title "pick files"
        | tui search --bind / --columns [name]
        | tui table --multi --columns [name type size modified]
        | tui label --status "space: check  /: filter  enter: accept  q: cancel"
        | tui run
    if $r.action == "submit" { $r.selected } else { [] }
}

pick files | each {|f| cp $f.name backup/ }
```

### History Picker on a Key

Fuzzy-find a past command and put it on the command line. The command itself is ordinary Nushell; a keybinding makes it available with `Ctrl+H`:

```nu
def "history ui" [] {
    let r = history
        | get command
        | reverse
        | uniq
        | wrap command
        | tui label --title "history"
        | tui search --focus --bind / --fuzzy --columns [command] --placeholder "fuzzy filter"
        | tui table --columns [command]
        | tui label --status "type to filter  enter: put on the command line  esc esc: cancel"
        | tui run --dialog --size [100 24]
    if $r.action == "submit" {
        commandline edit --replace $r.selected.command
    }
}

$env.config.keybindings ++= [{
    name: history_ui
    modifier: control
    keycode: char_h
    mode: [emacs vi_insert vi_normal]
    event: { send: executehostcommand, cmd: "history ui" }
}]
```

Newest commands come first, and duplicates are removed. Because the search box has `--focus`, typing goes straight to the fuzzy filter, and `Enter` replaces the current line with the highlighted match.

::: tip
On terminals without the kitty keyboard protocol, `Ctrl+H` sends the same code as `Backspace`. Choose a different chord on those terminals.
:::

### Git Branch Switcher

Branches on the left with their age and last commit subject, the branch's recent log on the right, and `Enter` to switch:

```nu
def "git switch-ui" [] {
    let branches = ^git branch --format="%(refname:short)|%(committerdate:relative)|%(subject)"
        | lines
        | parse "{name}|{when}|{subject}"
    let r = $branches
        | tui label --title "branches"
        | tui search --bind / --fuzzy --columns [name]
        | tui split --sizes [45% 1fr] [
            (tui table --columns [name when subject])
            (tui preview {|b| ^git log --color=always --oneline -20 $b.name })
          ]
        | tui label --status "/: filter  enter: switch  q: cancel"
        | tui run
    if $r.action == "submit" {
        ^git switch $r.selected.name
    }
}
```

The preview closure takes the highlighted row, so the log pane changes as you move, and `--color=always` keeps git's colors.

::: tip
Use `^git` in scripts like this one. If you load git completions, `git branch` may be an [`extern`](externs.md) with its own flag list, and Nushell then checks `--format=` against that signature. `^git` always runs the external binary directly.
:::

### Process Monitor

A `ps` view that refreshes every two seconds, filters by name, shows the full record of the highlighted process, and kills it with `Ctrl+K`:

```nu
def "ps ui" [] {
    let snapshot = {|| ps | sort-by cpu -r | update cpu { math round -p 1 } | first 200 }
    do $snapshot
    | tui label --title "processes"
    | tui search --bind / --columns [name]
    | tui split --sizes [1fr 44] [
        (tui table --columns [pid name cpu mem])
        (tui preview {|p| $p | transpose field value | table -w $env.TUI_WIDTH })
      ]
    | tui bind ctrl+k {|s| kill $s.selected.pid; do $snapshot }
    | tui label --status "/: filter  ctrl+k: kill  enter: pick  q: quit"
    | tui run --refresh 2sec $snapshot
    | get selected?
}
```

The same closure feeds the first frame, the timer, and the reload after a kill, so the list is always sorted the same way.

### Explore a Data File

Open a JSON, TOML, YAML, or NUON file as a tree, filter its keys, and see the highlighted node rendered as a table:

```nu
def "explore-data" [file: path] {
    open $file
    | tui label --title ($file | path basename)
    | tui search --bind /
    | tui split --sizes [40% 1fr] [
        (tui tree)
        (tui preview {|node| $node | table -e -w $env.TUI_WIDTH })
      ]
    | tui label --status "right/left: open and close  /: filter  enter: pick  q: quit"
    | tui run
    | get selected?
}

explore-data Cargo.toml
```

`Enter` returns the value of the highlighted node, so pointing at a nested field and pressing `Enter` reads it.
