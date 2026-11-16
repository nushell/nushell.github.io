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
| [`every n`](/commands/docs/every.md)                             | Every `n`th row, starting with the first (with `--skip`, all the others) |
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

The end can be negative too, and a range that runs past the end of the input stops at the last item. A range that starts past the end, or ends before it starts, gives an empty list:

```nu
[a b c d e] | slice (-3)..-2
# => ╭───┬───╮
# => │ 0 │ c │
# => │ 1 │ d │
# => ╰───┴───╯
[a b c d e] | slice 3..10
# => ╭───┬───╮
# => │ 0 │ d │
# => │ 1 │ e │
# => ╰───┴───╯
```

[`drop nth`](/commands/docs/drop_nth.md) also takes a range as its first argument, open-ended or not, followed by more indices. Indices past the end are ignored. A range as _input_, such as `0..5 | drop nth 1`, comes back as a list:

```nu
[a b c d e f] | drop nth 1..3 5
# => ╭───┬───╮
# => │ 0 │ a │
# => │ 1 │ e │
# => ╰───┴───╯
[a b c d e f] | drop nth 3..
# => ╭───┬───╮
# => │ 0 │ a │
# => │ 1 │ b │
# => │ 2 │ c │
# => ╰───┴───╯
```

`select` with row indices returns each row once, in input order, whatever order the indices are given in. An index past the end is skipped. A row index can't be followed by more cell-path members, so `select 0.name` is an error; write `select 0 name`, which picks the row and then the column, or use `get 0.name` for the value:

```nu
[a b c d e] | select 3 1 1
# => ╭───┬───╮
# => │ 0 │ b │
# => │ 1 │ d │
# => ╰───┴───╯
```

### Counts and binary data

`first` and `last` without a count return a single item, `skip` and `drop` without a count remove one item, and `take` always needs a count. A negative count is an error for all five:

```nu
[a b c] | first (-1)
# => Error: nu::shell::needs_positive_value
# =>
# =>   × Negative value passed when positive one is required
# =>    ╭─[repl_entry #1:1:18]
# =>  1 │ [a b c] | first (-1)
# =>    ·                  ─┬
# =>    ·                   ╰── use a positive value
# =>    ╰────
```

`first` and `last` without a count return `nothing` for empty input. Add `--strict` to make that an error instead. For a range, `last n` returns a list.

The same five commands work on binary data: a `binary` value, or a byte stream such as the output of `open --raw` or an external command. There they count bytes, and the count can be a filesize like `2b` or `1kib` as well as an `int`. A filesize count with any other input is an error. Without a count, `first` and `last` return a single byte as an `int`:

```nu
0x[01 02 03 04 05] | first 2 | to nuon
# => 0x[0102]
0x[01 02 03 04 05] | skip 3b | to nuon
# => 0x[0405]
0x[01 02 03 04 05] | last
# => 5
```

### Taking or skipping by a condition

`take while` and `skip while` continue while the condition is exactly `true`. `take until` and `skip until` continue while it is exactly `false`. Any other result, including `null` or a value that isn't a `bool`, ends the run. A closure built on `if` without an `else` returns `null` on the other branch, so the run ends there:

```nu
[1 2 3 4] | take until {|x| if $x > 2 { true } }
# => ╭────────────╮
# => │ empty list │
# => ╰────────────╯
[1 2 3 4] | take until {|x| $x > 2 }
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => ╰───┴───╯
```

`take while` and `take until` accept `--include n` (`-i`), which keeps `n` more items after the point where they would stop. The first of those is the item that ended the run:

```nu
[1 2 3 4 5 6] | take until --include 1 $it > 3
# => ╭───┬───╮
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => │ 3 │ 4 │
# => ╰───┴───╯
```

Put `--include` before the condition. The condition takes everything after it, even when it's a closure, so a trailing `--include 1` is a parse error.

### Every nth row

`every n` keeps the rows at index 0, `n`, `2n` and so on. `--skip` (`-s`) returns the rows in between instead, so the two results together are the whole input. To start somewhere other than the first row, `skip` first:

```nu
[a b c d e f g] | every 3 | to nuon
# => [a, d, g]
[a b c d e f g] | every 3 --skip | to nuon
# => [b, c, e, f]
[a b c d e f g] | skip 1 | every 3 | to nuon
# => [b, e]
```

`every 0` is treated as `every 1`, so it keeps every row, and `every 0 --skip` returns an empty list. A negative stride is a `needs_positive_value` error. `every` reads a stream lazily. A range is rejected when the pipeline is parsed; a range literal has its own step instead, as in `0..3..12`.

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

`reject` takes the same kinds of arguments as `select`. Spread a list with `...$cols`, give row indices to remove items from a list or rows from a table, or give a nested cell path to remove a field inside a record while keeping the rest of it:

```nu
[a b c d] | reject 0 2
# => ╭───┬───╮
# => │ 0 │ b │
# => │ 1 │ d │
# => ╰───┴───╯
{db: {host: prod, password: x}, port: 1} | reject db.password | to nuon
# => {db: {host: prod}, port: 1}
```

### Column names and values

[`columns`](/commands/docs/columns.md) returns the column names of a record or table as a list of strings. For a table whose rows have different fields, it returns every name that appears in any row, in the order they first appear. [`values`](/commands/docs/values.md) is its counterpart. For a record it returns the field values in order. For a table it returns one list per column, in the same order as `columns`:

```nu
[[name size]; [a 1] [b 2]] | values | to nuon
# => [[a, b], [1, 2]]
[{a: 1} {b: 2, a: 3} {c: 4}] | columns | to nuon
# => [a, b, c]
[{a: 1} {b: 2, a: 3} {c: 4}] | values | to nuon
# => [[1, 3], [2], [4]]
```

`values` skips the rows that lack a column instead of filling in `null`, so a position in one of its lists no longer matches a row number. When the rows can have gaps, use `get a?` for each column, which keeps a `null` for every missing cell.

Both commands accept only a record or a table. A list that mixes records with other values is an `only_supports_this_input_type` error, and empty input gives an empty list. On a [SQLite database](#tables-from-a-sqlite-file) opened with `open`, `columns` lists the table names, and `values` returns the tables themselves, read in full.

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

## Tables from a SQLite file

When you [`open`](/commands/docs/open.md) a SQLite database and `get` one of its tables, Nushell doesn't read the table yet. It gives you a query that hasn't run, which `describe` shows as `SQLiteQueryBuilder`. A few filters add to that query, so SQLite does the work and only the rows you asked for are read:

| Command                                  | Becomes part of the SQL query as   |
| ---------------------------------------- | ---------------------------------- |
| `select` with plain column names         | the column list                    |
| `first n`                                | `LIMIT n`                          |
| `last n`                                 | the last `n` rows by `rowid`       |
| `skip n`                                 | `OFFSET n`                         |
| `length`                                 | `COUNT(*)`                         |
| `uniq` with no flags                     | `SELECT DISTINCT`                  |

`select` returns another query, so it can be followed by one of the others. The others run the query and return an ordinary table, or a number for `length`:

```nu
[[name age]; [Alice 30] [Bob 25] [Carol 41] [Bob 25]] | into sqlite people.db --table-name people
open people.db | get people | select name | describe
# => SQLiteQueryBuilder
open people.db | get people | select name | uniq
# => ╭───┬───────╮
# => │ # │ name  │
# => ├───┼───────┤
# => │ 0 │ Alice │
# => │ 1 │ Bob   │
# => │ 2 │ Carol │
# => ╰───┴───────╯
open people.db | get people | length
# => 4
```

Any other command, such as `where`, `take` or `each`, reads the whole table first and then works on the rows as usual. For large tables, filter with [`query db`](/commands/docs/query_db.md) and a SQL `WHERE` clause instead.
