# Filters to select subsets of data

Nushell has a small set of filters for taking part of a list or table: some select _rows_ by position, some select _columns_ by name, and cell paths reach into nested data. To select rows by a condition instead of a position, see [`where`](./where-filter.md).

See also: [Navigating and Accessing Structured Data](/book/navigating_structured_data.md) and [Working with Tables](/book/working_with_tables.md) in the Book, and [`get` vs. `select`](./select-get.md).

The examples below use this table:

```nu
let t = [
  [name lang stars];
  [nushell rust 38000]
  [reedline rust 700]
  [nu_scripts nushell 3000]
  [vscode-ext typescript 200]
]
```

## Rows by Position

| Command                                                          | Keeps                                                     |
| ---------------------------------------------------------------- | --------------------------------------------------------- |
| [`first n`](/commands/docs/first.md), [`last n`](/commands/docs/last.md) | The first or last `n` rows (without `n`: a single item, not a list) |
| [`take n`](/commands/docs/take.md), [`skip n`](/commands/docs/skip.md)   | The first `n` rows, or everything after them                   |
| [`drop n`](/commands/docs/drop.md)                               | Everything except the last `n` rows                       |
| [`slice range`](/commands/docs/slice.md)                         | The rows whose index is in the range                      |
| [`select 0 2 ...`](/commands/docs/select.md)                     | The rows with the given indices                           |
| [`drop nth 0 2 ...`](/commands/docs/drop_nth.md)                 | Every row except the given indices                        |
| [`take while`](/commands/docs/take_while.md), [`skip while`](/commands/docs/skip_while.md), [`take until`](/commands/docs/take_until.md), [`skip until`](/commands/docs/skip_until.md) | Rows up to, or from, the first row where a condition changes |

```nu
$t | first 2
# => ╭───┬──────────┬──────┬───────╮
# => │ # │   name   │ lang │ stars │
# => ├───┼──────────┼──────┼───────┤
# => │ 0 │ nushell  │ rust │ 38000 │
# => │ 1 │ reedline │ rust │   700 │
# => ╰───┴──────────┴──────┴───────╯
```

Ranges in `slice` include their end. Use `..<` to exclude it, and a negative start to count from the end:

```nu
[a b c d e] | slice 1..3
# => ╭───┬───╮
# => │ 0 │ b │
# => │ 1 │ c │
# => │ 2 │ d │
# => ╰───┴───╯
```

```nu
[a b c d e] | slice (-2)..
# => ╭───┬───╮
# => │ 0 │ d │
# => │ 1 │ e │
# => ╰───┴───╯
```

`first` and `last` without a count return `nothing` for empty input. Add `--strict` to make that an error instead.

## Columns by Name

- [`select`](/commands/docs/select.md) keeps the named columns and returns a table (or a record for record input).
- [`reject`](/commands/docs/reject.md) removes the named columns and keeps the rest.
- [`get`](/commands/docs/get.md) returns the _values_: a list for a table column, a plain value for a record field.

```nu
$t | select name stars | first 2
# => ╭───┬──────────┬───────╮
# => │ # │   name   │ stars │
# => ├───┼──────────┼───────┤
# => │ 0 │ nushell  │ 38000 │
# => │ 1 │ reedline │   700 │
# => ╰───┴──────────┴───────╯
```

```nu
$t | get name
# => ╭───┬────────────╮
# => │ 0 │ nushell    │
# => │ 1 │ reedline   │
# => │ 2 │ nu_scripts │
# => │ 3 │ vscode-ext │
# => ╰───┴────────────╯
```

To pass column names from a list, spread it with `...`. Passing the list itself is a type error:

```nu
let cols = [name stars]
$t | select ...$cols | first 1
# => ╭───┬─────────┬───────╮
# => │ # │  name   │ stars │
# => ├───┼─────────┼───────┤
# => │ 0 │ nushell │ 38000 │
# => ╰───┴─────────┴───────╯
```

## Cell Paths

A cell path is a dotted list of column names and row indices. It can follow a variable directly (`$t.0.name`), or be given to `get`, `select`, `reject`, `update`, `sort-by` and many other commands. Row and column members can come in either order:

```nu
[$t.0.name $t.name.0 ($t | get 1.name)]
# => ╭───┬──────────╮
# => │ 0 │ nushell  │
# => │ 1 │ nushell  │
# => │ 2 │ reedline │
# => ╰───┴──────────╯
```

With `select`, a nested cell path becomes a column named after the whole path:

```nu
{a: {b: {c: 1}}} | select a.b.c
# => ╭───────┬───╮
# => │ a.b.c │ 1 │
# => ╰───────┴───╯
```

Members that contain spaces or dots are quoted: `$record."first name"`. A cell path can also be stored in a variable with the `$.` literal syntax, e.g. `let p = $.a.b; $data | get $p`.

### Missing Data and Case

A missing column or row is an error. Add `?` after a member (or pass `--optional`/`-o` to `get`, `select` or `reject`) to get `null` instead:

```nu
{name: nu} | get version
# => Error: nu::shell::column_not_found
# =>
# =>   × Cannot find column 'version'
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ {name: nu} | get version
# =>    · ─────┬────       ───┬───
# =>    ·      │              ╰── column 'version' is missing in one or more values
# =>    ·      ╰── value originates here
# =>    ╰────
# =>   help: If some rows have this column, try using 'version?' for optional access, or pre-fill using the `default` command
```

```nu
{name: nu} | get version? | describe
# => nothing
```

Column names are matched case-sensitively. Add `!` after a member (or pass `--ignore-case` to `get`, `select` or `reject`) to match case-insensitively:

```nu
{Name: nu} | get name!
# => nu
```
