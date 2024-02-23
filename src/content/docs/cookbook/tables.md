---
title: Advanced table workflows
---

### Merging tables of different size

Examples shown in [`Working with tables`](../book/working_with_tables) work fine when our tables have equal amount of rows but what if we want to merge tables of different sizes?

```nu
let first = [[a b]; [1 2] [3 4]]
let second = [[c d]; [5 6]]
$first | merge $second
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

Second row in columns `c` and `d` is empty because our `second` table only contained a single row so nushell has nothing to fill the remaining rows with. But what if we wanted the smaller table to 'wrap around' and keep filling the rows? For that we can use the [`group`](/commands/docs/group) command to split the larger table into subtables, merge each of them with the smaller table and then combine the merged tables together using [`flatten`](/commands/docs/flatten) command like this:

```nu
let first = [[a b]; [1 2] [3 4]]
let second = [[c d]; [3 4]]
$first
| group ($second | length)
| each { merge $second }
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
let third = [[e f]; [7 8]]
```

We could join all three tables like this:

```nu
$first
| group ($second|length)
| each { merge $second }
| flatten
| group ($third | length)
| each { merge $third }
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

Or just like last time we could use the [`reduce`](../book/docs/reduce) command to merge tables together recursively:

```nu
[$first_table $second_table $third_table]
| reduce { |it, acc|
    $acc
    | group ($it | length)
    | each { merge $it }
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
