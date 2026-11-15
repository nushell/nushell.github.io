# Aggregations and Window Functions

The [Dataframes](../dataframes.md) chapter introduces aggregation with
[`polars sum`](/commands/docs/polars_sum.md) in
[Basic Aggregations](../dataframes.md#basic-aggregations), and groups rows with
`polars group-by` and `polars agg` in
[DataFrame group-by](../dataframes.md#dataframe-group-by). This page covers the
other aggregation commands, and the commands that calculate along a column
without collapsing it: window expressions, running totals, rolling windows, and
calculations across the columns of each row.

The examples use `$df_1`, the dataframe loaded from `test_small.csv` in
[Working with Dataframes](../dataframes.md#working-with-dataframes).

To apply one of these commands to several columns, pick them with
[`polars col`](/commands/docs/polars_col.md), which also takes a regular
expression or a type with `--type`. `polars count` and `polars agg-groups` also
take a [selector](./selectors.md) as input.

## Summary statistics

[`polars min`](/commands/docs/polars_min.md),
[`polars max`](/commands/docs/polars_max.md),
[`polars mean`](/commands/docs/polars_mean.md),
[`polars median`](/commands/docs/polars_median.md),
[`polars std`](/commands/docs/polars_std.md),
[`polars var`](/commands/docs/polars_var.md), and
[`polars quantile`](/commands/docs/polars_quantile.md) have the same two forms as
`polars sum`. Given a dataframe, they reduce every column to a single row. Given
an expression, they build one that gives one value, or one value per group inside
`polars agg`. All of them skip nulls.

Columns that a statistic doesn't apply to come out null. `polars min` and
`polars max` also work on strings, where they give the first and last value in
alphabetical order:

```nu
$df_1 | polars max | polars collect
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬───────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼───────┤
# => │ 0 │     9 │    19 │    0.90 │    9.00 │ c     │ c      │ c     │ third │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴───────╯
$df_1 | polars mean | polars collect
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬──────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼──────┤
# => │ 0 │  4.00 │ 14.50 │    0.45 │    4.60 │       │        │       │      │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴──────╯
```

`polars min`, `polars max`, `polars mean`, `polars std`, and `polars var` return
a lazy dataframe even for eager input, while `polars median` and
`polars quantile` return the kind they were given. See
[When results are eager or lazy](../dataframes.md#when-results-are-eager-or-lazy).

In a group-by, each one becomes a column of per-group results:

```nu
$df_1 | polars group-by first | polars agg (polars col int_1 | polars min | polars as min) (polars col int_1 | polars max | polars as max) (polars col int_1 | polars mean | polars as mean) (polars col int_1 | polars median | polars as median) (polars col int_1 | polars std | polars as std) (polars col int_1 | polars var | polars as var) | polars sort-by first | polars collect
# => ╭───┬───────┬─────┬─────┬──────┬────────┬──────┬───────╮
# => │ # │ first │ min │ max │ mean │ median │ std  │  var  │
# => ├───┼───────┼─────┼─────┼──────┼────────┼──────┼───────┤
# => │ 0 │ a     │   1 │   3 │ 2.00 │   2.00 │ 1.00 │  1.00 │
# => │ 1 │ b     │   0 │   7 │ 4.25 │   5.00 │ 3.10 │  9.58 │
# => │ 2 │ c     │   0 │   9 │ 5.67 │   8.00 │ 4.93 │ 24.33 │
# => ╰───┴───────┴─────┴─────┴──────┴────────┴──────┴───────╯
```

`polars std` and `polars var` compute the sample standard deviation and variance,
dividing by one less than the number of values, and there is no flag to change
that. A group with only one value gets null.

`polars quantile` takes a fraction between 0 and 1, such as `0.75`. It doesn't
interpolate between values. It picks the value nearest to that position, so
`polars quantile 0.5` can differ from `polars median`, which averages the two
middle values of an even-sized column:

```nu
$df_1 | polars select (polars col int_1 | polars median | polars as median) (polars col int_1 | polars quantile 0.5 | polars as q50) | polars collect
# => ╭───┬────────┬──────╮
# => │ # │ median │ q50  │
# => ├───┼────────┼──────┤
# => │ 0 │   3.50 │ 4.00 │
# => ╰───┴────────┴──────╯
```

A fraction outside 0 to 1 fails when the plan runs, with
`quantile should be between 0.0 and 1.0`.

## Counting

Three commands count values, and they don't count the same things.

[`polars count`](/commands/docs/polars_count.md) counts the values that aren't
null. It only builds an expression. [`polars len`](/commands/docs/polars_len.md)
counts rows, nulls included:

```nu
[[g v]; [a 1] [a null] [b 3]] | polars into-df | polars group-by g | polars agg (polars col v | polars count | polars as count) (polars len) | polars sort-by g | polars collect
# => ╭───┬───┬───────┬─────╮
# => │ # │ g │ count │ len │
# => ├───┼───┼───────┼─────┤
# => │ 0 │ a │     1 │   2 │
# => │ 1 │ b │     1 │   1 │
# => ╰───┴───┴───────┴─────╯
```

[`polars count-null`](/commands/docs/polars_count-null.md) counts the nulls in a
series, meaning a dataframe with one column, and returns a one-row dataframe with
a column named `count_null`. A wider dataframe fails with
`Error using as series`. It has no expression form, so inside `polars agg` count
nulls with `polars col v | polars is-null | polars sum`.

[`polars n-unique`](/commands/docs/polars_n-unique.md) counts distinct values,
and null counts as one of them. On a series it returns a column named
`count_unique`. As an expression it keeps the column's name, and with
`polars col "*"` it counts every column at once:

```nu
$df_1 | polars select (polars col "*" | polars n-unique) | polars collect
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬──────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼──────┤
# => │ 0 │     9 │    10 │      10 │       9 │     3 │      3 │     3 │    5 │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴──────╯
```

`polars count-null` and the series form of `polars n-unique` collect a lazy
input and return an eager dataframe.

## Group positions and lists

[`polars agg-groups`](/commands/docs/polars_agg-groups.md) gives, for each group,
the row positions that belong to it, as a `list<u64>`. Use it inside
`polars agg`.

```nu
$df_1 | polars group-by first | polars agg (polars col int_1 | polars agg-groups | polars as rows) | polars sort-by first | polars collect | polars into-nu | update rows { to nuon }
# => ╭───┬───────┬──────────────╮
# => │ # │ first │     rows     │
# => ├───┼───────┼──────────────┤
# => │ 0 │ a     │ [0, 1, 2]    │
# => │ 1 │ b     │ [3, 4, 5, 6] │
# => │ 2 │ c     │ [7, 8, 9]    │
# => ╰───┴───────┴──────────────╯
```

[`polars implode`](/commands/docs/polars_implode.md) gathers a whole column into
a single list. In `polars select` it gives one row:

```nu
$df_1 | polars select (polars col int_1 | polars implode) | polars collect | polars into-nu | update int_1 { to nuon }
# => ╭───┬────────────────────────────────╮
# => │ # │             int_1              │
# => ├───┼────────────────────────────────┤
# => │ 0 │ [1, 2, 3, 4, 0, 6, 7, 8, 9, 0] │
# => ╰───┴────────────────────────────────╯
```

Inside `polars agg`, `polars implode` gives each group's values as a list, which
is what a bare column already gives there, so both make a `list<i64>` column.
`--maintain-order` (`-o`) asks Polars to keep the values in their original
order. With `polars collect`, the values keep their order with or without it.

## Window expressions

A group-by collapses each group to one row. Sometimes you want the group's
result on every row instead, for example to compare each value with its group's
total. [`polars over`](/commands/docs/polars_over.md) does that. Pipe an
expression into it and name the columns that define the groups:

```nu
$df_1 | polars select first float_1 (polars col float_1 | polars sum | polars over first | polars as group_total) ((polars col float_1) / (polars col float_1 | polars sum | polars over first) | polars as share) | polars collect
# => ╭───┬───────┬─────────┬─────────────┬───────╮
# => │ # │ first │ float_1 │ group_total │ share │
# => ├───┼───────┼─────────┼─────────────┼───────┤
# => │ 0 │ a     │    0.10 │        0.60 │  0.17 │
# => │ 1 │ a     │    0.20 │        0.60 │  0.33 │
# => │ 2 │ a     │    0.30 │        0.60 │  0.50 │
# => │ 3 │ b     │    0.40 │        2.20 │  0.18 │
# => │ 4 │ b     │    0.50 │        2.20 │  0.23 │
# => │ 5 │ b     │    0.60 │        2.20 │  0.27 │
# => │ 6 │ b     │    0.70 │        2.20 │  0.32 │
# => │ 7 │ c     │    0.80 │        1.70 │  0.47 │
# => │ 8 │ c     │    0.90 │        1.70 │  0.53 │
# => │ 9 │ c     │    0.00 │        1.70 │  0.00 │
# => ╰───┴───────┴─────────┴─────────────┴───────╯
```

The rows keep their order and count. `polars over` takes any number of column
names or expressions, and it groups rows by all of them together. With none,
it fails with `at least one key is required in a group_by operation`.

Polars runs an expression that doesn't reduce a column, such as a running total,
separately within each group, so it starts over for each group:

```nu
$df_1 | polars select first int_1 (polars col int_1 | polars cumulative sum | polars over first | polars as running) | polars collect
# => ╭───┬───────┬───────┬─────────╮
# => │ # │ first │ int_1 │ running │
# => ├───┼───────┼───────┼─────────┤
# => │ 0 │ a     │     1 │       1 │
# => │ 1 │ a     │     2 │       3 │
# => │ 2 │ a     │     3 │       6 │
# => │ 3 │ b     │     4 │       4 │
# => │ 4 │ b     │     0 │       4 │
# => │ 5 │ b     │     6 │      10 │
# => │ 6 │ b     │     7 │      17 │
# => │ 7 │ c     │     8 │       8 │
# => │ 8 │ c     │     9 │      17 │
# => │ 9 │ c     │     0 │      17 │
# => ╰───┴───────┴───────┴─────────╯
```

The result keeps the input column's name, so selecting it next to the original
column fails with an error that starts with
`duplicate: projections contained duplicate output name 'int_1'`. Rename it with
`polars as`, as above.

## Running totals

[`polars cumulative`](/commands/docs/polars_cumulative.md) computes a running
`sum`, `min`, or `max` down a column. `--reverse` (`-r`) runs from the last row
up, which gives, for example, the total still to come:

```nu
$df_1 | polars select int_1 (polars col int_1 | polars cumulative sum | polars as running) (polars col int_1 | polars cumulative max | polars as peak) (polars col int_1 | polars cumulative sum --reverse | polars as remaining) | polars collect
# => ╭───┬───────┬─────────┬──────┬───────────╮
# => │ # │ int_1 │ running │ peak │ remaining │
# => ├───┼───────┼─────────┼──────┼───────────┤
# => │ 0 │     1 │       1 │    1 │        40 │
# => │ 1 │     2 │       3 │    2 │        39 │
# => │ 2 │     3 │       6 │    3 │        37 │
# => │ 3 │     4 │      10 │    4 │        34 │
# => │ 4 │     0 │      10 │    4 │        30 │
# => │ 5 │     6 │      16 │    6 │        30 │
# => │ 6 │     7 │      23 │    7 │        24 │
# => │ 7 │     8 │      31 │    8 │        17 │
# => │ 8 │     9 │      40 │    9 │         9 │
# => │ 9 │     0 │      40 │    9 │         0 │
# => ╰───┴───────┴─────────┴──────┴───────────╯
```

Any other operation fails with `Operation not valid for cumulative`, and the
error lists the allowed values. A null stays null in the result and the
calculation carries on past it. Strings fail with an error such as
`` `cum_max` operation not supported for dtype `str` ``, and a boolean column
sums as a count of its `true` values.

Given a series, `polars cumulative` returns a column whose name joins the input's
name and the operation, such as `int_1_cumulative_sum`. It collects a lazy
dataframe first. As an expression, the result keeps the input column's name.

## Rolling windows

[`polars rolling`](/commands/docs/polars_rolling.md) has two modes, depending on
its input.

### Fixed-size windows

Given a series or an expression, `polars rolling` takes an operation, which is
`sum`, `min`, `max`, or `mean`, and a window size in rows. Each row's result covers that
row and the rows just before it, so the first rows, which don't have a full
window, get null:

```nu
$df_1 | polars select int_1 (polars col int_1 | polars rolling sum 3 | polars as sum3) (polars col int_1 | polars rolling mean 3 | polars as avg3) | polars collect
# => ╭───┬───────┬──────┬──────╮
# => │ # │ int_1 │ sum3 │ avg3 │
# => ├───┼───────┼──────┼──────┤
# => │ 0 │     1 │      │      │
# => │ 1 │     2 │      │      │
# => │ 2 │     3 │    6 │ 2.00 │
# => │ 3 │     4 │    9 │ 3.00 │
# => │ 4 │     0 │    7 │ 2.33 │
# => │ 5 │     6 │   10 │ 3.33 │
# => │ 6 │     7 │   13 │ 4.33 │
# => │ 7 │     8 │   21 │ 7.00 │
# => │ 8 │     9 │   24 │ 8.00 │
# => │ 9 │     0 │   17 │ 5.67 │
# => ╰───┴───────┴──────┴──────╯
```

A window that contains a null also gives null, and a window larger than the
column gives null everywhere. A window of `0` gives `0` for `sum` on every row.
Both arguments are required. Leaving out the window fails with
`Row number too large`, and an operation other than the four above fails with
`Operation not valid for rolling`. Given a series, the result's name joins the
input's name and the operation, such as `int_1_rolling_sum`.

To restart the window for each group, pipe the rolling expression into
`polars over`.

### Rolling group-by on a lazy dataframe

Given a lazy dataframe, `polars rolling` starts a rolling group-by, which you
finish with `polars agg` like a normal group-by. Each row gets a window of rows
whose `--index-column` value falls within a period of its own value, and
`polars agg` computes over that window. This is the way to compute values such as
a total over the last three days when rows aren't evenly spaced.

- `--index-column` (`-i`) names the column to measure windows along. It's
  required, and it has to be sorted, or the query fails with
  `argument in operation 'rolling' is not sorted`. An eager dataframe goes to
  the fixed-size mode instead and fails for lack of an operation and window, so
  convert it with [`polars into-lazy`](/commands/docs/polars_into-lazy.md)
  first.
- `--period` (`-p`) is the window's length.
- `--offset` (`-o`) is where the window starts, relative to the row's own value.
- `--closed` (`-c`) says which ends belong to the window: `left`, `right`,
  `both`, or `none`. The default is `left`.
- `--group-by` (`-g`) takes a list of columns or expressions, and computes the
  windows separately for each of their values.

The defaults are a period of 1, an offset of 1, and `left`, so without flags each
window starts one unit after its row and looks ahead. For the usual trailing
window that ends at the row, pass the negative period as `--offset` and
`--closed right`.

For an integer index, `--period` and `--offset` take integers, or strings such as
`2i`. For a date or datetime index, pass both flags as Polars duration strings,
such as `3d`.

```nu
$env.config.datetime_format.table = "%F"
let sales = [[day amount]; [2025-01-01 10] [2025-01-02 20] [2025-01-03 5] [2025-01-05 40] [2025-01-06 15]] | polars into-lazy
$sales | polars rolling --index-column day --period 3d --offset -3d --closed right | polars agg (polars col amount | polars sum | polars as last_3_days) | polars collect
# => ╭───┬────────────┬─────────────╮
# => │ # │    day     │ last_3_days │
# => ├───┼────────────┼─────────────┤
# => │ 0 │ 2025-01-01 │          10 │
# => │ 1 │ 2025-01-02 │          30 │
# => │ 2 │ 2025-01-03 │          35 │
# => │ 3 │ 2025-01-05 │          45 │
# => │ 4 │ 2025-01-06 │          55 │
# => ╰───┴────────────┴─────────────╯
```

The first line only changes how the table shows dates. Without it, they appear as
how long ago they were.

## Calculations across columns

The commands above work down a column. [`polars horizontal`](/commands/docs/polars_horizontal.md)
works across the columns of each row. Its first argument is the operation,
`sum`, `mean`, `min`, `max`, `all`, or `any`, followed by the columns or
expressions to combine. It ignores its input and returns an expression, so use
it inside `polars select` or `polars with-column`:

```nu
let scores = [[name q1 q2 q3]; [ana 7 null 9] [ben 5 6 4]] | polars into-df
$scores | polars select name (polars horizontal sum q1 q2 q3 | polars as total) (polars horizontal sum q1 q2 q3 --nulls | polars as strict_total) (polars horizontal mean q1 q2 q3 | polars as avg) (polars horizontal max q1 q2 q3 | polars as best) | polars collect
# => ╭───┬──────┬───────┬──────────────┬──────┬──────╮
# => │ # │ name │ total │ strict_total │ avg  │ best │
# => ├───┼──────┼───────┼──────────────┼──────┼──────┤
# => │ 0 │ ana  │    16 │              │ 8.00 │    9 │
# => │ 1 │ ben  │    15 │           15 │ 5.00 │    6 │
# => ╰───┴──────┴───────┴──────────────┴──────┴──────╯
```

By default `sum` and `mean` skip nulls, so ana's total adds two scores and her
average divides by two. With `--nulls` (`-n`), a null anywhere in the row makes
the result null. `min` and `max` always skip nulls. `all` and `any` combine
booleans, and there a null can decide the result: `true` and null give null for
`all`. Given integer columns, they count every value other than `0` as `true`.
`--nulls` changes only `sum` and `mean`. `sum` also accepts a string column, and
then joins the values as text, so `sum name q1` gives `ana7` for the first row.

The result takes the first column's name, so rename it with `polars as`. Calling
`polars horizontal` with no columns fails with
`Cannot apply horizontal aggregation`. Columns that can't be compared fail when
the plan runs, so `max` over a string column and an integer column gives
`got invalid or ambiguous dtypes: '[str, i64]'`. An unknown operation fails with
an error that lists the allowed values.
