# Summarizing and comparing lists

These commands turn a list or table into a single answer (a `bool`, a count, a total), remove duplicates, compare two lists as sets, or split a list into groups. [Working with Lists](/book/working_with_lists.md) in the Book introduces most of them; this page gives the rules and edge cases.

## `all` and `any`

[`all`](/commands/docs/all.md) checks that every item matches a condition, and [`any`](/commands/docs/any.md) checks that at least one does. Both take a closure or a row condition.

- For empty input, `all` returns `true` and `any` returns `false`.
- They stop at the first item that settles the answer. For `all` that is the first item that doesn't match, and for `any` the first one that does. Later items are never checked, so side effects in the closure don't run for them.
- Only `true` counts as a match. A result that isn't a `bool`, such as a string or `null`, counts as `false` without an error.
- An empty closure, `{}`, returns its input unchanged, so `any {}` and `all {}` test the items themselves.
- The input has to be a list or a table. A range or a single value is a type error, `Command does not support range input` (or `int input`, and so on). For a run of numbers, make a list with [`seq`](/commands/docs/seq.md).

```nu
[1 2 3] | all {|x| print $"checking ($x)"; $x < 2 }
# => checking 1
# => checking 2
# => false
[a b] | all {|x| "yes" }
# => false
[false true] | any {}
# => true
seq 1 5 | any {|x| $x > 3 }
# => true
```

## `length` and `is-empty`

[`length`](/commands/docs/length.md) counts the items of a list or the rows of a table. For a `binary` value or a byte stream, it counts bytes. `null` has length `0`. Any other input is a type error. For a record, count its fields with `columns | length`, and for a string, use [`str length`](/commands/docs/str_length.md):

```nu
0x[01 02 03] | length
# => 3
null | length
# => 0
{a: 1, b: 2} | columns | length
# => 2
```

[`is-empty`](/commands/docs/is-empty.md) returns `true` for `null`, an empty string, list, record or binary value. Zero and `false` are not empty. For a stream, `is-empty` only reads the first item, so a long or endless stream isn't consumed:

```nu
[1 2 3] | each {|x| print $"made ($x)"; $x } | is-empty
# => made 1
# => false
```

Given column names, `is-empty` checks those columns of a record or table instead, and the rule changes. Only `null` counts as empty, not `""`. The result is `true` only when every named column is `null` in every row. A column that doesn't exist is a `column_not_found` error:

```nu
[[a b]; [null x] [null ""]] | is-empty a
# => true
[[a b]; [null x] [null ""]] | is-empty a b
# => false
```

[`is-not-empty`](/commands/docs/is-not-empty.md) always returns the opposite of `is-empty` with the same arguments, so the same rules apply. It saves wrapping the pipeline in `not ( ... )`, for example in a `where` closure. Without column names, `""` counts as empty, so this keeps only the rows with a real address:

```nu
[[name email]; [a "a@x.org"] [b null] [c ""]] | where { $in.email | is-not-empty } | get name | to nuon
# => [a]
```

With column names, only `null` counts as empty, so `is-not-empty` returns `true` as soon as any named column in any row holds something else, even `""`. The check stops at that row. A missing column is a `column_not_found` error, as with `is-empty`.

## `reduce`

[`reduce`](/commands/docs/reduce.md) combines the items into one value. The closure gets the current item and the accumulator, in that order, and returns the new accumulator. The accumulator is also passed as `$in`. A range works as input like a list.

Without `--fold`, the first item is the starting accumulator, so the closure first runs on the second item. A one-item list returns that item without running the closure, and an empty list is an error. With `--fold`, the closure runs on every item, and an empty list returns the fold value:

```nu
[1 2 3] | reduce {|it, acc| print $"acc=($acc) it=($it)"; $acc + $it }
# => acc=1 it=2
# => acc=3 it=3
# => 6
[] | reduce {|it, acc| $acc + $it }
# => Error: nu::shell::error
# =>
# =>   × Expected input
# =>    ╭─[repl_entry #1:1:6]
# =>  1 │ [] | reduce {|it, acc| $acc + $it }
# =>    ·      ───┬──
# =>    ·         ╰── needs input
# =>    ╰────
[] | reduce --fold 0 {|it, acc| $acc + $it }
# => 0
[1 2 3] | reduce --fold 10 {|it| $in + $it }
# => 16
```

## `math sum` and `math avg`

[`math sum`](/commands/docs/math_sum.md) and [`math avg`](/commands/docs/math_avg.md) work on a list of numbers, durations or filesizes, and on a range. The result has the type of the items, except that the average of integers is a `float`:

```nu
[1sec 90sec] | math sum
# => 1min 31sec
[1kb 2kb 4kb] | math avg
# => 2.3 kB
1..4 | math avg
# => 2.5
```

A table gives a record with one result per column, and a record gives one result per field. A field that holds a list gets the total or average of that list.

Every column has to hold numbers, durations or filesizes, so a table with a text column fails. Name the columns to use as arguments. These are cell paths, so a nested path such as `a.b` works too:

```nu
[[name size]; [a 1kb] [b 3kb]] | math sum
# => Error: nu::shell::only_supports_this_input_type
# =>
# =>   × Input type not supported.
# =>    ╭─[repl_entry #1:1:16]
# =>  1 │ [[name size]; [a 1kb] [b 3kb]] | math sum
# =>    ·                ┬                 ────┬───
# =>    ·                │                     ╰── only int, float, filesize, or duration input data is supported
# =>    ·                ╰── input type: string
# =>    ╰────
[[name size]; [a 1kb] [b 3kb]] | math sum size
# => ╭──────┬────────╮
# => │ size │ 4.0 kB │
# => ╰──────┴────────╯
```

Both commands also fail on an empty list (`Empty input`) and on a list that mixes kinds of values, such as numbers and durations. Integers and floats mix fine.

## `uniq`

[`uniq`](/commands/docs/uniq.md) keeps the first of each group of equal values. It compares whole values, so table rows are compared as whole records. Two records with the same fields in a different order count as equal, while `1`, `1.0` and `"1"` are three different values:

```nu
[{a: 1, b: 2} {b: 2, a: 1} {a: 1, b: 3}] | uniq
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 1 │ 2 │
# => │ 1 │ 1 │ 3 │
# => ╰───┴───┴───╯
```

The flags change what comes back:

- `--count` (`-c`) returns a table of each distinct `value` and its `count`.
- `--repeated` (`-d`) returns only the values that appear more than once, and `--unique` (`-u`) only those that appear exactly once.
- `--ignore-case` (`-i`) compares strings without regard to case, and keeps the first spelling it saw.
- `--keep-last` (`-l`) keeps the last value of each group, in the position of the first. Without `--ignore-case` the values in a group are equal, so you rarely see a difference unless you combine the two.

```nu
[a b a c a b] | uniq --count
# => ╭───┬───────┬───────╮
# => │ # │ value │ count │
# => ├───┼───────┼───────┤
# => │ 0 │ a     │     3 │
# => │ 1 │ b     │     2 │
# => │ 2 │ c     │     1 │
# => ╰───┴───────┴───────╯
[a b a c a b] | uniq --unique | to nuon
# => [c]
[Hello HELLO hello] | uniq --ignore-case --keep-last | to nuon
# => [hello]
```

To compare rows by some columns only, use `uniq-by`. On a [table from a SQLite file](./selecting_data.md#tables-from-a-sqlite-file), a plain `uniq` runs as `SELECT DISTINCT`.

## `uniq-by`

[`uniq-by`](/commands/docs/uniq-by.md) compares rows by the columns you name and keeps the whole first row of each group. Two rows match when all the named columns are equal, compared the same way `uniq` compares values:

```nu
let hosts = [[host os]; [web1 linux] [web2 linux] [db1 bsd] [web3 linux]]
$hosts | uniq-by os | to nuon
# => [[host, os]; ["web1", linux], ["db1", bsd]]
```

It takes the same flags as `uniq`, applied to the named columns. `--keep-last` keeps the last row of each group in the place of the first, and `--repeated` and `--unique` return the rows whose values appear more than once or exactly once. With `--ignore-case`, string columns are compared without regard to case. With `--count`, the `value` column holds the kept row, not just the compared columns:

```nu
$hosts | uniq-by os --keep-last | to nuon
# => [[host, os]; ["web3", linux], ["db1", bsd]]
$hosts | uniq-by os --count | to nuon
# => [[value, count]; [{host: "web1", os: linux}, 3], [{host: "db1", os: bsd}, 1]]
```

At least one column name is required. The names are plain column names, not cell paths, so `a.b` means a column called `a.b`. Every row must have every named column, or `uniq-by` fails with `column_not_found`. Fill gaps first with `default`. A list of plain values has no columns, so use `uniq` for it.

## `union`, `intersect` and `difference`

[`union`](/commands/docs/union.md), [`intersect`](/commands/docs/intersect.md) and [`difference`](/commands/docs/difference.md) compare values the same way `uniq` does. A table row matches only when the whole row matches, in any field order. Values of different types never match, so `[1 2] | union [1.0 2.0]` keeps all four. The results have no duplicates and keep the order in which items first appear:

```nu
let old = [[name ver]; [nu 1] [rl 2]]
let new = [[name ver]; [nu 1] [rl 3]]
$new | difference $old
# => ╭───┬──────┬─────╮
# => │ # │ name │ ver │
# => ├───┼──────┼─────┤
# => │ 0 │ rl   │   3 │
# => ╰───┴──────┴─────╯
```

## `chunks`, `combinations` and `permutations`

These return a list of lists. For a table, each inner list is itself a table.

[`chunks n`](/commands/docs/chunks.md) splits its input into groups of `n` items. The last group is shorter when the input doesn't divide evenly. For a `binary` value or a byte stream, the groups are `binary` values of `n` bytes, and `n` can be a filesize such as `8kib`. A filesize with any other input is an error, and so is a size of zero or less:

```nu
[1 2 3 4 5] | chunks 2 | to nuon
# => [[1, 2], [3, 4], [5]]
0x[01 02 03 04 05] | chunks 2b | to nuon
# => [0x[0102], 0x[0304], 0x[05]]
```

[`combinations k`](/commands/docs/combinations.md) returns every way to choose `k` items, keeping their input order. If `k` is larger than the input, there are none, and the result is an empty list.

[`permutations`](/commands/docs/permutations.md) returns every ordering. An empty list has no permutations. Items are treated as distinct by position, so a list with repeated items gives repeated permutations; pipe the result through `uniq` to remove them:

```nu
[a a b] | permutations | each { str join } | to nuon
# => [aab, aab, baa, aba, aba, baa]
```

## `chunk-by`, `split list` and `window`

These also split a list or table into a list of lists, but by content or by a sliding position instead of a fixed size. All three read a stream lazily, so they work on long or endless input when you take only the first groups.

### `chunk-by`

[`chunk-by`](/commands/docs/chunk-by.md) runs a closure or row condition on each item and starts a new group whenever the result differs from the previous item's result. Only neighbors are grouped, so equal results that are apart end up in separate groups. That is the difference from [`group-by`](/commands/docs/group-by.md), which collects every item with the same key into one group, whatever its position, and returns a record:

```nu
[3 5 2 8 6 1] | chunk-by {|x| $x mod 2 } | to nuon
# => [[3, 5], [2, 8, 6], [1]]
[a a b a] | chunk-by $it | to nuon
# => [[a, a], [b], [a]]
```

The result can be any value, not only a `bool`. It suits runs in ordered data, such as consecutive log lines with the same level:

```nu
[[time level]; [1 info] [2 info] [3 error] [4 info]] | chunk-by {|r| $r.level } | each { {level: $in.0.level, count: ($in | length)} } | to nuon
# => [[level, count]; [info, 2], [error, 1], [info, 1]]
```

The input can be a list, a table or a range. Empty input gives an empty list.

When some items may lack the column, use an optional cell path such as `$r.level?`. Those items get `null` as their result, so neighbors without the column form one group.

### `split list`

[`split list`](/commands/docs/split_list.md) splits a list at separator items, the way [`split row`](/commands/docs/split_row.md) splits a string. The separator can be:

- a value. An item is a separator when it equals the value, so `2` also matches `2.0`.
- a regular expression, with `--regex` (`-r`). Items are converted to strings to test them. Items that can't be converted, such as records, never match.
- a closure. An item is a separator when the closure returns `true`. Any other result counts as `false`.

`--split` chooses what happens to each separator. `on`, the default, drops it. `before` starts the next group with it, and `after` ends the current group with it. Any other word is an error:

```nu
"# One\ntext\n# Two\nmore" | lines | split list --regex "^#" --split before | to nuon
# => [[], ["# One", text], ["# Two", more]]
```

Groups can be empty. A separator at the start gives an empty first group, as above, two separators in a row give an empty group between them, and a separator at the end gives an empty last group with `on` or `after`. Empty input gives a list that holds one empty list. Remove empty groups with `where ($it | is-not-empty)`, or `skip 1` when you know the input starts with a separator:

```nu
[a b "" c "" "" d] | split list "" | to nuon
# => [[a, b], [c], [], [d]]
```

### `window`

[`window n`](/commands/docs/window.md) returns overlapping groups of `n` items: the first `n`, then the same group moved one item along, and so on. It is useful for moving averages and for comparing each item with its neighbors:

```nu
[1 2 3 4 5] | window 3 | each { math avg } | to nuon
# => [2.0, 3.0, 4.0]
```

`--stride` (`-s`) sets how many items the window moves each time. With a stride equal to the size, the groups don't overlap, and with a larger stride, the items between groups are skipped.

Without `--remainder`, a group with fewer than `n` items is dropped, so input shorter than `n` gives an empty list. With `--remainder` (`-r`), the shorter groups at the end are kept. With overlapping windows, that is every shrinking group up to the last item:

```nu
[1 2 3 4 5] | window 3 --remainder | to nuon
# => [[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5], [5]]
[1 2 3 4 5] | window 2 --stride 2 --remainder | to nuon
# => [[1, 2], [3, 4], [5]]
```

The size and the stride must be positive. Zero is an `incorrect_value` error and a negative number a `needs_positive_value` error. `window` takes a list or a stream. A range is rejected when the pipeline is parsed, so generate the numbers with [`seq`](/commands/docs/seq.md) instead.
