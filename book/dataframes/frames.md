# Dataframe Operations

This page covers the dataframe commands that the [Dataframes](../dataframes.md) chapter leaves out. They combine and reshape dataframes, handle nulls and duplicates, change column types, sort values into bins, sample rows, inspect dataframes and query plans, run SQL queries, and run Nushell closures on columns. The chapter explains eager and lazy dataframes, expressions, and the plugin's object store, and this page builds on it. Each example creates its own small dataframe with `polars into-df`, so you can run it without the chapter's sample files.

[[toc]]

## Combining dataframes

`polars append` and `polars concat` put whole dataframes together by position, without looking at the values. To match rows on a key column, use [`polars join`](/commands/docs/polars_join.md), described in [Joining a DataFrame](../dataframes.md#joining-a-dataframe).

### Appending dataframes

[`polars append`](/commands/docs/polars_append.md) combines two dataframes. Without flags it places the other dataframe's columns to the right of the input's, so both need the same number of rows. A column name that's already taken gets the suffix `_x`:

```nu
let left = [[a b]; [1 2] [3 4]] | polars into-df
let right = [[b c]; [5 6] [7 8]] | polars into-df
$left | polars append $right
# => ╭───┬───┬───┬─────┬───╮
# => │ # │ a │ b │ b_x │ c │
# => ├───┼───┼───┼─────┼───┤
# => │ 0 │ 1 │ 2 │   5 │ 6 │
# => │ 1 │ 3 │ 4 │   7 │ 8 │
# => ╰───┴───┴───┴─────┴───╯
```

A different row count fails with an error such as `lengths don't match: could not create a new DataFrame: height of column 'c' (3) does not match height of column 'a' (2)`.

`--col` (`-c`) adds the other dataframe's rows below the input's instead. It matches columns by name, so the order of the other dataframe's columns doesn't matter:

```nu
$left | polars append ([[b a]; [5 6]] | polars into-df) --col
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 1 │ 2 │
# => │ 1 │ 3 │ 4 │
# => │ 2 │ 6 │ 5 │
# => ╰───┴───┴───╯
```

With `--col`, both dataframes need the same set of column names, and each column has to have the same type on both sides. Otherwise the command fails with `Dataframes with different number of columns`, `Dataframes with different columns names`, or an error such as `Unable to append: type String is incompatible with expected type Int64`. To stack dataframes whose types differ, use `polars concat --to-supertypes`.

Either side can be a lazy dataframe. `polars append` collects it first and always returns an eager dataframe. Plain Nushell tables aren't accepted on either side, so convert them with `polars into-df` first.

### Concatenating dataframes

[`polars concat`](/commands/docs/polars_concat.md) stacks any number of dataframes, one below the other, and returns a lazy dataframe. Pass the dataframes as arguments, or pipe in the first one:

```nu
let jan = [[month amount]; [jan 10] [jan 12]] | polars into-df
let feb = [[month amount]; [feb 7]] | polars into-df
polars concat $jan $feb | polars collect
# => ╭───┬───────┬────────╮
# => │ # │ month │ amount │
# => ├───┼───────┼────────┤
# => │ 0 │ jan   │     10 │
# => │ 1 │ jan   │     12 │
# => │ 2 │ feb   │      7 │
# => ╰───┴───────┴────────╯
```

`$jan | polars concat $feb` gives the same result. At least one argument is required, or the command fails with `At least one other dataframe must be provided`. Because the result is lazy, `polars concat` combines lazy dataframes from [`polars open`](/commands/docs/polars_open.md) without reading the files until you collect.

By default every input needs the same columns, in the same order, with the same types. A mismatch shows up when you collect, as `'union'/'concat' inputs should all have the same schema`, followed by the two schemas. Two flags relax this:

- `--diagonal` matches columns by name and fills the columns an input lacks with nulls.
- `--to-supertypes` casts columns of different types to a type that holds both, such as `f64` for an `i64` and an `f64` column.

They work together:

```nu
$jan | polars concat ([[month amount note]; [mar 3.5 late]] | polars into-df) --diagonal --to-supertypes | polars collect
# => ╭───┬───────┬────────┬──────╮
# => │ # │ month │ amount │ note │
# => ├───┼───────┼────────┼──────┤
# => │ 0 │ jan   │  10.00 │      │
# => │ 1 │ jan   │  12.00 │      │
# => │ 2 │ mar   │   3.50 │ late │
# => ╰───┴───────┴────────┴──────╯
```

The other flags change how Polars runs the plan, not which rows you get. `--no-maintain-order` lets the rows come out in any order, `--no-parallel` reads the inputs one at a time, `--rechunk` stores the result in one contiguous block of memory, and `--from-partitioned-ds` tells the optimizer that the inputs are parts of one partitioned dataset.

The arguments and the piped-in value have to be dataframes or lazy dataframes, so convert a Nushell table with `polars into-df` first.

## Reshaping dataframes

These commands change the shape of a dataframe. `polars pivot` and `polars unpivot` convert between long and wide layouts, `polars explode` turns list elements into rows, `polars unnest` turns struct fields into columns, and `polars dummies` turns category values into columns of 0s and 1s.

### Pivoting long data to wide

[`polars pivot`](/commands/docs/polars_pivot.md) turns a long table into a wide one. The distinct values of the `--on` column become new columns, the `--index` columns identify each output row, and the `--values` column fills the cells:

```nu
let sales = [[store month amount]; [north jan 10] [north feb 12] [south jan 7] [south feb 9] [south feb 4]] | polars into-df
$sales | polars pivot --on month --index store --values amount --aggregate sum | polars sort-by store | polars collect
# => ╭───┬───────┬─────┬─────╮
# => │ # │ store │ jan │ feb │
# => ├───┼───────┼─────┼─────┤
# => │ 0 │ north │  10 │  12 │
# => │ 1 │ south │   7 │  13 │
# => ╰───┴───────┴─────┴─────╯
```

`polars pivot` always returns a lazy dataframe, and its rows come out in no particular order unless you pass `--maintain-order`, which keeps them in the order their index values first appear.

You need `--on` and at least one of `--index` and `--values`, or the command fails with `` `pivot` needs either `--index or `--values` needs to be specified ``. If you give only one of them, the other is every remaining column. All three take a column name, a list of names, or a [selector](/commands/docs/polars_selector.md).

`--aggregate` (`-a`) decides what happens when several rows land in the same cell, like the two `south` rows for `feb` above. It takes `first`, `last`, `sum`, `min`, `max`, `mean`, `median`, or `count` (`len` also works). Without it, each cell may hold at most one value, and a duplicate fails when you collect with `aggregation 'item' expected no or a single value, got 2 values`. An unknown name fails with an error such as `wrong is not a valid aggregation`. `--aggregate` also accepts an expression, but the expression can't name a column, and one that does fails with ``explicit column references are not allowed in the `aggregate_function` of `pivot` ``. That leaves expressions such as `(polars len)`.

`--on-cols` (`-c`) lists the values that become columns, in the order you want them. Values you leave out are dropped along with their rows, so the duplicate `feb` rows don't matter here, and a value that never occurs gives a column of nulls:

```nu
$sales | polars pivot --on month --index store --values amount --on-cols [jan mar] --maintain-order | polars collect
# => ╭───┬───────┬─────┬─────╮
# => │ # │ store │ jan │ mar │
# => ├───┼───────┼─────┼─────┤
# => │ 0 │ north │  10 │     │
# => │ 1 │ south │   7 │     │
# => ╰───┴───────┴─────┴─────╯
```

With `--aggregate sum` or `count`, an empty cell holds `0` instead of null. Without `--on-cols`, `polars pivot` reads the `--on` column as soon as it runs to find its distinct values, so on a lazy dataframe from a large file, listing the values yourself saves a pass over the data. If that read fails, for example because the `--on` column doesn't exist, the error is ``Pivot columns cannot be deduced, `--on-cols` must be specified``.

When `--values` names more than one column, the new columns are named after both the value column and the `--on` value, joined by `_`, as in `amount_jan` and `units_jan`. `--separator` (`-p`) replaces the `_`, and `--always-combine-names` uses these combined names even for a single value column. With several `--on` columns, the new column names hold every value, as in `{"south","jan"}`.

### Unpivoting wide data to long

[`polars unpivot`](/commands/docs/polars_unpivot.md) is the reverse of `polars pivot`. It turns the `--on` columns into rows, with one column holding the old column name and another holding its value. The `--index` columns are repeated on each row:

```nu
let wide = [[store jan feb]; [north 10 12] [south 7 9]] | polars into-df
$wide | polars unpivot --index [store] --on [jan feb] --variable-name month --value-name amount | polars collect
# => ╭───┬───────┬───────┬────────╮
# => │ # │ store │ month │ amount │
# => ├───┼───────┼───────┼────────┤
# => │ 0 │ north │ jan   │     10 │
# => │ 1 │ south │ jan   │      7 │
# => │ 2 │ north │ feb   │     12 │
# => │ 3 │ south │ feb   │      9 │
# => ╰───┴───────┴───────┴────────╯
```

Without `--variable-name` (`-r`) and `--value-name` (`-l`), the new columns are named `variable` and `value`. The rows come out grouped by `--on` column, in the order you listed them.

Both `--index` and `--on` are required, and each takes a list of column names or a selector, such as `--on (polars selector numeric)`. Pass `--index []` to keep no identifying columns. Columns the two lists leave out are dropped. The `--on` columns should share a type. If they don't, the values are cast to a common type, so unpivoting a string column together with an int column gives a `str` value column. A name that doesn't exist fails when you collect, with `not found: "nope" not found`.

`polars unpivot` always returns a lazy dataframe.

### Exploding list columns

[`polars explode`](/commands/docs/polars_explode.md) turns each element of a list column into its own row and repeats the other columns' values. By default a row whose list is empty disappears:

```nu
let posts = [[id tags]; [1 [nu shell]] [2 [data]] [3 []]] | polars into-df
$posts | polars explode tags | polars collect
# => ╭───┬────┬───────╮
# => │ # │ id │ tags  │
# => ├───┼────┼───────┤
# => │ 0 │  1 │ nu    │
# => │ 1 │  1 │ shell │
# => │ 2 │  2 │ data  │
# => ╰───┴────┴───────╯
```

`--empty-as-null` keeps a row with a null for each empty list, so `id` 3 stays in the result above. `--keep-nulls` does the same for a list that is itself null, which is otherwise dropped too.

To explode several list columns at once, pass their names as one list, or pass a selector such as `(polars selector list)`. The lists in each row must have the same length, or collecting fails with `exploded columns must have matching element counts`:

```nu
[[id tags votes]; [1 [nu shell] [5 3]] [2 [data] [8]]] | polars into-df | polars explode [tags votes] | polars collect
# => ╭───┬────┬───────┬───────╮
# => │ # │ id │ tags  │ votes │
# => ├───┼────┼───────┼───────┤
# => │ 0 │  1 │ nu    │     5 │
# => │ 1 │  1 │ shell │     3 │
# => │ 2 │  2 │ data  │     8 │
# => ╰───┴────┴───────┴───────╯
```

`polars explode` returns a lazy dataframe for both eager and lazy input. Errors show up when you collect. A column that isn't a list fails with an error such as `` `explode` operation not supported for dtype `i64` ``, and calling it without a column fails with `no columns provided in explode`.

Given an expression, as in `polars col tags | polars explode`, it builds an expression that you can use in `polars select`. The exploded column has more rows than the dataframe, so it can't sit next to unexploded columns in the same `polars select`, which fails with an error such as `lengths don't match: Series length 2 doesn't match the DataFrame height of 4`.

[`polars flatten`](/commands/docs/polars_flatten.md) is an alias for `polars explode` with fewer options. It has no `--empty-as-null` or `--keep-nulls`, so it always drops empty and null lists. It takes one column name, and an eager dataframe or an expression as input. Like `polars explode`, it returns a lazy dataframe.

### Unnesting struct columns

A struct column holds a record in each row, with the same fields in every record. Reading JSON or NDJSON files with nested objects gives you struct columns. [`polars unnest`](/commands/docs/polars_unnest.md) replaces a struct column with one column per field, at the struct's position:

```nu
'{"id": 1, "person": {"name": "Bob", "age": 36}}
{"id": 2, "person": {"name": "Betty", "age": 63}}' | save --force people.ndjson
polars open people.ndjson | polars unnest person | polars collect
# => ╭───┬────┬───────┬─────╮
# => │ # │ id │ name  │ age │
# => ├───┼────┼───────┼─────┤
# => │ 0 │  1 │ Bob   │  36 │
# => │ 1 │  2 │ Betty │  63 │
# => ╰───┴────┴───────┴─────╯
```

The new columns take the field names. If one of them is already the name of another column, the result fails with `column with name 'id' has more than one occurrence`. `--separator` (`-s`) avoids that by prefixing each name with the struct column's name and the separator:

```nu
polars open people.ndjson | polars unnest person --separator "." | polars collect
# => ╭───┬────┬─────────────┬────────────╮
# => │ # │ id │ person.name │ person.age │
# => ├───┼────┼─────────────┼────────────┤
# => │ 0 │  1 │ Bob         │         36 │
# => │ 1 │  2 │ Betty       │         63 │
# => ╰───┴────┴─────────────┴────────────╯
```

List several struct columns to unnest them all. With no column names, `polars unnest` returns the dataframe unchanged. A column that isn't a struct fails with an error such as ``invalid series dtype: expected `Struct`, got `i64` ``. `polars unnest` returns the same kind of dataframe it was given, and a lazy one reports these errors when you collect.

Records in a Nushell table become an `object` column in `polars into-df`, which `polars unnest` can't split. To get a struct column, read the records from a JSON or NDJSON file, as above.

### Encoding structs as JSON

To turn each row's struct into JSON text, such as `{"name":"Bob","age":36}`, convert the dataframe to a Nushell table and encode the records with [`to json`](/commands/docs/to_json.md):

```nu
polars open people.ndjson | polars collect | polars into-nu | update person {|row| $row.person | to json --raw }
# => ╭───┬────┬───────────────────────────╮
# => │ # │ id │          person           │
# => ├───┼────┼───────────────────────────┤
# => │ 0 │  1 │ {"name":"Bob","age":36}   │
# => │ 1 │  2 │ {"name":"Betty","age":63} │
# => ╰───┴────┴───────────────────────────╯
```

### One-hot encoding

[`polars dummies`](/commands/docs/polars_dummies.md) does one-hot encoding. For each column it adds one `u8` column per distinct value, named `<column>_<value>`, holding `1` in the rows that have that value and `0` elsewhere. The new columns are sorted by value:

```nu
[[color size]; [red 1] [blue 2] [red 3]] | polars into-df | polars dummies
# => ╭───┬────────────┬───────────┬────────┬────────┬────────╮
# => │ # │ color_blue │ color_red │ size_1 │ size_2 │ size_3 │
# => ├───┼────────────┼───────────┼────────┼────────┼────────┤
# => │ 0 │          0 │         1 │      1 │      0 │      0 │
# => │ 1 │          1 │         0 │      0 │      1 │      0 │
# => │ 2 │          0 │         1 │      0 │      0 │      1 │
# => ╰───┴────────────┴───────────┴────────┴────────┴────────╯
```

`polars dummies` encodes every column and keeps none of the originals, so select the category columns first, then add the result back with `polars append`. A lazy input is collected, and the result is always an eager dataframe.

- `--drop-first` (`-d`) leaves out the column for the value that appears first in each input column, `color_red` and `size_1` above. Statistical models often need this, because the dropped column can be worked out from the others.
- `--drop-nulls` (`-n`) leaves out the `<column>_null` column that a column with nulls otherwise gets, so a null row is `0` in every column.

## Missing values and duplicates

Polars keeps two kinds of gaps apart. A null is a missing value in a column of any type. `NaN` is a float that isn't a number, and Polars treats it as an ordinary float value. Each kind has its own commands.

The examples in this section use this dataframe:

```nu
let scores = [[name score team]; [ann 7 red] [bob null blue] [cy 5 null] [dee null null]] | polars into-df
```

### Dropping rows with nulls

[`polars drop-nulls`](/commands/docs/polars_drop-nulls.md) removes every row that has a null in any column:

```nu
$scores | polars drop-nulls
# => ╭───┬──────┬───────┬──────╮
# => │ # │ name │ score │ team │
# => ├───┼──────┼───────┼──────┤
# => │ 0 │ ann  │     7 │ red  │
# => ╰───┴──────┴───────┴──────╯
```

To look for nulls only in some columns, pass their names as a list held in a variable declared as `any`:

```nu
let cols: any = [score]
$scores | polars drop-nulls $cols
# => ╭───┬──────┬───────┬──────╮
# => │ # │ name │ score │ team │
# => ├───┼──────┼───────┼──────┤
# => │ 0 │ ann  │     7 │ red  │
# => │ 1 │ cy   │     5 │      │
# => ╰───┴──────┴───────┴──────╯
```

A name that isn't a column fails with `Error dropping nulls` and `not found: "nope" not found`, and a name that isn't a string fails with `Incorrect column format`.

`polars drop-nulls` returns the kind of dataframe it was given. Given a lazy dataframe, it runs the plan up to that point right away, drops the rows, and wraps the result in a new lazy dataframe. A row with `NaN` stays, because `NaN` isn't null. A column that held only nulls when you built it has the generic `object` type (see [How values become columns](../dataframes.md#how-values-become-columns)), and `polars drop-nulls` doesn't see the nulls in an `object` column. Give the column a real type with `--schema` when you create the dataframe if you need to drop those rows.

### Filling nulls

[`polars fill-null`](/commands/docs/polars_fill-null.md) replaces nulls with a value. Given a dataframe, it fills every column with the same value, and Polars converts columns to make the value fit. Filling with a string turns the `score` column, which held `i64` values, into a `str` column:

```nu
$scores | polars fill-null "none"
# => ╭───┬──────┬───────┬──────╮
# => │ # │ name │ score │ team │
# => ├───┼──────┼───────┼──────┤
# => │ 0 │ ann  │ 7     │ red  │
# => │ 1 │ bob  │ none  │ blue │
# => │ 2 │ cy   │ 5     │ none │
# => │ 3 │ dee  │ none  │ none │
# => ╰───┴──────┴───────┴──────╯
```

Filling with `0` instead keeps `score` as `i64` but writes the text `0` into the `team` column. To give each column its own fill, use the expression form inside [`polars with-column`](/commands/docs/polars_with-column.md) or [`polars select`](/commands/docs/polars_select.md). The fill can be an expression too, such as the column's mean:

```nu
$scores | polars with-column [
    (polars col score | polars fill-null (polars col score | polars mean))
    (polars col team | polars fill-null "none")
] | polars collect
# => ╭───┬──────┬───────┬──────╮
# => │ # │ name │ score │ team │
# => ├───┼──────┼───────┼──────┤
# => │ 0 │ ann  │  7.00 │ red  │
# => │ 1 │ bob  │  6.00 │ blue │
# => │ 2 │ cy   │  5.00 │ none │
# => │ 3 │ dee  │  6.00 │ none │
# => ╰───┴──────┴───────┴──────╯
```

The mean is a float, so `score` becomes an `f64` column. A string fill is always a literal value, never a column name, so `polars fill-null "team"` writes the word `team`. Use `polars col team` to fill from another column.

`polars fill-null` returns the kind of input it was given: an eager dataframe for an eager one, a lazy dataframe for a lazy one, and an expression for an expression. To fill several columns with one expression, pick them with `polars col`, which takes several names or `--type`. The same goes for `polars cast` and `polars shift` below. `polars fill-nan` given a lazy dataframe returns an eager one.

### Filling NaN

[`polars fill-nan`](/commands/docs/polars_fill-nan.md) replaces `NaN` and leaves nulls alone. Use its expression form:

```nu
let readings = [[sensor temp]; [a 21.5] [b NaN] [c null]] | polars into-df
$readings | polars with-column (polars col temp | polars fill-nan 0.0) | polars collect
# => ╭───┬────────┬───────╮
# => │ # │ sensor │ temp  │
# => ├───┼────────┼───────┤
# => │ 0 │ a      │ 21.50 │
# => │ 1 │ b      │  0.00 │
# => │ 2 │ c      │       │
# => ╰───┴────────┴───────╯
```

Add `| polars fill-null 0.0` after it to fill both kinds of gaps in one column.

### Dropping duplicate rows

[`polars drop-duplicates`](/commands/docs/polars_drop-duplicates.md) keeps the first of each set of identical rows, and the rows stay in their original order:

```nu
let visits = [[id city temp]; [3 oslo 4] [1 rome 18] [3 oslo 4] [2 oslo 6] [1 rome 20]] | polars into-df
$visits | polars drop-duplicates
# => ╭───┬────┬──────┬──────╮
# => │ # │ id │ city │ temp │
# => ├───┼────┼──────┼──────┤
# => │ 0 │  3 │ oslo │    4 │
# => │ 1 │  1 │ rome │   18 │
# => │ 2 │  2 │ oslo │    6 │
# => │ 3 │  1 │ rome │   20 │
# => ╰───┴────┴──────┴──────╯
```

Pass column names to compare only those columns, in a variable typed `any` as with `polars drop-nulls`. `--last` (`-l`) keeps the last row of each set instead of the first:

```nu
let by_city: any = [city]
$visits | polars drop-duplicates $by_city --last
# => ╭───┬────┬──────┬──────╮
# => │ # │ id │ city │ temp │
# => ├───┼────┼──────┼──────┤
# => │ 0 │  2 │ oslo │    6 │
# => │ 1 │  1 │ rome │   20 │
# => ╰───┴────┴──────┴──────╯
```

A missing column fails with `Error dropping duplicates`. Like `polars drop-nulls`, the command runs a lazy plan right away and returns the result as a lazy dataframe. [`polars unique`](../dataframes.md#unique-values) on a lazy dataframe does the same job with `--subset` and `--last`, but stays part of the plan until you collect it.

## Changing column types

Polars picks each column's type when it builds a dataframe, as described in [How values become columns](../dataframes.md#how-values-become-columns). These commands change a column's type afterward, or build type and schema values you can reuse. Type names are the ones `polars schema --datatype-list` prints, such as `i32`, `f32`, `str`, and `datetime<ms, UTC>`. Nushell's own names, such as `int` or `string`, fail with `Invalid polars data type` and `Unknown type: int`.

The full set of type names is:

- `bool`, `str`, `binary`, `date`, `time`, `null`, `object`, and `unknown`.
- The integers `i8`, `i16`, `i32`, `i64`, `u8`, `u16`, `u32`, and `u64`, and the floats `f32` and `f64`.
- `datetime<unit, zone>`. The unit is `ms`, `us` (or `μs`), or `ns`. The zone is a name from the time zone database, such as `UTC` or `America/Los_Angeles`, or `*` for a datetime without a zone.
- `duration<unit>`, with the same units.
- `decimal<precision, scale>`, such as `decimal<10, 2>`. A `*` as the precision gives the largest one, 38. The scale must be a number.
- `list<type>` with any of these inside, such as `list<str>` or `list<list<i64>>`.

```nu
{price: 'decimal<*, 2>', tags: 'list<str>', at: 'datetime<ms, *>', took: 'duration<us>', opens: time} | polars into-schema
# => ╭───────┬───────────────╮
# => │ price │ decimal<38,2> │
# => │ tags  │ list<str>     │
# => │ at    │ datetime<ms>  │
# => │ took  │ duration<μs>  │
# => │ opens │ time          │
# => ╰───────┴───────────────╯
```

### Casting columns

[`polars cast`](/commands/docs/polars_cast.md) takes a type and, for a dataframe, the name of the column to convert. It converts one column per call and returns the kind of dataframe it was given. Leaving out the column name fails with `Missing parameter: column_name.`

A cast doesn't fail on values it can't convert. They become null, as the `n/a` id does here:

```nu
let prices = [[id price qty]; ["7" 1.25 3] ["12" 2.5 10] ["n/a" 4.0 1]] | polars into-df
$prices | polars cast u32 id
# => ╭───┬────┬───────┬─────╮
# => │ # │ id │ price │ qty │
# => ├───┼────┼───────┼─────┤
# => │ 0 │  7 │  1.25 │   3 │
# => │ 1 │ 12 │  2.50 │  10 │
# => │ 2 │    │  4.00 │   1 │
# => ╰───┴────┴───────┴─────╯
```

The same goes for numbers out of range, so casting `300` or `-1` to `u8` gives null. Check for new nulls after a cast if the data might not fit.

On an expression, `polars cast` takes only the type. That's the way to convert several columns at once, or to keep the original column and add a converted copy with [`polars as`](/commands/docs/polars_as.md):

```nu
$prices | polars select (polars col price qty | polars cast f32) | polars collect | polars schema
# => ╭───────┬─────╮
# => │ price │ f32 │
# => │ qty   │ f32 │
# => ╰───────┴─────╯
```

On an eager dataframe, a missing column fails right away with `not found: "nope" not found`. On a lazy one, the error comes when you collect, as `unable to find column "nope"`.

### Type and schema values

[`polars into-dtype`](/commands/docs/polars_into-dtype.md) turns a type name into a `polars_datatype` value, and [`polars into-schema`](/commands/docs/polars_into-schema.md) turns a record of column names and types into a `polars_schema` value. Both check the names right away, so a typo fails with `Invalid polars data type` before any data is read. The plugin stores both values in its [object store](../dataframes.md#the-object-store), listed as `DataType` and `Schema`.

Commands that take a schema record also take a schema value. That includes `--schema` on `polars into-df`, `polars into-lazy`, and `polars open`, so you can define a schema once and use it for several dataframes:

```nu
let schema = {id: u32, name: str, score: f32} | polars into-schema
[[id name score]; [1 ann 7.5] [2 bob 9]] | polars into-df --schema $schema | polars schema
# => ╭───────┬─────╮
# => │ id    │ u32 │
# => │ name  │ str │
# => │ score │ f32 │
# => ╰───────┴─────╯
```

`polars into-schema` takes only a record, and a list fails with `Can't convert to record.` Each value in the record is a type name, a `polars_datatype` value, or a nested record, which describes a `struct` column with those fields. The schema prints as a record, and [`polars into-nu`](/commands/docs/polars_into-nu.md) turns it into a plain record of type names.

A `polars_datatype` value also works in the places that accept a type name without requiring a string. Those are an entry in a schema record, the type argument of [`polars integer`](/commands/docs/polars_integer.md), and `--return-dtype` on `polars map-batches`. `polars cast` requires a string. To keep a type in a variable, declare the variable as `any`:

```nu
let small: any = 'u8' | polars into-dtype
{id: $small, name: str} | polars into-schema
# => ╭──────┬─────╮
# => │ id   │ u8  │
# => │ name │ str │
# => ╰──────┴─────╯
```

## Binning values

[`polars cut`](/commands/docs/polars_cut.md) and [`polars qcut`](/commands/docs/polars_qcut.md) sort numbers into ranges, called bins. `polars cut` takes the break points between bins. `polars qcut` takes quantile probabilities and works out the break points from the data.

Both work on a one-column dataframe, so pick the column with `polars get` first. A wider dataframe fails with `Error using as series`. A lazy input is collected, and the result is always an eager dataframe with one column named `category`, whatever the input column was called. Nulls stay null, and a column of strings gives null for every row. The `category` column is an `enum` column from `polars cut` and a categorical one from `polars qcut`, and the examples here cast it to `str` with `polars cast str category`:

```nu
let ages = [[age]; [3] [17] [18] [40] [65] [80]] | polars into-df
$ages | polars get age | polars cut [17 64] | polars cast str category
# => ╭───┬────────────╮
# => │ # │  category  │
# => ├───┼────────────┤
# => │ 0 │ (-inf, 17] │
# => │ 1 │ (-inf, 17] │
# => │ 2 │ (17, 64]   │
# => │ 3 │ (17, 64]   │
# => │ 4 │ (64, inf]  │
# => │ 5 │ (64, inf]  │
# => ╰───┴────────────╯
```

The bins can go back next to the data. `--labels` (`-l`) names the bins, and it needs one more label than there are break points:

```nu
$ages | polars with-column ($ages | polars get age | polars cut [17 64] --labels [child adult senior] | polars cast str category) --name group
# => ╭───┬─────┬────────╮
# => │ # │ age │ group  │
# => ├───┼─────┼────────┤
# => │ 0 │   3 │ child  │
# => │ 1 │  17 │ child  │
# => │ 2 │  18 │ adult  │
# => │ 3 │  40 │ adult  │
# => │ 4 │  65 │ senior │
# => │ 5 │  80 │ senior │
# => ╰───┴─────┴────────╯
```

The wrong number of labels fails with `Error cutting series` and `lengths don't match: provide len(quantiles) + 1 labels`. The break points have to be a list of numbers, even for one break. A bare number fails with `Can't convert to list<float>`. They can come in any order, but a repeated break fails with `breaks are not unique`.

By default each bin includes its upper edge, as in `(17, 64]`. `--left_closed` (`-c`) makes bins include the lower edge instead, as in `[17, 64)`. `--include_breaks` (`-b`) turns `category` into a struct column with a `breakpoint` field, the upper edge of the row's bin as a float, next to the `category` label. Split it with `polars unnest`:

```nu
$ages | polars get age | polars cut [17 64] --include_breaks | polars unnest category | polars cast str category
# => ╭───┬────────────┬────────────╮
# => │ # │ breakpoint │  category  │
# => ├───┼────────────┼────────────┤
# => │ 0 │      17.00 │ (-inf, 17] │
# => │ 1 │      17.00 │ (-inf, 17] │
# => │ 2 │      64.00 │ (17, 64]   │
# => │ 3 │      64.00 │ (17, 64]   │
# => │ 4 │        inf │ (64, inf]  │
# => │ 5 │        inf │ (64, inf]  │
# => ╰───┴────────────┴────────────╯
```

These flag names use underscores, unlike most Nushell flags.

`polars qcut` takes the same flags. Its probabilities go between 0 and 1, and Polars puts a break at each of those quantiles of the data. Here, breaks at the 25% and 75% quantiles put the middle half of the values in one bin:

```nu
let sizes = [1 2 3 4 5 6 7 8] | polars into-df
$sizes | polars qcut [0.25 0.75] | polars cast str category
# => ╭───┬──────────────╮
# => │ # │   category   │
# => ├───┼──────────────┤
# => │ 0 │ (-inf, 2.75] │
# => │ 1 │ (-inf, 2.75] │
# => │ 2 │ (2.75, 6.25] │
# => │ 3 │ (2.75, 6.25] │
# => │ 4 │ (2.75, 6.25] │
# => │ 5 │ (2.75, 6.25] │
# => │ 6 │ (6.25, inf]  │
# => │ 7 │ (6.25, inf]  │
# => ╰───┴──────────────╯
```

A probability outside that range fails with `quantile should be between 0.0 and 1.0`. For equal-sized bins, list the probabilities, such as `[0.25 0.5 0.75]` for quartiles.

When many values repeat, two quantiles can land on the same value. Then `polars qcut` fails with `quantiles are not unique while allow_duplicates=False`. `--allow_duplicates` (`-d`) drops the repeated breaks and gives fewer bins instead.

## Sampling and shifting rows

These commands pick random rows, or move values up or down a column.

### Random samples

[`polars sample`](/commands/docs/polars_sample.md) picks rows at random. Ask for a count with `--n-rows` (`-n`) or a share of the rows with `--fraction` (`-f`). Pass exactly one of them. Neither fails with `No selection`, and both fail with `Incompatible flags`. `--seed` (`-s`) takes an integer and makes the choice repeatable:

```nu
let nums = 0..9 | wrap n | polars into-df
$nums | polars sample --n-rows 4 --seed 42
# => ╭───┬───╮
# => │ # │ n │
# => ├───┼───┤
# => │ 0 │ 2 │
# => │ 1 │ 5 │
# => │ 2 │ 7 │
# => │ 3 │ 8 │
# => ╰───┴───╯
$nums | polars sample --n-rows 4 --seed 42 --shuffle
# => ╭───┬───╮
# => │ # │ n │
# => ├───┼───┤
# => │ 0 │ 5 │
# => │ 1 │ 2 │
# => │ 2 │ 8 │
# => │ 3 │ 7 │
# => ╰───┴───╯
```

As the first result shows, the picked rows keep their input order unless you add `--shuffle` (`-u`). A float seed fails with `Can't convert to int.`

Without `--replace` (`-e`), each row can be picked once, so asking for more rows than the dataframe has, or a fraction above 1, fails with `cannot take a larger sample than the total population`. With `--replace`, a row can come up more than once, the sample can be larger than the dataframe, and the rows come out in random order. A negative count fails with `conversion from i64 to u64 failed`.

A lazy input is collected first, and the result is an eager dataframe. The same seed picks the same rows from an eager dataframe and from a lazy one with the same data.

### Shifting values

[`polars shift`](/commands/docs/polars_shift.md) moves values down a column by the given number of rows, or up for a negative number, and fills the gap with nulls. A shift larger than the column leaves only nulls. Its main use is comparing each row with a neighbor, such as the change from the day before:

```nu
let sales = [[day units]; [mon 10] [tue 12] [wed 9]] | polars into-df
$sales | polars with-column ((polars col units) - (polars col units | polars shift 1) | polars as change) | polars collect
# => ╭───┬─────┬───────┬────────╮
# => │ # │ day │ units │ change │
# => ├───┼─────┼───────┼────────┤
# => │ 0 │ mon │    10 │        │
# => │ 1 │ tue │    12 │      2 │
# => │ 2 │ wed │     9 │     -3 │
# => ╰───┴─────┴───────┴────────╯
```

What `polars shift` does depends on its input:

- On an expression, as above, it shifts one column, and `--fill` (`-f`) sets the value for the gap, as in `polars col units | polars shift -1 --fill 0`.
- On a lazy dataframe, it shifts every column together. `--fill` fills the gap in every column, and like `polars fill-null`, it converts columns to fit, so `--fill 0` writes the text `0` into a string column.
- On an eager dataframe, it works only on a one-column dataframe, and a wider one fails with `Error using as series`. Use the expression or lazy form when you need `--fill`.

```nu
$sales | polars into-lazy | polars shift 1 --fill 0 | polars collect
# => ╭───┬─────┬───────╮
# => │ # │ day │ units │
# => ├───┼─────┼───────┤
# => │ 0 │ 0   │     0 │
# => │ 1 │ mon │    10 │
# => │ 2 │ tue │    12 │
# => ╰───┴─────┴───────╯
```

The result is the same kind as the input.

## Inspecting dataframes and plans

These commands report on a dataframe or a lazy query instead of changing it. They give per-column statistics, Polars' own text layout, the time each step of a query takes, and control over which steps run only once.

### Summary statistics

[`polars summary`](/commands/docs/polars_summary.md) computes the same set of statistics for every column and returns them as a dataframe with one row per statistic:

```nu
let scores = [[name score ratio]; [ann 7 0.5] [bob 9 1.5] [cy 4 null] [dee 9 2.0]] | polars into-df
$scores | polars summary
# => ╭───┬────────────┬────────────┬─────────────┬─────────────╮
# => │ # │ descriptor │ name (str) │ score (i64) │ ratio (f64) │
# => ├───┼────────────┼────────────┼─────────────┼─────────────┤
# => │ 0 │ count      │       4.00 │        4.00 │        4.00 │
# => │ 1 │ sum        │            │       29.00 │        4.00 │
# => │ 2 │ mean       │            │        7.25 │        1.33 │
# => │ 3 │ median     │            │        8.00 │        1.50 │
# => │ 4 │ std        │            │        2.05 │        0.62 │
# => │ 5 │ min        │            │        4.00 │        0.50 │
# => │ 6 │ 25%        │            │        7.00 │        1.50 │
# => │ 7 │ 50%        │            │        9.00 │        1.50 │
# => │ 8 │ 75%        │            │        9.00 │        2.00 │
# => │ 9 │ max        │            │        9.00 │        2.00 │
# => ╰───┴────────────┴────────────┴─────────────┴─────────────╯
```

The `descriptor` column names each statistic. Every other column is named after an input column and its type, and holds floats. A few of the numbers need explaining:

- `count` is the number of rows, nulls included, which is why `ratio` shows 4 with one value missing. The other statistics skip nulls. To count only the values that are there, use [`polars count`](/commands/docs/polars_count.md).
- `std` divides by the number of values. [`polars std`](/commands/docs/polars_std.md) divides by one less by default, so it gives 2.36 for `score` where `polars summary` gives 2.05.
- `median` averages the two middle values when there's an even number of them, but the percentile rows pick the nearest actual value. That's why `score` has a median of 8 and a `50%` of 9.
- A string column gets only a `count`. A boolean column gets `sum`, which counts the `true` values, and `mean`, `min`, and `max`. A datetime column's statistics come out as nanoseconds since 1970. Columns of the generic `object` type are left out.

`--quantiles` (`-q`) replaces the `25%`, `50%`, and `75%` rows with the fractions you list, such as `--quantiles [0.1 0.9]` for `10%` and `90%` rows. A number outside 0 to 1 fails with `Incorrect value for quantile`.

Given a lazy dataframe, `polars summary` collects it, computes the statistics, and returns them as a lazy dataframe, so end the pipeline with `polars collect`. A dataframe with no rows gives a `count` and `sum` of 0 and nulls everywhere else.

### Entropy

[`polars entropy`](/commands/docs/polars_entropy.md) is an expression that reduces a numeric column to its Shannon entropy, `-sum(pk * log(pk))`. It reads the column's values as the weights of a distribution, so give it counts or probabilities, not raw measurements. By default it divides each value by the column's total first and uses the natural logarithm. `--base` picks another base, such as 2 for an answer in bits:

```nu
let weights = [[g p]; [a 1] [a 1] [b 1] [b 3]] | polars into-df
$weights | polars group-by g | polars agg (polars col p | polars entropy --base 2) | polars sort-by g | polars collect
# => ╭───┬───┬──────╮
# => │ # │ g │  p   │
# => ├───┼───┼──────┤
# => │ 0 │ a │ 1.00 │
# => │ 1 │ b │ 0.81 │
# => ╰───┴───┴──────╯
```

`--normalize false` skips the division and uses the values as they are, which only makes sense for a column that already sums to 1. On the whole `p` column above it gives -3.30, a number with no meaning as an entropy.

For the entropy of a column of categories, count the categories first with [`polars value-counts`](/commands/docs/polars_value-counts.md):

```nu
[[word]; [x] [x] [y] [z]] | polars into-df | polars get word | polars value-counts | polars select (polars col count | polars entropy --base 2) | polars collect
# => ╭───┬───────╮
# => │ # │ count │
# => ├───┼───────┤
# => │ 0 │  1.50 │
# => ╰───┴───────╯
```

Pointing `polars entropy` at a string column fails when the plan runs, with `expected numerical input for 'entropy'`. It works only on expressions, and piping a dataframe into it fails with `Command does not support polars_dataframe input`. Pick the column with `polars col`.

### Polars' own text layout

[`polars into-repr`](/commands/docs/polars_into-repr.md) returns the text that Polars prints for a dataframe, as a string. It shows the shape, each column's type under its name, and `null` for missing values, which helps when you compare results with Python Polars or paste a dataframe into a bug report:

```nu
[[name score ratio]; [ann 7 0.5] [bob 9 null]] | polars into-df | polars into-repr
# => shape: (2, 3)
# => ┌──────┬───────┬───────┐
# => │ name ┆ score ┆ ratio │
# => │ ---  ┆ ---   ┆ ---   │
# => │ str  ┆ i64   ┆ f64   │
# => ╞══════╪═══════╪═══════╡
# => │ ann  ┆ 7     ┆ 0.5   │
# => │ bob  ┆ 9     ┆ null  │
# => └──────┴───────┴───────┘
```

A lazy dataframe is collected first, so the string shows data, not the plan. Polars shortens big dataframes. Past 10 rows it prints the first five and the last five with a `…` row between them, and on a wide dataframe it replaces the middle columns with a `…` column. Polars' `POLARS_FMT_MAX_ROWS` and `POLARS_FMT_MAX_COLS` environment variables change those limits. The plugin reads its environment when it starts, so set them in `$env` and then run `plugin stop polars` if the plugin is already running.

### Profiling a query

[`polars profile`](/commands/docs/polars_profile.md) runs a lazy query and records how long each step took. It returns a record of two eager dataframes. `dataframe` holds the query's result, the same data `polars collect` would give. `profiling` has a row per step, with the step in `node` and its `start` and `end` times, in microseconds from the start of the query:

```nu
let lf = [[a b]; [3 6] [1 2] [2 4] [4 1]] | polars into-lazy
let result: record = $lf | polars filter ((polars col b) > 2) | polars sort-by a | polars profile
$result.dataframe
# => ╭───┬───┬───╮
# => │ # │ a │ b │
# => ├───┼───┼───┤
# => │ 0 │ 2 │ 4 │
# => │ 1 │ 3 │ 6 │
# => ╰───┴───┴───╯
$result.profiling | polars select node | polars collect
# => ╭───┬─────────────────────────────╮
# => │ # │            node             │
# => ├───┼─────────────────────────────┤
# => │ 0 │ optimization                │
# => │ 1 │ .filter([(col("b")) > (2)]) │
# => │ 2 │ sort(a)                     │
# => ╰───┴─────────────────────────────╯
```

The example leaves out `start` and `end` because they change from run to run. The `optimization` row is the time Polars spent optimizing the plan before running it. Not every step gets a row of its own. A `polars group-by` with `polars agg`, for one, doesn't appear in the list. An eager dataframe has no steps to run, so its profile holds only the `optimization` row. If the query fails, for example because it selects a column that doesn't exist, `polars profile` fails with `Could not profile dataframe:` and Polars' message.

### Caching part of a plan

[`polars cache`](/commands/docs/polars_cache.md) marks the lazy plan built so far, so that one run of the query computes it once and reuses the result everywhere later steps read it. It adds a `CACHE` node to the plan. It has nothing to do with the plugin's [object store](../dataframes.md#the-object-store), which holds dataframes between commands.

```nu
[[a b]; [6 2] [4 2] [2 2]] | polars into-lazy | polars with-column ((polars col a) * 10 | polars as c) | polars cache
# => ╭────────────────┬─────────────────────────────────────────────────╮
# => │ plan           │ CACHE[id: c2db5d26-8672-4840-adc7-f84c69f803ad] │
# => │                │    WITH_COLUMNS:                                │
# => │                │    [(col("a") * 10).alias("c")]                 │
# => │                │     DF ["a", "b"]; PROJECT */2 COLUMNS          │
# => │ optimized_plan │  WITH_COLUMNS:                                  │
# => │                │  [(col("a") * 10).alias("c")]                   │
# => │                │   DF ["a", "b"]; PROJECT */2 COLUMNS            │
# => ╰────────────────┴─────────────────────────────────────────────────╯
```

The `CACHE` node is gone from `optimized_plan` because nothing reads that part of the plan twice. A cache matters when the cached frame feeds two branches of one query, such as a lazy dataframe joined with an aggregate of itself. Polars' optimizer adds a cache by itself when it finds the same steps twice in one query, though, so in a case like that join `polars cache` often only makes the sharing visible in `plan`.

The cache lasts for one run. Collecting the same lazy dataframe again runs the cached steps again, and a lazy dataframe opened from a file picks up changes to the file. On an eager dataframe, `polars cache` builds a one-step plan and collects it at once, so it returns the same data and has no effect.

### Counting rows

[`polars len`](/commands/docs/polars_len.md) is an expression for the number of rows, like `COUNT(*)` in SQL. It counts every row, nulls included, and names its column `len`, with the type `u64`. `polars count` counts only a column's non-null values:

```nu
let df = [[k v]; [x 1] [y null] [x 3]] | polars into-df
$df | polars select (polars len) (polars col v | polars count) | polars collect
# => ╭───┬─────┬───╮
# => │ # │ len │ v │
# => ├───┼─────┼───┤
# => │ 0 │   3 │ 2 │
# => ╰───┴─────┴───╯
```

`polars len` ignores its input. `$df | polars len` doesn't count `$df`, it returns the same expression as a bare `polars len`, so put it inside `polars select`, `polars with-column`, or `polars agg`. In `polars agg` it counts the rows of each group, as [Grouping keys and aggregations](../dataframes.md#grouping-keys-and-aggregations) shows, and in `polars with-column` it repeats the total on every row. Rename its column with `polars as`. To get the number of rows and columns of a dataframe at once, use [`polars shape`](/commands/docs/polars_shape.md).

## Querying with SQL

[`polars query`](/commands/docs/polars_query.md) runs a SQL `SELECT` statement against a dataframe, which is always the table `df`. The plugin doesn't use Polars' SQL engine for this. It has its own small translator that turns a few SQL clauses into Polars operations, so stick to the parts of SQL listed below.

```nu
let staff = [[name dept salary]; [ann eng 120] [bob eng 100] [cy ops 90] [dee ops 95] [eve hr 80]] | polars into-df
$staff | polars query "SELECT name, salary * 2 AS double FROM df WHERE salary > 90 AND dept = 'eng' OR salary < 85"
# => ╭───┬──────┬────────╮
# => │ # │ name │ double │
# => ├───┼──────┼────────┤
# => │ 0 │ ann  │    240 │
# => │ 1 │ bob  │    200 │
# => │ 2 │ eve  │    160 │
# => ╰───┴──────┴────────╯
$staff | polars query "SELECT dept, sum(salary) AS total, count(name) AS people FROM df GROUP BY dept" | polars sort-by dept
# => ╭───┬──────┬───────┬────────╮
# => │ # │ dept │ total │ people │
# => ├───┼──────┼───────┼────────┤
# => │ 0 │ eng  │   220 │      2 │
# => │ 1 │ hr   │    80 │      1 │
# => │ 2 │ ops  │   185 │      2 │
# => ╰───┴──────┴───────┴────────╯
```

These parts of SQL work:

- In the `SELECT` list, column names, `*`, the operators `+`, `-`, `*`, `/`, `%`, and `||` (which joins strings), `CAST(x AS type)` with the types in the table below, and `AS` to name a result. An aggregate without `AS` keeps its column's name.
- In `WHERE`, the comparisons `=`, `!=` or `<>`, `<`, `<=`, `>`, and `>=`, joined with `AND`, `OR`, and `XOR` and grouped with parentheses. Put parentheses around each side of `XOR`, as in the example below. Write strings in single quotes. Double quotes name a column, so `dept = "eng"` fails with `unable to find column "eng"`.
- The literals `TRUE`, `FALSE`, and `NULL`, along with numbers and strings, in the `SELECT` list and in `WHERE`.
- `GROUP BY` with column names, and the functions `sum(column)`, `count(column)`, and `count(DISTINCT column)`. `count(column)` skips nulls. The groups come out in no fixed order, so sort the result with `polars sort-by`, as above.
- `LIMIT` with a number.
- A table alias, as in `FROM df AS t` or `FROM df t`. You can't refer to the alias, though, because qualified names such as `t.name` fail.

```nu
$staff | polars query "SELECT name, CAST(salary AS REAL) AS pay, TRUE AS active, NULL AS note FROM df AS t WHERE (salary > 110) XOR (dept = 'eng')"
# => ╭───┬──────┬────────┬────────┬──────╮
# => │ # │ name │  pay   │ active │ note │
# => ├───┼──────┼────────┼────────┼──────┤
# => │ 0 │ bob  │ 100.00 │ true   │      │
# => ╰───┴──────┴────────┴────────┴──────╯
```

`CAST` knows these SQL types:

| SQL type                                                | Polars type                       |
| ------------------------------------------------------- | --------------------------------- |
| `CHAR`, `VARCHAR`, `TEXT`, `STRING`, `CLOB`, `UUID`     | `str`                             |
| `TINYINT`, `SMALLINT`, `INT`, `BIGINT`                  | `i8`, `i16`, `i32`, `i64`         |
| The same followed by `UNSIGNED`, such as `INT UNSIGNED` | `u8`, `u16`, `u32`, `u64`         |
| `FLOAT`, `REAL`                                         | `f32`                             |
| `DOUBLE`                                                | `f64`                             |
| `BOOLEAN`                                               | `bool`                            |
| `DATE`                                                  | `date`                            |
| `TIME`                                                  | `time`                            |
| `TIMESTAMP`                                             | `datetime<us>`, with no time zone |
| `INTERVAL`                                              | `duration<us>`                    |
| `ARRAY<type>` or `type[]`, such as `DOUBLE[]`           | `list` of the inner type          |

Other names, such as `INTEGER`, `DECIMAL`, `NUMERIC`, `BOOL`, and `DOUBLE PRECISION`, fail with `SQL Datatype ... was not supported in polars-sql yet!`. `polars schema` shows the `us` unit as `μs`.

Most unsupported SQL fails with a `Dataframe Error` that says what went wrong:

- Other functions, such as `avg` or `max`, fail with `Function "avg" with args ... was not supported in polars-sql yet!`.
- `IS NULL`, `IN`, `LIKE`, `BETWEEN`, `CASE`, `NOT`, a minus sign in front of a column, and qualified names such as `t.name` fail with `Expression: ... was not supported in polars-sql yet!`.
- `LIMIT` with `OFFSET` fails with `Only support number argument to LIMIT clause`.
- `GROUP BY ALL` and `GROUP BY 0` fail with a `Group-By Error`, and so does `SELECT *` with `GROUP BY`, as `Group-By Error: Can't process wildcard in group-by`. Name the columns to group by instead.
- Two statements fail with `One and only one statement at a time please`, and `UNION` fails with `INSERT, UPDATE is not supported for polars`.
- A table other than `df` fails with a message such as `Table name people was not found`.
- SQL that doesn't parse gives the parser's message, such as `ParserError("Expected: identifier, found: EOF")` for `SELECT name FROM` with no table.

To sort, filter groups, or join, use [`polars sort-by`](/commands/docs/polars_sort-by.md), [`polars filter`](/commands/docs/polars_filter.md), and [`polars join`](/commands/docs/polars_join.md) on the result.

An eager dataframe gives an eager result. A lazy dataframe is collected before the query runs, and the result is a new lazy dataframe that starts from that data, so collect it to see the rows. For anything past a quick filter or group-by, the expression commands in this chapter cover far more than the SQL translator does.

## Running Nushell code on columns

[`polars map-batches`](/commands/docs/polars_map-batches.md) hands columns of a dataframe to a Nushell closure and turns what the closure returns into a column. Reach for it when no Polars expression does what you need, such as a Nushell string command. The closure runs once, in Nushell, on whole columns, so it's slower than an expression and can't take part in a lazy plan.

The closure gets one argument, a list of one-column dataframes. There's one for each column you name after the closure, in that order, or one for every column when you name none. The closure returns a one-column dataframe, a list, or a single value, which becomes a one-row column. `polars map-batches` returns only that column, as an eager dataframe, not the input with a column added. Attach it with `polars with-column`:

```nu
let people = [[name]; ["Ann Lee"] ["Bo Chan"] ["Cy Diaz"]] | polars into-df
let initials = $people | polars map-batches --name initials {|cols|
    $cols.0 | polars into-nu | get name | each { split words | each { str substring 0..0 } | str join }
}
$people | polars with-column $initials
# => ╭───┬─────────┬──────────╮
# => │ # │  name   │ initials │
# => ├───┼─────────┼──────────┤
# => │ 0 │ Ann Lee │ AL       │
# => │ 1 │ Bo Chan │ BC       │
# => │ 2 │ Cy Diaz │ CD       │
# => ╰───┴─────────┴──────────╯
```

Each element of the list is an ordinary dataframe, so `polars` commands and the [series operators](../dataframes.md#series-operators) work on it. To work through the values one at a time with Nushell commands, turn the column into a list with `polars into-nu` and `get`, as above. This closure adds two columns row by row and never leaves Polars:

```nu
[[a b]; [1 4] [2 5] [3 6]] | polars into-df | polars map-batches {|cols| $cols.0 + $cols.1 } a b
# => ╭───┬─────────╮
# => │ # │ sum_a_b │
# => ├───┼─────────┤
# => │ 0 │       5 │
# => │ 1 │       7 │
# => │ 2 │       9 │
# => ╰───┴─────────╯
```

A returned dataframe keeps its column's name, and a list or a single value gets the name `0`. `--name` (`-n`) renames the result. The result can have any number of rows. `polars map-batches` doesn't compare it with the input, but `polars with-column` does, and fails with `lengths don't match: unable to add a column of length 3 to a DataFrame of height 2` when they differ.

`--return-dtype` (`-d`) takes a type name, or a type from `polars into-dtype`, and casts the result to it after the closure returns. It doesn't change how the closure computes. Here the integer division runs first, and the cast only turns the rounded results into floats:

```nu
[[a]; [1] [2] [3]] | polars into-df | polars map-batches {|cols| $cols.0 / 2 } a --return-dtype f64
# => ╭───┬──────╮
# => │ # │  a   │
# => ├───┼──────┤
# => │ 0 │ 0.00 │
# => │ 1 │ 1.00 │
# => │ 2 │ 1.00 │
# => ╰───┴──────╯
```

Values that don't convert become null, so a list of words cast to `i64` gives a column of nulls. An unknown type name fails with `Unknown type`.

A lazy dataframe is collected before the closure runs. Naming a column that doesn't exist fails with `Column 'c' not found`. A closure that returns a dataframe with more than one column fails with `Error using as series`, and one that returns an expression fails with `Can't convert to series`. An error inside the closure is reported as usual, and the plugin also prints `Error evaluating closure in polars map-batches:` and the message on stderr.

To use data from another dataframe in the closure, add it to the input dataframe first, for example with `polars with-column` or `polars join`, and name its column after the closure.
