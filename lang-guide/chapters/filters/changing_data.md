# Adding and changing data

These filters return a new list, table or record with something added, replaced, moved or reshaped. They never change a variable in place. [Working with Lists](/book/working_with_lists.md), [Working with Tables](/book/working_with_tables.md) and [Working with Records](/book/working_with_records.md) in the Book introduce them; this page gives the rules and edge cases.

## `append` and `prepend`

[`append`](/commands/docs/append.md) adds values to the end of its input, and [`prepend`](/commands/docs/prepend.md) adds them to the start. Both treat their argument the same way:

- A list argument is unwrapped, and its items are added one by one. To add a list as a single item, wrap it in another list.
- A range argument is expanded into its values.
- Any other value is added as one item.

```nu
let more = [3 4]
[1 2] | append $more | to nuon
# => [1, 2, 3, 4]
[1 2] | append [$more] | to nuon
# => [1, 2, [3, 4]]
[1 2] | append 3..5 | to nuon
# => [1, 2, 3, 4, 5]
```

The input doesn't have to be a list. A single value such as a string becomes the first item of a new list, and `null` becomes an empty list:

```nu
"a" | append b | to nuon
# => [a, b]
null | append x | to nuon
# => [x]
```

Appending a record to a table adds a row. Appending a table adds all of its rows.

## `insert`, `update` and `upsert`

All three take a cell path and a value. For a column, [`insert`](/commands/docs/insert.md) adds one that must not exist yet, [`update`](/commands/docs/update.md) replaces one that must exist, and [`upsert`](/commands/docs/upsert.md) does whichever applies. List indices work differently; see [List indices](#list-indices).

| Command  | Column doesn't exist yet  | Column already exists          |
| -------- | ------------------------- | ------------------------------ |
| `insert` | adds it                   | error: `Column already exists` |
| `update` | error: `column_not_found` | replaces it                    |
| `upsert` | adds it                   | replaces it                    |

```nu
{a: 1} | insert a 2
# => Error: nu::shell::column_already_exists
# =>
# =>   × Column already exists
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ {a: 1} | insert a 2
# =>    · ───┬──          ┬
# =>    ·    │            ╰── column 'a' already exists
# =>    ·    ╰── value originates here
# =>    ╰────
```

### What a closure receives

When the new value is a closure, its argument and its `$in` depend on the command and on whether the path is a column or a list index.

For a column, the closure runs once per row. Its argument is always the whole row. `$in` is:

- the whole row, for `insert`;
- the current value of the cell, for `update`;
- the current value of the cell, or `null` when the column is being added, for `upsert`.

```nu
[[a]; [1] [2]] | update a { $in * 10 }
# => ╭───┬────╮
# => │ # │ a  │
# => ├───┼────┤
# => │ 0 │ 10 │
# => │ 1 │ 20 │
# => ╰───┴────╯
[[a]; [1] [2]] | upsert b {|row| $row.a * 10 }
# => ╭───┬───┬────╮
# => │ # │ a │ b  │
# => ├───┼───┼────┤
# => │ 0 │ 1 │ 10 │
# => │ 1 │ 2 │ 20 │
# => ╰───┴───┴────╯
```

For a list index, the closure runs only once. Both its argument and `$in` are the value currently at that index, or `null` when the index is one past the end. With `insert`, that is the item that will move one place to the right:

```nu
[a b c] | insert 1 {|item| $item | str uppercase }
# => ╭───┬───╮
# => │ 0 │ a │
# => │ 1 │ B │
# => │ 2 │ b │
# => │ 3 │ c │
# => ╰───┴───╯
```

### List indices

`insert` at an index puts the new item there and moves the rest one place to the right. `upsert` at an existing index replaces the item. Both accept any index up to the length of the list, so the index just past the last item appends. A larger index is an error. `update` only accepts indices of existing items:

```nu
[a b c] | upsert 3 d | to nuon
# => [a, b, c, d]
[a b c] | insert 5 x
# => Error: nu::shell::access_beyond_end
# =>
# =>   × Inserted at wrong row number (should be 3).
# =>    ╭─[repl_entry #1:1:18]
# =>  1 │ [a b c] | insert 5 x
# =>    ·                  ┬
# =>    ·                  ╰── can't insert at index (the next available index is 3)
# =>    ╰────
[a b c] | update 5 x
# => Error: nu::shell::access_beyond_end
# =>
# =>   × Row number too large (max: 2).
# =>    ╭─[repl_entry #1:1:18]
# =>  1 │ [a b c] | update 5 x
# =>    ·                  ┬
# =>    ·                  ╰── index too large (max: 2)
# =>    ╰────
```

### Nested paths

`insert` and `upsert` create whatever the rest of a nested path needs: a record for a column name, and a list for an index. This works on records as well as tables:

```nu
{name: nu} | upsert info.lang rust | to nuon
# => {name: nu, info: {lang: rust}}
{} | insert a.0.b 1 | to nuon
# => {a: [[b]; [1]]}
```

`update` follows the path and fails at the first part that is missing.

### Matrices

`update` also accepts a `matrix` value (from [`into matrix`](/commands/docs/into_matrix.md)). The path is a row index, or a row and a column such as `0.1`, and the result is still a matrix. The new values have to convert to floats:

```nu
[[1 2] [3 4]] | into matrix | update 0.1 9 | matrix into-nu | to nuon
# => [[1.0, 9.0], [3.0, 4.0]]
```

Replacing a whole row with a list of a different length is an `Inconsistent row lengths` error. The `matrix` commands have their own ways to change rows and columns; see [Matrices](../matrices.md).

## `update cells`

[`update cells`](/commands/docs/update_cells.md) runs a closure on every cell of a table or record and puts the result in its place. `update` changes one column, and its closure gets the whole row as its argument. The closure of `update cells` gets only the cell, as its argument and as `$in`, and runs for every column. Column names after the closure limit it to those columns:

```nu
[[name size count]; [a 0 3] [b 12 0]] | update cells { if $in == 0 { null } else { $in } } size count
# => ╭───┬──────┬──────┬───────╮
# => │ # │ name │ size │ count │
# => ├───┼──────┼──────┼───────┤
# => │ 0 │ a    │      │     3 │
# => │ 1 │ b    │   12 │       │
# => ╰───┴──────┴──────┴───────╯
```

A name that isn't a column is ignored, not an error. An empty list of names, as in `...[]`, updates no columns; only leaving the names out updates them all. The `--columns` (`-c`) flag takes the names as a list. It is deprecated since 0.117.0 in favor of the rest arguments, and names given both ways are combined.

A cell that holds a record or a list goes to the closure whole. `--recursive` (`-r`) walks into nested records and lists instead, and runs the closure on each value inside them. Column names still apply only at the top level, and everything below a named column is visited:

```nu
{name: x, tags: [a b]} | update cells { $in | describe } | to nuon
# => {name: string, tags: list<string>}
{name: x, tags: [a b]} | update cells --recursive { str uppercase } | to nuon
# => {name: X, tags: [A, B]}
```

`update cells` streams a table row by row. To visit every nested value of a record together with its cell path, see [`record walk`](./record_commands.md#record-walk).

## Moving and renaming columns

[`move`](/commands/docs/move.md) takes one or more column names and exactly one location: `--after <column>`, `--before <column>`, `--first` or `--last`. It works on a record or on every row of a table. The moved columns end up in the order you list them, not their original order:

```nu
{a: 1, b: 2, c: 3, d: 4} | move d --first | to nuon
# => {d: 4, a: 1, b: 2, c: 3}
{a: 1, b: 2, c: 3, d: 4} | move d a --after b | to nuon
# => {b: 2, d: 4, a: 1, c: 3}
```

A column that doesn't exist, as a column to move or as the `--after`/`--before` target, is an error (`Cannot move columns`, `column does not exist`). So is leaving out the location, giving more than one, or moving a column relative to itself.

[`rename`](/commands/docs/rename.md) has three forms:

- New names as arguments rename the columns by position. With fewer names than columns, only the leading columns are renamed. Extra names are ignored.
- `--column {old: new}` (`-c`) renames by name. A name that isn't in the input is an error.
- `--block` (`-b`) runs a closure on every column name and uses its result. The name is the closure's argument and its `$in`.

```nu
{a: 1, b: 2, c: 3} | rename x y | to nuon
# => {x: 1, y: 2, c: 3}
{a: 1, b: 2, c: 3} | rename --column {b: B} | to nuon
# => {a: 1, B: 2, c: 3}
{first_name: a, last_name: b} | rename --block { str replace _name "" } | to nuon
# => {first: a, last: b}
```

## Combining tables

### `merge`

[`merge`](/commands/docs/merge.md) combines its input with its argument column by column. The input and the argument must both be records, or both be tables. Mixing them is an error:

```nu
{a: 1} | merge [[b]; [2]]
# => Error: nu::shell::only_supports_this_input_type
# =>
# =>   × Input type not supported.
# =>    ╭─[repl_entry #1:1:1]
# =>  1 │ {a: 1} | merge [[b]; [2]]
# =>    · ───┬──   ──┬──
# =>    ·    │       ╰── only input and argument to be both record or both table input data is supported
# =>    ·    ╰── input type: record<a: int> and table<b: int>
# =>    ╰────
```

When both have a column, the argument's value wins. The replacement is shallow, so a nested record in the argument replaces the whole nested record. Use [`merge deep`](/commands/docs/merge_deep.md) to merge nested records field by field:

```nu
{a: 1, b: 2} | merge {b: 20, c: 30} | to nuon
# => {a: 1, b: 20, c: 30}
{server: {host: a, port: 1}} | merge {server: {port: 2}} | to nuon
# => {server: {port: 2}}
{server: {host: a, port: 1}} | merge deep {server: {port: 2}} | to nuon
# => {server: {host: a, port: 2}}
```

Tables are merged row by row. See [Merging tables of different size](/cookbook/tables.md#merging-tables-of-different-size) when the row counts differ.

### `merge deep`

[`merge deep`](/commands/docs/merge_deep.md) follows nested records down and merges them field by field, so it suits layering one configuration record over another. As with `merge`, the input and the argument must both be records or both be tables. Fields keep their order from the input, and new fields from the argument go at the end. Where the two values at a key aren't both records, the argument's value replaces the input's, even when one is a record and the other a number.

Lists depend on `--strategy` (`-s`):

- `table`, the default, merges two lists of records row by row, the way `merge` merges tables. Any other list, such as a list of strings, is replaced.
- `overwrite` replaces every list.
- `append` adds the argument's items after the input's, and `prepend` puts them before. This works for lists of records too.

Any other strategy name is an `incorrect_value` error. With these two records:

```nu
let defaults = {server: {host: localhost, port: 80}, plugins: [git], users: [{name: ann, admin: false}]}
let override = {server: {port: 8080}, plugins: [docker], users: [{admin: true}]}
$defaults | merge deep $override | to nuon
# => {server: {host: localhost, port: 8080}, plugins: [docker], users: [[name, admin]; [ann, true]]}
```

`server` is merged the same way with every strategy. The lists come out like this:

| `--strategy`      | `plugins`       | `users`                                      |
| ----------------- | --------------- | -------------------------------------------- |
| `table` (default) | `[docker]`      | `[{name: ann, admin: true}]`                 |
| `overwrite`       | `[docker]`      | `[{admin: true}]`                            |
| `append`          | `[git, docker]` | `[{name: ann, admin: false}, {admin: true}]` |
| `prepend`         | `[docker, git]` | `[{admin: true}, {name: ann, admin: false}]` |

The row-by-row merge of the `table` strategy keeps the number of rows in the input. Extra rows in the argument are dropped, and an empty list counts as a list of records, so an empty list in the input stays empty. Use `append` or `overwrite` when the argument may have more rows:

```nu
{users: []} | merge deep {users: [{name: bob}]} | to nuon
# => {users: []}
{users: []} | merge deep --strategy append {users: [{name: bob}]} | to nuon
# => {users: [[name]; [bob]]}
```

Two tables at the top level follow the same rules. `table` merges them row by row, and `append` or `prepend` joins their rows into one list.

### `join`

[`join`](/commands/docs/join.md) matches rows by the values in a column. When the right table has a column with the same name as one in the left table, the right one gets a `_` suffix. A join column that both tables share appears once and isn't renamed.

`--prefix` (`-p`) and `--suffix` (`-s`) work differently. They add their text to every column of the right table except a shared join column, whether its name clashes or not, and the default `_` isn't added:

```nu
let users = [[id name]; [1 alice] [2 bob]]
let devices = [[id name os]; [1 laptop linux] [1 phone android]]
$users | join $devices id
# => ╭───┬────┬───────┬────────┬─────────╮
# => │ # │ id │ name  │ name_  │   os    │
# => ├───┼────┼───────┼────────┼─────────┤
# => │ 0 │  1 │ alice │ laptop │ linux   │
# => │ 1 │  1 │ alice │ phone  │ android │
# => ╰───┴────┴───────┴────────┴─────────╯
$users | join --prefix device_ $devices id
# => ╭───┬────┬───────┬─────────────┬───────────╮
# => │ # │ id │ name  │ device_name │ device_os │
# => ├───┼────┼───────┼─────────────┼───────────┤
# => │ 0 │  1 │ alice │ laptop      │ linux     │
# => │ 1 │  1 │ alice │ phone       │ android   │
# => ╰───┴────┴───────┴─────────────┴───────────╯
```

If either table has rows but none of them has its join column, `join` reports `column_not_found`, even with `--left`, `--right`, `--outer` or `--anti`. This catches a misspelled column name. An empty table passes the check, and rows that lack the column in a table where other rows have it join as non-matching rows. When a table can legitimately lack the column, add it with `default null <column>` first:

```nu
[[id name]; [1 alice] [2 bob]] | join --left [{note: x}] id
# => Error: nu::shell::column_not_found
# =>
# =>   × Cannot find column 'id'
# =>    ╭─[repl_entry #1:1:58]
# =>  1 │ [[id name]; [1 alice] [2 bob]] | join --left [{note: x}] id
# =>    ·                                                          ─┬
# =>    ·                                                           ╰── no row in the right table has this column
# =>    ╰────
# =>   help: Check the column name. To join a table whose rows lack the column, add
# =>         it first, for example with `default null <column>`
[[id name]; [1 alice] [2 bob]] | join --left ([{note: x}] | default null id) id
# => ╭───┬────┬───────┬──────╮
# => │ # │ id │ name  │ note │
# => ├───┼────┼───────┼──────┤
# => │ 0 │  1 │ alice │      │
# => │ 1 │  2 │ bob   │      │
# => ╰───┴────┴───────┴──────╯
```

## Pairing and interleaving lists

### `zip`

[`zip`](/commands/docs/zip.md) pairs the items of its input with the items of its argument, by position, and returns a list of two-item lists. It stops at the end of the shorter side, so extra items on either side are dropped:

```nu
[a b c] | zip [1 2] | to nuon
# => [[a, 1], [b, 2]]
[a b] | zip [1 2] | into record | to nuon
# => {a: 1, b: 2}
```

The input can be a list, a range or a stream, but not a record. The argument can be a list or range, or a closure whose output is used. The closure runs once, without input, and its output is read only as far as the input goes, so an endless range works:

```nu
[a b c] | zip { 1.. } | each {|p| $"($p.1). ($p.0)" } | to nuon
# => ["1. a", "2. b", "3. c"]
```

Any other argument, such as a number, counts as a list of one item, so it pairs with the first input item only. Zipping two tables gives pairs of records. To join each pair into one row, merge them: `each {|p| $p.0 | merge $p.1 }`. For two tables, [`merge`](#merge) does that directly. To alternate the items of two lists, flatten the pairs: `[a b c] | zip [1 2 3] | flatten` gives `[a, 1, b, 2, c, 3]`.

### `interleave`

[`interleave`](/commands/docs/interleave.md) runs each of its closures at the same time, each in its own thread, and merges everything they output into one stream. Its input, if there is any, is one more source. The closures get no input. Items come out as soon as any source produces them, so the order between sources changes from run to run, while the items of each source keep their order:

```nu
interleave { [a1 a2 a3] } { [b1 b2 b3] } | where $it starts-with a | to nuon
# => ["a1", "a2", "a3"]
```

Use it to read the output of several slow commands, such as externals, as it arrives. Pipe an external's output through `lines` inside the closure, or its text arrives as one string or as chunks that don't follow line breaks. If a closure fails before it produces any output, `interleave` fails with that error. To alternate items in a fixed order instead, use `zip` and `flatten` as shown above.

All sources feed one shared queue. `--buffer-size` (`-b`) sets how many items can wait in it before the sources have to pause. The default is 0, so each source waits until its item is taken. A larger buffer uses more memory and can speed up sources that produce a lot of output.

## Reshaping

### `flatten`

[`flatten`](/commands/docs/flatten.md) works one level at a time:

- A nested list in a list is spliced into the outer list.
- A column that holds a list expands into one row per element, repeating the other columns. Only one such column can be expanded per call. With several, `flatten` fails with `can only flatten one inner list at a time`, so name the column to expand: `flatten tags`.
- A column that holds a record has its fields lifted into the row, and the parent column goes away.
- A column that holds a table expands into one row per inner row, but each inner row stays a record. `--all` (`-a`) also lifts the fields of those inner records, so a nested table becomes plain columns.

Column-name arguments limit flattening to those columns. A record input is treated as a one-row table, so the result is always a table:

```nu
{name: nu, tags: [shell rust]} | flatten
# => ╭───┬──────┬───────╮
# => │ # │ name │ tags  │
# => ├───┼──────┼───────┤
# => │ 0 │ nu   │ shell │
# => │ 1 │ nu   │ rust  │
# => ╰───┴──────┴───────╯
[[origin people]; [Ecuador [[name meal]; [Andres arepa] [Maria empanada]]]] | flatten --all
# => ╭───┬─────────┬────────┬──────────╮
# => │ # │ origin  │  name  │   meal   │
# => ├───┼─────────┼────────┼──────────┤
# => │ 0 │ Ecuador │ Andres │ arepa    │
# => │ 1 │ Ecuador │ Maria  │ empanada │
# => ╰───┴─────────┴────────┴──────────╯
```

When a lifted field has the same name as a column that stays, it is renamed to `<parent>_<field>`. If that new name is also taken, `flatten` stops with `column_defined_twice`:

```nu
{a: {b: 1, c: 2}, c: 3} | flatten
# => ╭───┬───┬─────┬───╮
# => │ # │ b │ a_c │ c │
# => ├───┼───┼─────┼───┤
# => │ 0 │ 1 │   2 │ 3 │
# => ╰───┴───┴─────┴───╯
{a: {b: 1}, b: 2, a_b: 3} | flatten
# => Error: nu::shell::column_defined_twice
# =>
# =>   × Record field or table column used twice: a_b
# =>    ╭─[repl_entry #1:1:9]
# =>  1 │ {a: {b: 1}, b: 2, a_b: 3} | flatten
# =>    ·         ┬              ┬
# =>    ·         │              ╰── field redefined here
# =>    ·         ╰── field first defined here
# =>    ╰────
```

### `wrap`

[`wrap`](/commands/docs/wrap.md) puts each item of a list or range into a one-column table. A single value that isn't a list becomes a record with one field:

```nu
1..3 | wrap n
# => ╭───┬───╮
# => │ # │ n │
# => ├───┼───┤
# => │ 0 │ 1 │
# => │ 1 │ 2 │
# => │ 2 │ 3 │
# => ╰───┴───╯
42 | wrap answer
# => ╭────────┬────╮
# => │ answer │ 42 │
# => ╰────────┴────╯
```

### `transpose`

[`transpose`](/commands/docs/transpose.md) swaps rows and columns. The column names of the input become the first column of the output, and the new columns are called `column0`, `column1`, and so on. Name arguments replace those names in order, and any columns left over keep the default names:

```nu
{a: 1, b: 2} | transpose
# => ╭───┬─────────┬─────────╮
# => │ # │ column0 │ column1 │
# => ├───┼─────────┼─────────┤
# => │ 0 │ a       │       1 │
# => │ 1 │ b       │       2 │
# => ╰───┴─────────┴─────────╯
```

The flags control what happens to the names:

- `--ignore-titles` (`-i`) drops the input's column names instead of turning them into a column.
- `--header-row` (`-r`) uses the values in the first input column as the new column names.
- `--as-record` (`-d`) returns a record instead of a table when the result has exactly one row. Together with `-r`, this turns a key/value table back into a record.
- With `-r`, a name that appears more than once keeps its first value. `--keep-last` (`-l`) keeps the last value instead, and `--keep-all` (`-a`) keeps every value in a list.

```nu
[[key value]; [name nu] [lang rust]] | transpose --header-row --as-record
# => ╭──────┬──────╮
# => │ name │ nu   │
# => │ lang │ rust │
# => ╰──────┴──────╯
[[key value]; [tag a] [tag b]] | transpose -r -d --keep-all | to nuon
# => {tag: [a, b]}
```

### `rotate`

[`rotate`](/commands/docs/rotate.md) also swaps rows and columns, but it turns the table a quarter turn, so the order of the data changes too. By default it turns clockwise, so the last input row becomes the first column and the column names end up in the last column. `--ccw` turns the other way. The column names come first, the rows keep their order, and the last input column becomes the first row:

```nu
[[name size]; [x 1] [y 2]] | rotate
# => ╭───┬─────────┬─────────┬─────────╮
# => │ # │ column0 │ column1 │ column2 │
# => ├───┼─────────┼─────────┼─────────┤
# => │ 0 │ y       │ x       │ name    │
# => │ 1 │       2 │       1 │ size    │
# => ╰───┴─────────┴─────────┴─────────╯
[[name size]; [x 1] [y 2]] | rotate --ccw field first second | to nuon
# => [[field, first, second]; [size, 1, 2], [name, x, y]]
```

As with `transpose`, name arguments replace `column0`, `column1` and so on, in order, and extra names are ignored. A record is rotated as a one-row table. A list of plain values, or a single string, becomes a one-row table with an item in each column, in reverse order unless you pass `--ccw`. Empty input is an error (`list input is empty`).

Every row must have the same columns. A row with a different number of columns is a `record_cols_vals_mismatch` error. Give `rotate` a table, a record, or a list of plain values. It doesn't treat nested lists as rows, and `[[1 2] [3 4]] | rotate` is the same `record_cols_vals_mismatch` error. Turn each inner list into a record first:

```nu
[[1 2] [3 4]] | each {|r| {x: $r.0, y: $r.1} } | rotate | to nuon
# => [["column0", "column1", "column2"]; [3, 1, x], [4, 2, y]]
```

To turn a record into key/value rows, `transpose key value` is usually what you want, since it keeps the names in the first column.

### `roll`

The `roll` commands move rows or columns around in a circle. [`roll up`](/commands/docs/roll_up.md) moves the first row of a table to the end, and [`roll down`](/commands/docs/roll_down.md) moves the last row to the front. [`roll left`](/commands/docs/roll_left.md) and [`roll right`](/commands/docs/roll_right.md) do the same with the columns of a record, or of each row of a table separately. `roll` by itself only prints its help text.

`--by` (`-b`) sets how many places to move. The default is 1. A count larger than the number of rows or columns wraps around, `--by 0` changes nothing, and a negative count is an error. An empty table or record comes back unchanged:

```nu
[[step]; [build] [test] [deploy]] | roll down | to nuon
# => [[step]; [deploy], [build], [test]]
[[step]; [build] [test] [deploy]] | roll up --by 4 | to nuon
# => [[step]; [test], [deploy], [build]]
```

`roll left` and `roll right` move each column together with its name, so only the column order changes. With `--cells-only` (`-c`), the names stay where they are and only the values move, so each value ends up under a different name:

```nu
{name: nu, lang: rust, stars: 38000} | roll left | to nuon
# => {lang: rust, stars: 38000, name: nu}
{name: nu, lang: rust, stars: 38000} | roll left --cells-only | to nuon
# => {name: rust, lang: 38000, stars: nu}
```

`roll up` and `roll down` take a table. A list such as `[1 2 3]` is rejected when the pipeline is parsed, so wrap it first: `[1 2 3] | wrap n | roll up | get n`.
