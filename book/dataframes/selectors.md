# Column Selectors

The [Selecting rows and columns](../dataframes.md#selecting-rows-and-columns) section of the [Dataframes](../dataframes.md) chapter shows a selector in `polars select` and in `polars as`. This page covers all the [`polars selector`](/commands/docs/polars_selector.md) commands. A selector describes a set of columns by name, by position, or by data type. It holds no data. Polars works out which columns it matches when a query runs, using the schema of the dataframe it runs against.

`polars selector` on its own prints its help and the list of subcommands.

[[toc]]

The examples on this page use this dataframe:

```nu
let products = [[id name category price qty in_stock]; [1 apple fruit 0.5 10 true] [2 kale greens 2.25 0 false]] | polars into-df
$products | polars schema
# => ╭──────────┬──────╮
# => │ id       │ i64  │
# => │ name     │ str  │
# => │ category │ str  │
# => │ price    │ f64  │
# => │ qty      │ i64  │
# => │ in_stock │ bool │
# => ╰──────────┴──────╯
```

## Using a selector

A selector is a value of type `polars_selector`. Printing one shows the Polars selector it stands for, which helps when a selector matches something you didn't expect:

```nu
polars selector by-name qty id
# => Some(ByName { names: ["qty", "id"], strict: false })
```

The selector commands ignore their input, so `$products | polars selector integer` returns the same selector as `polars selector integer` and doesn't select anything from `$products`. Pass the selector to a command that takes columns instead. These accept selectors:

- `polars select`, `polars with-column`, `polars group-by`, `polars agg`, `polars sort-by`, and `polars as`
- the list of columns given to `polars concat-str`
- the `polars math` commands, described in [Math Expressions](./math.md)
- `polars str-split` and `polars str-strip-chars`, described in [String Expressions](./strings.md)

[Dates and Times in Dataframes](./dates.md) lists which date commands take a selector. With other commands, such as `polars uppercase` or `polars sum`, pick the columns with `polars col`, which takes several names, a `^...$` regular expression, or `--type`:

```nu
$products | polars select (polars col --type str | polars uppercase) | polars collect
# => ╭───┬───────┬──────────╮
# => │ # │ name  │ category │
# => ├───┼───────┼──────────┤
# => │ 0 │ APPLE │ FRUIT    │
# => │ 1 │ KALE  │ GREENS   │
# => ╰───┴───────┴──────────╯
```

Polars resolves a selector when the query runs, so a selector that can't be resolved, such as `--strict` with a missing column, builds without an error. It fails when you collect the result, or when `polars columns` or `polars schema` asks the lazy dataframe for its columns.

The order of the selected columns depends on the selector. [`polars selector by-name`](/commands/docs/polars_selector_by-name.md) and [`polars selector by-index`](/commands/docs/polars_selector_by-index.md) return columns in the order you list them. The other selectors return them in the dataframe's order:

```nu
$products | polars select (polars selector by-name qty id) | polars columns
# => ╭───┬─────╮
# => │ 0 │ qty │
# => │ 1 │ id  │
# => ╰───┴─────╯
$products | polars select (polars selector ends-with y e) | polars columns
# => ╭───┬──────────╮
# => │ 0 │ name     │
# => │ 1 │ category │
# => │ 2 │ price    │
# => │ 3 │ qty      │
# => ╰───┴──────────╯
```

`polars select` takes several selectors and places their columns one after another. If two of them match the same column, the column appears twice and collecting fails with `projections contained duplicate output name`.

## Selecting by name

`polars selector by-name` picks the columns you name and skips names that don't exist. With `--strict`, a missing name makes collecting fail with an error such as `"nope" not found`.

[`polars selector exclude`](/commands/docs/polars_selector_exclude.md) picks every column except the ones you name. It ignores names that don't exist. Both commands need at least one name and fail with `Missing column names` without one.

Four selectors match part of a name:

- [`polars selector starts-with`](/commands/docs/polars_selector_starts-with.md) matches names that start with the given string.
- [`polars selector ends-with`](/commands/docs/polars_selector_ends-with.md) matches names that end with one of the given strings.
- [`polars selector contains`](/commands/docs/polars_selector_contains.md) matches names that contain one of them anywhere.
- [`polars selector matches`](/commands/docs/polars_selector_matches.md) takes one regular expression in the syntax of Rust's `regex` crate.

The first three treat their strings literally, so `polars selector contains .` matches only names with a dot in them. Given no strings, they match every column. `polars selector ends-with` and `polars selector contains` take any number of strings. For several prefixes, use `polars selector matches` with a pattern such as `'^(p|n)'`.

The pattern given to `polars selector matches` isn't anchored, so `polars selector matches e` picks every name with an `e` in it. Add `^` and `$` to match the whole name, and `(?i)` to ignore case. An invalid pattern fails when you collect, with an error such as `invalid regex in selector '('`.

Three selectors look at the kind of characters in a name. [`polars selector alpha`](/commands/docs/polars_selector_alpha.md) matches names made only of letters, [`polars selector alphanumeric`](/commands/docs/polars_selector_alphanumeric.md) names made only of letters and digits, and [`polars selector digit`](/commands/docs/polars_selector_digit.md) names made only of digits.

A letter can be any Unicode letter and a digit any Unicode decimal digit, so `größe` counts as alphabetic and `٣` as a digit. `--ascii-only` (`-a`) limits them to `a` to `z`, `A` to `Z`, and `0` to `9`. `alpha` and `alphanumeric` also take `--ignore-spaces` (`-s`), which allows spaces in the name. An underscore or other punctuation never matches, so `q1_2024` isn't alphanumeric:

```nu
let sales = [[region "unit price" q1_2024 "2024"]; [north 9.5 3 7]] | polars into-df
$sales | polars select (polars selector alpha --ignore-spaces) | polars columns
# => ╭───┬────────────╮
# => │ 0 │ region     │
# => │ 1 │ unit price │
# => ╰───┴────────────╯
$sales | polars select (polars selector alphanumeric) | polars columns
# => ╭───┬────────╮
# => │ 0 │ region │
# => │ 1 │ 2024   │
# => ╰───┴────────╯
```

## Selecting by position

`polars selector by-index` takes column positions, counting from 0. Negative positions count back from the end, so `-1` is the last column. A position past either end makes collecting fail with an error such as `cannot get the 5-th column when schema has 3 columns`, unless you pass `--not-strict`, which skips it. Given no positions, the selector matches nothing.

[`polars selector first`](/commands/docs/polars_selector_first.md) and [`polars selector last`](/commands/docs/polars_selector_last.md) take a number of columns, which defaults to 1. A number of 0 or less also picks one column, and a number larger than the column count picks every column without an error.

```nu
$products | polars select (polars selector by-index 0 -1) | polars columns
# => ╭───┬──────────╮
# => │ 0 │ id       │
# => │ 1 │ in_stock │
# => ╰───┴──────────╯
$products | polars select (polars selector last 2) | polars columns
# => ╭───┬──────────╮
# => │ 0 │ qty      │
# => │ 1 │ in_stock │
# => ╰───┴──────────╯
```

## Selecting by data type

These selectors pick columns by their data type, as `polars schema` shows it:

| Selector                                                                 | Matches                                                                                           |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| [`integer`](/commands/docs/polars_selector_integer.md)                   | signed and unsigned integers                                                                      |
| [`signed-integer`](/commands/docs/polars_selector_signed-integer.md)     | `i8`, `i16`, `i32`, and `i64`                                                                     |
| [`unsigned-integer`](/commands/docs/polars_selector_unsigned-integer.md) | `u8`, `u16`, `u32`, and `u64`                                                                     |
| [`float`](/commands/docs/polars_selector_float.md)                       | `f32` and `f64`                                                                                   |
| [`decimal`](/commands/docs/polars_selector_decimal.md)                   | decimals, such as a column cast to `decimal<10,2>`                                                |
| [`numeric`](/commands/docs/polars_selector_numeric.md)                   | integers, floats, and decimals                                                                    |
| [`string`](/commands/docs/polars_selector_string.md)                     | `str`, plus categorical columns with `--include-categorical` (`-c`)                               |
| [`boolean`](/commands/docs/polars_selector_boolean.md)                   | `bool`                                                                                            |
| [`binary`](/commands/docs/polars_selector_binary.md)                     | `binary`, which Nushell binary values become                                                      |
| [`categorical`](/commands/docs/polars_selector_categorical.md)           | categorical (`cat`) columns, such as the output of `polars qcut`                                  |
| [`enum`](/commands/docs/polars_selector_enum.md)                         | enum columns, such as the output of `polars cut`                                                  |
| [`date`](/commands/docs/polars_selector_date.md)                         | `date`                                                                                            |
| [`datetime`](/commands/docs/polars_selector_datetime.md)                 | datetimes of any time unit and time zone, unless you narrow it with flags                         |
| [`duration`](/commands/docs/polars_selector_duration.md)                 | durations of any time unit, unless you narrow it with `--time-unit`                               |
| [`temporal`](/commands/docs/polars_selector_temporal.md)                 | dates, datetimes, durations, and times                                                            |
| [`list`](/commands/docs/polars_selector_list.md)                         | lists of any element type                                                                         |
| [`array`](/commands/docs/polars_selector_array.md)                       | fixed-width arrays, or only arrays of one width with `--width`                                    |
| [`struct`](/commands/docs/polars_selector_struct.md)                     | structs, such as nested objects read from a JSON or NDJSON file                                   |
| [`nested`](/commands/docs/polars_selector_nested.md)                     | lists, arrays, and structs                                                                        |
| [`object`](/commands/docs/polars_selector_object.md)                     | `object` columns, which hold Nushell values with no column type, such as records without a schema |

Each name in the first column is a subcommand of `polars selector`. [Binning values](./frames.md#binning-values) shows `polars cut` and `polars qcut`. `polars into-df` turns Nushell lists into `list` columns, never into arrays, so you meet array columns only in data from elsewhere.

```nu
$products | polars select (polars selector numeric) | polars columns
# => ╭───┬───────╮
# => │ 0 │ id    │
# => │ 1 │ price │
# => │ 2 │ qty   │
# => ╰───┴───────╯
```

`polars selector datetime` takes `--time-unit` and `--time-zone`, and each takes a list. A time unit is `ns`, `us`, or `ms`. Write `us` even though `polars schema` prints `μs`, because `μs` is an error. A time zone is a name such as `UTC` or `Europe/Berlin`. The list `[unset]` picks datetimes that have no time zone, and `unset` has to be the only entry, because `[UTC unset]` fails with `Invalid timezone 'unset'`. With both flags, a column has to match both. `polars selector duration` takes `--time-unit` the same way.

```nu
let events = [[utc_ns berlin_ms naive_us]; [2024-01-02 2024-01-02 2024-01-02]] | polars into-df | polars cast "datetime<ms, Europe/Berlin>" berlin_ms | polars cast "datetime<us, *>" naive_us
$events | polars schema
# => ╭───────────┬─────────────────────────────╮
# => │ utc_ns    │ datetime<ns, UTC>           │
# => │ berlin_ms │ datetime<ms, Europe/Berlin> │
# => │ naive_us  │ datetime<μs>                │
# => ╰───────────┴─────────────────────────────╯
$events | polars select (polars selector datetime --time-zone [unset]) | polars columns
# => ╭───┬──────────╮
# => │ 0 │ naive_us │
# => ╰───┴──────────╯
$events | polars select (polars selector datetime --time-unit [ms us] --time-zone [Europe/Berlin]) | polars columns
# => ╭───┬───────────╮
# => │ 0 │ berlin_ms │
# => ╰───┴───────────╯
```

[`polars selector by-dtype`](/commands/docs/polars_selector_by-dtype.md) takes one or more type names, written the way `polars schema` prints them, and picks columns whose type is exactly one of them. `"datetime<ms, UTC>"` doesn't match a `datetime<ns, UTC>` column, and a list type needs its element type, as in `"list<str>"`. A `*` in place of the time zone means no time zone, so `polars selector by-dtype "datetime<us, *>"` picks `naive_us` and nothing else. An unknown name fails with `Unknown type`, and with no names the command fails with `Missing data types`. To match a type family, such as datetimes of any unit, use the selectors in the table.

## Combining selectors

[`polars selector all`](/commands/docs/polars_selector_all.md) matches every column, and [`polars selector empty`](/commands/docs/polars_selector_empty.md) matches none. [`polars selector not`](/commands/docs/polars_selector_not.md) takes a selector as input and matches every column the input doesn't:

```nu
$products | polars select (polars selector numeric | polars selector not) | polars columns
# => ╭───┬──────────╮
# => │ 0 │ name     │
# => │ 1 │ category │
# => │ 2 │ in_stock │
# => ╰───┴──────────╯
```

`polars selector not` accepts only a selector, so `polars col qty | polars selector not` fails with `Command does not support polars_expression input`. To leave out columns by name, use `polars selector exclude`. There are no commands for the union or intersection of two selectors.

An arithmetic or comparison operator turns a selector into an expression, which applies to each matched column and keeps the column's name:

```nu
$products | polars with-column ((polars selector numeric) * 10) | polars collect
# => ╭───┬────┬───────┬──────────┬───────┬─────┬──────────╮
# => │ # │ id │ name  │ category │ price │ qty │ in_stock │
# => ├───┼────┼───────┼──────────┼───────┼─────┼──────────┤
# => │ 0 │ 10 │ apple │ fruit    │  5.00 │ 100 │ true     │
# => │ 1 │ 20 │ kale  │ greens   │ 22.50 │   0 │ false    │
# => ╰───┴────┴───────┴──────────┴───────┴─────┴──────────╯
```

For the same reason, `and` and `or` work on the values in the columns, not on the sets of columns. `(polars selector integer) or (polars selector float)` builds boolean columns and doesn't select the integer and float columns. To get both kinds, pass both selectors to `polars select`, or use `polars selector numeric`.
