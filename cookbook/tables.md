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
# => ╭───┬───┬───┬────┬────╮
# => │ # │ a │ b │ c  │ d  │
# => ├───┼───┼───┼────┼────┤
# => │ 0 │ 1 │ 2 │  5 │  6 │
# => │ 1 │ 3 │ 4 │ ❎ │ ❎ │
# => ╰───┴───┴───┴────┴────╯
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
# => ╭───┬───┬───┬───┬───╮
# => │ # │ a │ b │ c │ d │
# => ├───┼───┼───┼───┼───┤
# => │ 0 │ 1 │ 2 │ 5 │ 6 │
# => │ 1 │ 3 │ 4 │ 5 │ 6 │
# => ╰───┴───┴───┴───┴───╯
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
# => ╭───┬───┬───┬───┬───┬───┬───╮
# => │ # │ a │ b │ c │ d │ e │ f │
# => ├───┼───┼───┼───┼───┼───┼───┤
# => │ 0 │ 1 │ 2 │ 5 │ 6 │ 7 │ 8 │
# => │ 1 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │
# => ╰───┴───┴───┴───┴───┴───┴───╯
```

Or as mentioned in the [Working with Tables](https://www.nushell.sh/book/working_with_tables.html#merging-tables) chapter we can use the [`reduce`](../commands/docs/reduce.md) command to merge tables together recursively:

```nu
[$first_table $second_table $third_table]
| reduce { |elt, acc|
    $acc
    | chunks ($elt | length)
    | each { merge $elt }
    | flatten
  }
# => ╭───┬───┬───┬───┬───┬───┬───╮
# => │ # │ a │ b │ c │ d │ e │ f │
# => ├───┼───┼───┼───┼───┼───┼───┤
# => │ 0 │ 1 │ 2 │ 5 │ 6 │ 7 │ 8 │
# => │ 1 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │
# => ╰───┴───┴───┴───┴───┴───┴───╯
```

### Calendar tables

[`cal`](/commands/docs/cal.md) prints a calendar for the current month, or for a whole year with `--full-year 2024`. That calendar is text. `cal` renders the table itself, without the index column, and returns the rendered string. To filter or count days, ask for a table with `--as-table` (`-t`):

```nu
cal --full-year 2024 | describe
# => string (stream)
cal --as-table --full-year 2024 --month --month-names --week-start mo | first 2
# => ╭───┬───────┬────────────┬────┬────┬────┬────┬────┬────┬────╮
# => │ # │ month │ month_name │ mo │ tu │ we │ th │ fr │ sa │ su │
# => ├───┼───────┼────────────┼────┼────┼────┼────┼────┼────┼────┤
# => │ 0 │     1 │ january    │  1 │  2 │  3 │  4 │  5 │  6 │  7 │
# => │ 1 │     1 │ january    │  8 │  9 │ 10 │ 11 │ 12 │ 13 │ 14 │
# => ╰───┴───────┴────────────┴────┴────┴────┴────┴────┴────┴────╯
```

Each row is one week of one month, with a column per weekday named `su`, `mo`, `tu`, `we`, `th`, `fr` and `sa`. Days that belong to the previous or next month are `null`, so a week that spans two months appears once in each. `--week-start` takes one of those seven names and moves that day to the first column. Any other value, such as `monday`, is an error. `--year` (`-y`), `--quarter` (`-q`), `--month` (`-m`) and `--month-names` add the columns `year`, `quarter`, `month` and `month_name`, in that order, before the days. `--full-year` accepts any year the date library can represent, including 0 and negative years. A year far outside that range, such as `300000`, is a `The year is invalid` error.

With `--as-table`, ordinary filters answer calendar questions. Which months of 2024 start on a Monday, and which have five Sundays?

```nu
cal --as-table --full-year 2024 --week-start mo --month-names | where mo == 1 | get month_name | to nuon
# => [january, april, july]
cal --as-table --full-year 2024 --month-names | where su != null | group-by month_name | items {|month, weeks| {month: $month, sundays: ($weeks | length)} } | where sundays == 5 | get month | to nuon
# => [march, june, september, december]
```

When the calendar includes today, `cal` highlights today's date with the table header color, even with `--as-table`. That cell is a string that holds the number and the color codes, not an `int`, so `where sa == 14` won't match it and math on the column fails. Convert it back before filtering a calendar that includes today:

```nu
cal --as-table | update cells {|day| if ($day | describe) == string { $day | ansi strip | into int } else { $day } }
```
