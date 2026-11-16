# Understanding the difference between `get` and `select`

In short, [`get`](/commands/docs/get.md) extracts _values_ from its input, while [`select`](/commands/docs/select.md) keeps the _structure_ of its input (a record stays a record, a table stays a table) and only removes the parts you did not ask for.

`get` extracts the value and returns a single value or list if multiple keys have been specified.

```nu
{a: 1, b: 2, c: 3} | get b
# => 2
{a: 1, b: 2, c: 3} | get b c
# => ╭───┬───╮
# => │ 0 │ 2 │
# => │ 1 │ 3 │
# => ╰───┴───╯
```

`select` maintains the nushell values and returns the records selected by column name or key.

```nu
{a: 1, b: 2, c: 3} | select b
# => ╭───┬───╮
# => │ b │ 2 │
# => ╰───┴───╯
{a: 1, b: 2, c: 3} | select b c
# => ╭───┬───╮
# => │ b │ 2 │
# => │ c │ 3 │
# => ╰───┴───╯
```

## With tables

The examples below use this table:

```nu
let t = [[name lang]; [nushell rust] [reedline rust] [vscode-ext typescript]]
```

For a column, `get` returns a list of the column's values, while `select` returns a table with only that column:

```nu
$t | get name
# => ╭───┬────────────╮
# => │ 0 │ nushell    │
# => │ 1 │ reedline   │
# => │ 2 │ vscode-ext │
# => ╰───┴────────────╯
$t | select name
# => ╭───┬────────────╮
# => │ # │    name    │
# => ├───┼────────────┤
# => │ 0 │ nushell    │
# => │ 1 │ reedline   │
# => │ 2 │ vscode-ext │
# => ╰───┴────────────╯
```

For a row index, `get` returns the row as a record, while `select` returns a table with only that row:

```nu
$t | get 1
# => ╭──────┬──────────╮
# => │ name │ reedline │
# => │ lang │ rust     │
# => ╰──────┴──────────╯
$t | select 1
# => ╭───┬──────────┬──────╮
# => │ # │   name   │ lang │
# => ├───┼──────────┼──────┤
# => │ 0 │ reedline │ rust │
# => ╰───┴──────────┴──────╯
```

## Nested data

Both commands take cell paths. `get` follows the path and returns the value at the end of it. `select` keeps a column for the path, named after the whole path:

```nu
{a: {b: 1}} | get a.b
# => 1
{a: {b: 1}} | select a.b
# => ╭─────┬───╮
# => │ a.b │ 1 │
# => ╰─────┴───╯
```

## Missing data

Both commands raise an error when a column does not exist. Add `?` to a cell-path member, or pass `--optional` (`-o`) to make every member optional. `get` then returns `null`, and `select` returns an empty cell:

```nu
{a: 1} | get -o z | describe
# => nothing
{a: 1} | select -o z
# => ╭───┬──╮
# => │ z │  │
# => ╰───┴──╯
```

Both commands also accept `--ignore-case` to match column names case-insensitively.

A `null` input has no columns, so `null | get name` is an error (`nothing doesn't support cell paths`). With `name?` or `-o`, it returns `null`.

## How many values `get` returns

The shape of `get`'s result depends on how many paths it was given:

- No path: the input is returned unchanged. `$data | get` is the same as `$data`.
- One path: the value at that path, not wrapped in a list.
- Several paths, or any spread (`...$paths`): a list with one value per path. A spread always gives a list, even when it holds one path, and an empty spread gives an empty list. Code that builds the path list at run time gets the same shape whatever its length:

```nu
let cols = [b]
{a: 1, b: 2} | get ...$cols
# => ╭───┬───╮
# => │ 0 │ 2 │
# => ╰───┴───╯
let cols = []
{a: 1, b: 2} | get ...$cols
# => ╭────────────╮
# => │ empty list │
# => ╰────────────╯
```

A string in a spread list is one column name, dots included. A list in a variable, such as `let p = [a.b]`, holds strings, so `get ...$p` looks for a column named `a.b`. For nested paths, spread a list of cell-path values written with `$.`:

```nu
let paths = [$.a.b]
{a: {b: 1}} | get ...$paths
# => ╭───┬───╮
# => │ 0 │ 1 │
# => ╰───┴───╯
```

A list literal written directly after `...` is parsed as cell paths, so `get ...[a.b]` follows the nested path, while `get ...["a.b"]` looks up the column `a.b`.

See also: [Filters to select subsets of data](./selecting_data.md), and [Using `get` and `select`](/book/navigating_structured_data.md#using-get-and-select) in the Book.
