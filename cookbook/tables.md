---
title: Advanced table workflows
---

# Advanced table workflows

### Merging tables of different size

Examples shown in [`Working with tables`](../book/working_with_tables.md) work fine when our tables have equal amount of rows but what if we want to merge tables of different sizes?

```nu
let first_table = [[a b]; [1 2] [3 4]]
let second_table = [[c d]; [5 6]]
$first_table | merge $second_table
```

Output:

```
───┬───┬───┬───┬───
 # │ a │ b │ c │ d
───┼───┼───┼───┼───
 0 │ 1 │ 2 │ 5 │ 6
───┼───┼───┼───┼───
 1 │ 3 │ 4 │ ❎│ ❎
───┴───┴───┴───┴───
```

Columns `c` and `d` in the second row are empty because our `second` table only contained a single row; Nushell has nothing to fill the remaining rows with. But what if we wanted the smaller table to 'wrap around' and keep filling the rows? For that we can use the [`chunks`](/commands/docs/chunks.md) command to split the larger table into subtables, merge each of them with the smaller table and then combine the merged tables together using [`flatten`](/commands/docs/flatten.md) command

For example:

```nu
let first_table = [[a b]; [1 2] [3 4]]
let second_table = [[c d]; [5 6]]

$first_table
| chunks ($second_table | length)
| each { merge $second_table }
| flatten
```

Output:

```
───┬───┬───┬───┬───
 # │ a │ b │ c │ d
───┼───┼───┼───┼───
 0 │ 1 │ 2 │ 5 │ 6
───┼───┼───┼───┼───
 1 │ 3 │ 4 │ 5 │ 6
───┴───┴───┴───┴───
```

Can we do that with more than two tables? Sure we can! Let's add a third table:

```nu
let third_table = [[e f]; [7 8]]
```

We can merge all three tables like this:

```nu
$first_table
| chunks ($second_table | length)
| each { merge $second_table }
| flatten
| chunks ($third_table | length)
| each { merge $third_table }
| flatten
```

Output:

```
───┬───┬───┬───┬───┬───┬───
 # │ a │ b │ c │ d │ e │ f
───┼───┼───┼───┼───┼───┼───
 0 │ 1 │ 2 │ 5 │ 6 │ 7 │ 8
───┼───┼───┼───┼───┼───┼───
 1 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8
───┴───┴───┴───┴───┴───┴───
```

Or as mentioned in the [Cookbook](https://www.nushell.sh/book/working_with_tables.html#merging-tables) we can use the [`reduce`](../commands/docs/reduce.md) command to merge tables together recursively:

```nu
[$first_table $second_table $third_table]
| reduce { |elt, acc|
    $acc
    | chunks ($elt | length)
    | each { merge $elt }
    | flatten
  }
```

Output:

```
───┬───┬───┬───┬───┬───┬───
 # │ a │ b │ c │ d │ e │ f
───┼───┼───┼───┼───┼───┼───
 0 │ 1 │ 2 │ 5 │ 6 │ 7 │ 8
───┼───┼───┼───┼───┼───┼───
 1 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8
───┴───┴───┴───┴───┴───┴───
```
