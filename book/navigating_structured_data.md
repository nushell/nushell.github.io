# Navigating and Accessing Structured Data

Given Nushell's strong support for structured data, some of the more common tasks involve navigating and accessing that data.

## Index to this Section

- [Background and Definitions](#background)
- [Cell-paths](#cell-paths)
  - [With Records](#records)
  - [With Lists](#lists)
  - [With Tables](#tables)
    - Sample Data
    - Example - Access a Table Row
    - Example - Access a Table Column
  - [With Nested Data](#nested-data)
- [Using `get` and `select`](#using-get-and-select)
  - Example - `get` vs. `select` with a Table Row
  - Example - `select` with multiple rows and columns
- [Handling missing data using the optional operator](#the-optional-operator)
- [Key/Column names with spaces](#keycolumn-names-with-spaces)
- [Other commands for navigating structured data](#other-commands-for-accessing-structured-data)

## Background

For the examples and descriptions below, keep in mind several definitions regarding structured data:

- **_List:_** Lists contain a series of zero or more values of any type. A list with zero values is known as an "empty list."
- **_Record:_** Records contain zero or more pairs of named keys and their corresponding value. The data in a record's value can also be of any type. A record with zero key-value pairs is known as an "empty record."
- **_Nested Data:_** The values contained in a list, record, or table can be either of a basic type or structured data themselves. This means that data can be nested multiple levels and in multiple forms:
  - List values can contain tables, records, and even other lists
    - **_Table:_** Tables are a list of records
  - Record values can contain tables, lists, and other records
    - This means that the records of a table can also contain nested tables, lists, and other records

::: tip
Because a table is a list of records, any command or syntax that works on a list will also work on a table. The converse is not necessarily the case; there are some commands and syntax that work on tables but not lists.
:::

## Cell-paths

A cell-path is the primary way to access values inside structured data. This path is based on a concept similar to that of a spreadsheet, where columns have names and rows have numbers. Cell-path names and indices are separated by dots.

### Records

For a record, the cell-path specifies the name of a key, which is a `string`.

#### Example - Access a Record Value:

```nu
> let my_record = {
    a: 5
    b: 42
  }
> $my_record.b + 5
47
```

### Lists

For a list, the cell-path specifies the position (index) of the value in the list. This is an `int`:

#### Example - Access a List Value:

Remember, list indices are 0-based.

```nu
> let scoobies_list = [ Velma Fred Daphne Shaggy Scooby ]
> $scoobies_list.2
Daphne
```

### Tables

- To access a column, a cell-path uses the name of the column, which is a `string`
- To access a row, it uses the index number of the row, which is an `int`
- To access a single cell, it uses a combination of the column name with the row index.

The next few examples will use the following table:

```nu
let data = [[date                        temps                                   condition ];
            [2022-02-01T14:30:00+05:00,  [ 38.24, 38.50, 37.99, 37.98, 39.10 ],  'summy`   ],
            [2022-02-02T14:30:00+05:00,  [ 35.24, 35.94, 34.91, 35.24, 36.65 ],  'sunny'   ],
            [2022-02-03T14:30:00+05:00,  [ 35.17, 36.67, 34.42, 35.76, 36.52 ],  'cloudy'  ],
            [2022-02-04T14:30:00+05:00,  [ 39.24, 40.94, 39.21, 38.99, 38.80 ],  'rain'    ],
           ]
```

::: details Expand for a visual representation of this data

```nu
╭───┬─────────────┬───────────────┬───────────╮
│ # │    date     │     temps     │ condition │
├───┼─────────────┼───────────────┼───────────┤
│ 0 │ 2 years ago │ ╭───┬───────╮ │ sunny     │
│   │             │ │ 0 │ 38.24 │ │           │
│   │             │ │ 1 │ 38.50 │ │           │
│   │             │ │ 2 │ 37.99 │ │           │
│   │             │ │ 3 │ 37.98 │ │           │
│   │             │ │ 4 │ 39.10 │ │           │
│   │             │ ╰───┴───────╯ │           │
│ 1 │ 2 years ago │ ╭───┬───────╮ │ sunny     │
│   │             │ │ 0 │ 35.24 │ │           │
│   │             │ │ 1 │ 35.94 │ │           │
│   │             │ │ 2 │ 34.91 │ │           │
│   │             │ │ 3 │ 35.24 │ │           │
│   │             │ │ 4 │ 36.65 │ │           │
│   │             │ ╰───┴───────╯ │           │
│ 2 │ 2 years ago │ ╭───┬───────╮ │ cloudy    │
│   │             │ │ 0 │ 35.17 │ │           │
│   │             │ │ 1 │ 36.67 │ │           │
│   │             │ │ 2 │ 34.42 │ │           │
│   │             │ │ 3 │ 35.76 │ │           │
│   │             │ │ 4 │ 36.52 │ │           │
│   │             │ ╰───┴───────╯ │           │
│ 3 │ 2 years ago │ ╭───┬───────╮ │ rain      │
│   │             │ │ 0 │ 39.24 │ │           │
│   │             │ │ 1 │ 40.94 │ │           │
│   │             │ │ 2 │ 39.21 │ │           │
│   │             │ │ 3 │ 38.99 │ │           │
│   │             │ │ 4 │ 38.80 │ │           │
│   │             │ ╰───┴───────╯ │           │
╰───┴─────────────┴───────────────┴───────────╯
```

:::

This represents weather data in the form of a table with three columns:

1. **_date_**: A Nushell `date` for each day
2. **_temps_**: A Nushell `list` of 5 `float` values representing temperature readings at different weather stations in the area
3. **_conditions_**: A Nushell `string` for each day's weather condition for the area

#### Example - Access a Table Row (Record)

Access the second day's data as a record:

```nu
> $data.1
╭───────────┬───────────────╮
│ date      │ 2 years ago   │
│           │ ╭───┬───────╮ │
│ temps     │ │ 0 │ 35.24 │ │
│           │ │ 1 │ 35.94 │ │
│           │ │ 2 │ 34.91 │ │
│           │ │ 3 │ 35.24 │ │
│           │ │ 4 │ 36.65 │ │
│           │ ╰───┴───────╯ │
│ condition │ sunny         │
╰───────────┴───────────────╯
```

#### Example - Access a Table Column (List)

```nu
> $data.condition
╭───┬────────╮
│ 0 │ sunny  │
│ 1 │ sunny  │
│ 2 │ cloudy │
│ 3 │ rain   │
╰───┴────────╯
```

#### Example - Access a Table Cell (Value)

The condition for the fourth day:

```nu
> $data.condition.3
rain
```

### Nested Data

Since data can be nested, a cell-path can contain references to multiple names or indices.

#### Example - Accessing Nested Table Data

To obtain the temperature at the second weather station on the third day:

```nu
> $data.temps.2.1
36.67
```

The first index `2` accesses the third day, then the next index `1` accesses the second weather station's temperature reading.

## Using `get` and `select`

In addition to the cell-path literal syntax used above, Nushell also provides several commands that utilize cell-paths. The most important of these are:

- `get` is equivalent to using a cell-path literal but with support for variable names and expressions. `get`, like the cell-path examples above, returns the **value** indicated by the cell-path.
- `select` is subtly, but critically, different. It returns the specified **data structure** itself, rather than just its value.
  - Using `select` on a table will return a table of equal or lesser size
  - Using `select` on a list will return a list of equal or lesser size
  - using `select` on a record will return a record of equal or lesser size

Continuing with the sample table above:

### Example - `get` vs. `select` a table row

```nu
> $data | get 1
╭───────────┬───────────────╮
│ date      │ 2 years ago   │
│           │ ╭───┬───────╮ │
│ temps     │ │ 0 │ 35.24 │ │
│           │ │ 1 │ 35.94 │ │
│           │ │ 2 │ 34.91 │ │
│           │ │ 3 │ 35.24 │ │
│           │ │ 4 │ 36.65 │ │
│           │ ╰───┴───────╯ │
│ condition │ sunny         │
╰───────────┴───────────────╯

> $data | select 1
╭───┬─────────────┬───────────────┬───────────╮
│ # │    date     │     temps     │ condition │
├───┼─────────────┼───────────────┼───────────┤
│ 0 │ 2 years ago │ ╭───┬───────╮ │ sunny     │
│   │             │ │ 0 │ 35.24 │ │           │
│   │             │ │ 1 │ 35.94 │ │           │
│   │             │ │ 2 │ 34.91 │ │           │
│   │             │ │ 3 │ 35.24 │ │           │
│   │             │ │ 4 │ 36.65 │ │           │
│   │             │ ╰───┴───────╯ │           │
╰───┴─────────────┴───────────────┴───────────╯
```

Notice that:

- [`get`](/commands/docs/get.md) returns the same record as the `$data.1` example above
- [`select`](/commands/docs/select.md) returns a new, single-row table, including column names and row indices

::: tip
The row indices of the table resulting from `select` are not the same as that of the original. The new table has its own, 0-based index.

To obtain the original index, you can using the [`enumerate`](/commands/docs/enumerate.md) command. For example:

```nu
> $data | enumerate | select 1
```

:::

### Example - `select` with multiple rows and columns

Because `select` results in a new table, it's possible to specify multiple column names, row indices, or even both. This example creates a new table containing the date and condition columns of the first and second rows:

```nu
> $data | select date condition 0 1
╭───┬─────────────┬───────────╮
│ # │    date     │ condition │
├───┼─────────────┼───────────┤
│ 0 │ 2 years ago │ sunny     │
│ 1 │ 2 years ago │ sunny     │
╰───┴─────────────┴───────────╯
```

## Key/Column names with spaces

If a key name or column name contains spaces or other characters that prevent it from being accessible as a bare-word string, then the key name may be quoted.

Example:

```nu
> let record_example = {
    "key x":12
    "key y":4
  }
> $record_example."key x"
12

# or
> $record_example | get "key x"
12
```

Quotes are also required when a key name may be confused for a numeric value.

Example:

```nu
> let record_example = {
    "1": foo
    "2": baz
    "3": far
  }

> $record_example."1"
  foo
```

Do not confuse the key name with a row index in this case. Here, the first item is _assigned_ the key name `1` (a string). If converted to a table using the `transpose` command, key `1` (`string`) would be at row-index `0` (an integer).

## Handling Missing Data

### The Optional Operator

By default, cell path access will fail if it can't access the requested row or column. To suppress these errors, you can add a `?` to a cell path member to mark it as optional:

#### Example - The Optional Operator

Using the temp data from above:

```nu
let cp: cell-path = $.temps?.1 # only get the 2nd location from the temps column

# Ooops, we've removed the temps column
$data | reject temps | get $cp
```

By default missing cells will be replaced by `null` when accessed via the optional operator.

### Assigning a `default` for missing or `null` data

The [`default` command](/commands/docs/default.html) can be used to apply a default value to missing or null column result.

```nu
> let missing_value = [{a:1 b:2} {b:1}]
> $missing_value
╭───┬────┬───╮
│ # │ a  │ b │
├───┼────┼───┤
│ 0 │  1 │ 2 │
│ 1 │ ❎ │ 1 │
╰───┴────┴───╯

> let with_default_value = ($missing_value | default 'n/a' a)
> $with_default_value
╭───┬─────┬───╮
│ # │  a  │ b │
├───┼─────┼───┤
│ 0 │   1 │ 2 │
│ 1 │ n/a │ 1 │
╰───┴─────┴───╯

> $with_default_value.1.a
n/a
```

## Other commands for accessing structured data

- [`reject`](/commands/docs/reject.md) is the opposite of `select`, removing the specified rows and columns
- [`range`](/commands/docs/range.md) specifies the rows of a list or table to select using a [`range`](./types_of_data.md#ranges) type
