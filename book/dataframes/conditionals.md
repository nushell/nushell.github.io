# Masks and Conditionals

The [Dataframes](../dataframes.md) chapter builds boolean masks from series in
[Series and Masks](../dataframes.md#series-and-masks) and uses lists of row
numbers in [Series as Indices](../dataframes.md#series-as-indices). This page
covers the rest of the commands for that kind of work: testing for nulls,
negating and summarizing masks, finding the positions of values, building a
column from conditions, and replacing values.

The examples use `$df_1`, the dataframe loaded from `test_small.csv` in
[Working with Dataframes](../dataframes.md#working-with-dataframes).

## Series commands and expression commands

Some of these commands work on a series, meaning a dataframe with one column,
and return a new dataframe right away. Others build an expression that runs
inside `polars select`, `polars with-column`, `polars filter`, or `polars agg`.
A few do both.

| Command                                                          | On a series | In an expression |
| ---------------------------------------------------------------- | ----------- | ---------------- |
| [`polars is-null`](/commands/docs/polars_is-null.md)             | yes         | yes              |
| [`polars is-not-null`](/commands/docs/polars_is-not-null.md)     | yes         | yes              |
| [`polars not`](/commands/docs/polars_not.md)                     | yes         | no               |
| [`polars expr-not`](/commands/docs/polars_expr-not.md)           | no          | yes              |
| [`polars all-true`](/commands/docs/polars_all-true.md)           | yes         | no               |
| [`polars all-false`](/commands/docs/polars_all-false.md)         | yes         | no               |
| [`polars arg-true`](/commands/docs/polars_arg-true.md)           | yes         | no               |
| [`polars arg-where`](/commands/docs/polars_arg-where.md)         | no          | yes              |
| [`polars arg-max`](/commands/docs/polars_arg-max.md)             | yes         | no               |
| [`polars arg-min`](/commands/docs/polars_arg-min.md)             | yes         | no               |
| [`polars when`](/commands/docs/polars_when.md)                   | no          | yes              |
| [`polars otherwise`](/commands/docs/polars_otherwise.md)         | no          | yes              |
| [`polars lit`](/commands/docs/polars_lit.md)                     | no          | yes              |
| [`polars replace`](/commands/docs/polars_replace.md)             | no          | yes              |
| [`polars list-contains`](/commands/docs/polars_list-contains.md) | no          | yes              |

The series forms need exactly one column. A wider dataframe fails with
`Error using as series`, so pick the column with
[`polars get`](/commands/docs/polars_get.md) first. They also take a lazy
dataframe, which they collect, so they always return an eager dataframe. The
parser rejects a plain Nushell list, so convert it with `polars into-df`.

## Testing for nulls

`polars is-null` gives `true` where a value is null, and `polars is-not-null`
gives the opposite. As expressions they keep the column's name. Pick the column
with `polars col`:

```nu
let readings = [[sensor value]; [a 1.5] [b null] [c 3.0] [d NaN]] | polars into-df
$readings | polars select sensor (polars col value | polars is-null | polars as missing) | polars collect
# => ╭───┬────────┬─────────╮
# => │ # │ sensor │ missing │
# => ├───┼────────┼─────────┤
# => │ 0 │ a      │ false   │
# => │ 1 │ b      │ true    │
# => │ 2 │ c      │ false   │
# => │ 3 │ d      │ false   │
# => ╰───┴────────┴─────────╯
```

A float that is NaN isn't null, as row `d` shows. On a series, the result is a
column named `is_null` or `is_not_null`. To drop the rows with nulls, filter on
the mask:

```nu
$readings | polars filter (polars col value | polars is-not-null) | polars collect
# => ╭───┬────────┬───────╮
# => │ # │ sensor │ value │
# => ├───┼────────┼───────┤
# => │ 0 │ a      │  1.50 │
# => │ 1 │ c      │  3.00 │
# => │ 2 │ d      │   NaN │
# => ╰───┴────────┴───────╯
```

## Negating a mask

`polars not` flips a boolean series and keeps its name. A null stays null. Any
other type fails with `Error inverting mask` and a message such as
``invalid series dtype: expected `Boolean`, got `i64` ``.

```nu
let big = ($df_1 | polars get int_1) > 5
$big | polars not | polars first 3
# => ╭───┬───────╮
# => │ # │ int_1 │
# => ├───┼───────┤
# => │ 0 │ true  │
# => │ 1 │ true  │
# => │ 2 │ true  │
# => ╰───┴───────╯
```

`polars expr-not` is the expression version, and it also takes a selector. Use
it to invert a condition inside `polars filter`:

```nu
$df_1 | polars filter ((polars col first) == a | polars expr-not) | polars select first int_1 | polars first 3 | polars collect
# => ╭───┬───────┬───────╮
# => │ # │ first │ int_1 │
# => ├───┼───────┼───────┤
# => │ 0 │ b     │     4 │
# => │ 1 │ b     │     0 │
# => │ 2 │ b     │     6 │
# => ╰───┴───────┴───────╯
```

`polars expr-not` doesn't check for booleans. On an integer column it flips the
bits, so `1` becomes `-2`, and using that as a filter fails with
``filter predicate must be of type `Boolean`, got `Int64` ``.

## Checking a whole mask

`polars all-true` and `polars all-false` reduce a boolean series to a
one-row dataframe with a column named `all_true` or `all_false`. Both skip
nulls, so `[true null true]` counts as all true.

```nu
$big | polars all-true
# => ╭───┬──────────╮
# => │ # │ all_true │
# => ├───┼──────────┤
# => │ 0 │ false    │
# => ╰───┴──────────╯
```

Both fail on any series that isn't boolean. There is no expression form. Inside
`polars agg`, compare a count instead, such as
`((polars col x) > 5 | polars expr-not | polars sum) == 0`.

## Finding positions

Four commands give row numbers rather than values. The results of
`polars arg-true`, `polars arg-max`, and `polars arg-min` go straight into
[`polars take`](/commands/docs/polars_take.md). A `polars select` with
`polars arg-where` returns a lazy dataframe, so collect it before passing it to
`polars take`.

`polars arg-true` lists the positions of the `true` values in a series, in a
`u64` column named `arg_true`. A null counts as not true, and a series with no
`true` values gives an empty dataframe, shown as `empty list`.

```nu
$big | polars arg-true
# => ╭───┬──────────╮
# => │ # │ arg_true │
# => ├───┼──────────┤
# => │ 0 │        5 │
# => │ 1 │        6 │
# => │ 2 │        7 │
# => │ 3 │        8 │
# => ╰───┴──────────╯
```

`polars arg-true` doesn't check the column's type. It compares each value with
`true`, so on an integer series it returns the positions of the value `1`.

`polars arg-where` is the expression version. It takes the condition as its
argument rather than as input, and returns a `u64` column of positions:

```nu
$df_1 | polars select (polars arg-where ((polars col int_1) > 5) | polars as rows) | polars collect
# => ╭───┬──────╮
# => │ # │ rows │
# => ├───┼──────┤
# => │ 0 │    5 │
# => │ 1 │    6 │
# => │ 2 │    7 │
# => │ 3 │    8 │
# => ╰───┴──────╯
```

The result is usually shorter than the dataframe, so
`polars with-column` fails with an error such as
`lengths don't match: unable to add a column of length 4 to a DataFrame of height 10`.
Use it in `polars select`, or in `polars agg`, where the positions count from the
start of each group:

```nu
$df_1 | polars group-by first | polars agg (polars arg-where ((polars col int_1) > 5) | polars as rows) | polars sort-by first | polars collect | polars into-nu | update rows { to nuon }
# => ╭───┬───────┬────────╮
# => │ # │ first │  rows  │
# => ├───┼───────┼────────┤
# => │ 0 │ a     │ []     │
# => │ 1 │ b     │ [2, 3] │
# => │ 2 │ c     │ [0, 1] │
# => ╰───┴───────┴────────╯
```

The argument has to be a boolean expression. A column name such as `int_1` is
read as a literal string and fails with
``invalid series dtype: expected `Boolean`, got `str` ``, and
`(polars col int_1)` fails the same way with `got i64`.

`polars arg-max` and `polars arg-min` give the position of the largest or
smallest value of a series, in a one-row `u32` column named `arg_max` or
`arg_min`. When the extreme value appears more than once, they return its first
position. They skip nulls, and strings compare alphabetically. A series that
is empty or all null gives an empty dataframe.

```nu
$df_1 | polars take ($df_1 | polars get int_1 | polars arg-max)
# => ╭───┬───────┬───────┬─────────┬─────────┬───────┬────────┬───────┬───────╮
# => │ # │ int_1 │ int_2 │ float_1 │ float_2 │ first │ second │ third │ word  │
# => ├───┼───────┼───────┼─────────┼─────────┼───────┼────────┼───────┼───────┤
# => │ 0 │     9 │    19 │    0.90 │    8.00 │ c     │ c      │ b     │ ninth │
# => ╰───┴───────┴───────┴─────────┴─────────┴───────┴────────┴───────┴───────╯
```

## Building a column from conditions

`polars when` and `polars otherwise` work like an `if`/`else if`/`else` chain,
evaluated for every row. `polars when` takes a condition and the value to use
where it holds. Pipe that into more `polars when` calls for further conditions,
and finish with `polars otherwise`, which gives the value for rows that matched
nothing. The first condition that holds decides the row.

```nu
$df_1 | polars select int_1 (polars when ((polars col int_1) > 5) high | polars when ((polars col int_1) > 2) mid | polars otherwise low | polars as size) | polars first 6 | polars collect
# => ╭───┬───────┬──────╮
# => │ # │ int_1 │ size │
# => ├───┼───────┼──────┤
# => │ 0 │     1 │ low  │
# => │ 1 │     2 │ low  │
# => │ 2 │     3 │ mid  │
# => │ 3 │     4 │ mid  │
# => │ 4 │     0 │ low  │
# => │ 5 │     6 │ high │
# => ╰───┴───────┴──────╯
```

A chain without `polars otherwise` is a `polars_when` value, not an expression,
and using it fails with `can't convert polars_when to expression`. A chain can
have only one `polars otherwise`. Piping its result into another one fails with
`can't convert polars_expression to NuWhen`.

The condition has to be a boolean expression, or the query fails with
``invalid series dtype: expected `Boolean` ``. The values can be expressions,
such as `(polars col word)`, or plain Nushell values. A plain string is a literal
here, not a column name, so `high` above is the text `high`.

The result gets the name of the first value. For a plain value that's `literal`,
so name the column with `polars as`. When the values have different types,
Polars picks a type that holds them all: an int and a float give a float, and a
string with a number gives a string.

`polars otherwise` and `polars lit` don't take `null`. Both fail with
`can't convert nothing to lazy expression`.

### Literal values

`polars lit` turns a Nushell value into an expression that stands for that
value. The value can be a string, an int, a float, a bool, a datetime, a
duration, or a list. A datetime becomes a `datetime<ns>` without a time zone,
and a list becomes a column of its own length. Records, binary values, and
`null` fail with `Can't convert to lazy expression`.

Most commands that take expressions already turn plain values into literals.
`polars lit` matters where a plain string would be read as a column name. In
`polars select`, `polars with-column`, `polars group-by`, `polars over`, and
`polars list-contains`, a bare word names a column:

```nu
$df_1 | polars select word (polars lit word | polars as tag) | polars first 2 | polars collect
# => ╭───┬────────┬──────╮
# => │ # │  word  │ tag  │
# => ├───┼────────┼──────┤
# => │ 0 │ first  │ word │
# => │ 1 │ second │ word │
# => ╰───┴────────┴──────╯
```

Polars repeats a single value for every row. A list literal keeps its own length,
so `polars select word (polars lit [1 2 3])` fails with
`lengths don't match: Series length 3 doesn't match the DataFrame height of 10`.

## Replacing values

`polars replace` maps old values to new ones. Give it a list of old values and a
list of new ones, or a single record whose keys are the old values. It takes an
expression or a selector as input.

```nu
$df_1 | polars select first (polars col first | polars replace {a: alpha, b: beta} | polars as renamed) | polars collect
# => ╭───┬───────┬─────────╮
# => │ # │ first │ renamed │
# => ├───┼───────┼─────────┤
# => │ 0 │ a     │ alpha   │
# => │ 1 │ a     │ alpha   │
# => │ 2 │ a     │ alpha   │
# => │ 3 │ b     │ beta    │
# => │ 4 │ b     │ beta    │
# => │ 5 │ b     │ beta    │
# => │ 6 │ b     │ beta    │
# => │ 7 │ c     │ c       │
# => │ 8 │ c     │ c       │
# => │ 9 │ c     │ c       │
# => ╰───┴───────┴─────────╯
```

Values that aren't in the map stay as they were, and the column keeps its type.
Polars casts new values to that type, so replacing `0` with `0.5` in an `i64`
column gives `0`, and numbers put into a string column become strings. Record
keys are always strings, but Polars casts them to the column's type too, so
`{0: 100}` works on an integer column.

`--strict` (`-s`) changes this. Every value has to be in the map, or the query
fails with ``incomplete mapping specified for `replace_strict` ``. The result
takes the type of the new values instead of the old column.

- `--default` (`-d`) gives the value for anything not in the map. It can be an
  expression, such as `(polars col int_2)`, to fall back to another column.
- `--return-dtype` (`-t`) sets the result's type, such as `f64`.
- Both need `--strict`. Without it they fail with
  `` `default` may only be used with `strict` `` or the same message for
  `return-dtype`.

```nu
$df_1 | polars select first (polars col first | polars replace [a b] [1 2] --strict --default 0 | polars as code) | polars collect
# => ╭───┬───────┬──────╮
# => │ # │ first │ code │
# => ├───┼───────┼──────┤
# => │ 0 │ a     │    1 │
# => │ 1 │ a     │    1 │
# => │ 2 │ a     │    1 │
# => │ 3 │ b     │    2 │
# => │ 4 │ b     │    2 │
# => │ 5 │ b     │    2 │
# => │ 6 │ b     │    2 │
# => │ 7 │ c     │    0 │
# => │ 8 │ c     │    0 │
# => │ 9 │ c     │    0 │
# => ╰───┴───────┴──────╯
```

A few rules for the lists:

- The new list has to be as long as the old one, or hold one value that every
  match gets. Other lengths fail with
  `` `new` input for `replace` must have the same length as `old` or have length 1 ``.
- Give every value in a list the same type. The first value's type sets the
  type for the whole list, and values of other types are left out, so
  `[a 5 b]` counts as `[a b]`.
- A list can hold one expression, such as `[(polars lit z)]`, but not more. Two
  fail with `Multiple expressions to be replaced is not supported`.
- With a record, leave out the second argument. A record together with a list,
  or a single list, fails with `Invalid arguments`.

## Checking lists

`polars list-contains` works on a column of lists. For each row, it checks
whether the list holds a value, and the result keeps the list column's name. An
empty list gives `false`.

The argument is read the way `polars select` reads its arguments, so a bare
word is a column name. To look for a fixed value, wrap it in `polars lit`:

```nu
let orders = [[id tags]; [1 [gift rush]] [2 [rush]] [3 []]] | polars into-df
$orders | polars select id (polars col tags | polars list-contains (polars lit gift) | polars as gift) | polars collect
# => ╭───┬────┬───────╮
# => │ # │ id │ gift  │
# => ├───┼────┼───────┤
# => │ 0 │  1 │ true  │
# => │ 1 │  2 │ false │
# => │ 2 │  3 │ false │
# => ╰───┴────┴───────╯
```

Without `polars lit`, `polars list-contains gift` looks for a column named
`gift` and fails with `unable to find column "gift"`. Naming a column on purpose
checks each row's list against that row's value in the column. The value's type
has to match the list's items, or the query fails with an error such as
`'list.contains' cannot check for List(Int64) values in String data`, and a
column that doesn't hold lists fails with
`expected List data type for list operation, got: String`. The command also
takes a selector as input.
