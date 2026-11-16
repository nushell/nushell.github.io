# Table

|                             |                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **_Description:_**          | A two-dimensional container with both columns and rows where each cell can hold any basic or structured data type |
| **_Annotation:_**           | `table`                                                                                                           |
| **_Table-Literal Syntax:_** | See below                                                                                                         |
| **_Casts:_**                | [`wrap`](/commands/docs/wrap.md)                                                                                  |
| **_See Also:_**             | [Working with Tables](/book/working_with_tables.md)                                                               |
|                             | [Navigating and Accessing Structured Data](/book/navigating_structured_data.md)                                   |
|                             | [Types of Data - Tables](/book/types_of_data.md#tables)                                                           |

## Creating Tables

### Table-literal syntax

Table literals can be created using a syntax similar to that of a list literal. Because tables also contain columns and not just values, we also specify the column names:

```nu
[[column1, column2]; [Value1, Value2] [Value3, Value4]]
# => ╭───┬─────────┬─────────╮
# => │ # │ column1 │ column2 │
# => ├───┼─────────┼─────────┤
# => │ 0 │ Value1  │ Value2  │
# => │ 1 │ Value3  │ Value4  │
# => ╰───┴─────────┴─────────╯
```

In this syntax, the headers are separated from the data cells using a semicolon(`;`). The semicolon separator is mandatory in a table-literal. It must follow the headers.

A table literal has these rules:

- At least one row must follow the `;`. `[[a b];]` fails with "expected table row". For an empty table, use `[]`.
- Each row needs exactly one cell per column. A short row is a `nu::parser::missing_columns` error, and a long one is `nu::parser::extra_columns`:

  ```nu
  [[a b]; [1]]
  # => Error: nu::parser::missing_columns
  # =>
  # =>   × Missing columns.
  # =>    ╭─[repl_entry #1:1:9]
  # =>  1 │ [[a b]; [1]]
  # =>    ·         ─┬─
  # =>    ·          ╰── expected 2 columns
  # =>    ╰────
  ```

- A column name can't appear twice. With literal names, as in `[[a a]; [1 2]]`, that is a parse error (`nu::parser::column_defined_twice`). When the names come from variables, the same check happens at runtime as `nu::shell::column_defined_twice`.
- A row can't use the spread operator. `[[a b]; [...$row]]` fails with "Cannot spread in a table row". Build such a table from records instead.

Column names can be bare words, quoted strings, variables or subexpressions:

```nu
let c = "x"
[[$c ("y" + "z") "a b"]; [1 2 3]]
# => ╭───┬───┬────┬─────╮
# => │ # │ x │ yz │ a b │
# => ├───┼───┼────┼─────┤
# => │ 0 │ 1 │  2 │   3 │
# => ╰───┴───┴────┴─────╯
```

[`to nuon`](/commands/docs/to_nuon.md) writes a table in this form, and `from nuon` reads it back as a table:

```nu
[{a: 1, b: 2} {a: 3, b: 4}] | to nuon
# => [[a, b]; [1, 2], [3, 4]]
```

### List-of-Records syntax

You can also create a table as a list of records, JSON-style:

```nu
[{name: "Sam", rank: 10}, {name: "Bob", rank: 7}]
# => ╭───┬──────┬──────╮
# => │ # │ name │ rank │
# => ├───┼──────┼──────┤
# => │ 0 │ Sam  │   10 │
# => │ 1 │ Bob  │    7 │
# => ╰───┴──────┴──────╯
```

This list-of-records pattern plays on the Nushell data model, which sees a list of records as equivalent to a table. This is useful in cases where the length of a table may not be known ahead of time. In such a case, a stream of records likewise represents a table.

## Common commands that can be used with `table`

- `table`
- `ls`
- `ps`
- `sys disks`, `sys net`
- `select`
- `get`
- `where`
- `slice`

::: tip Note
Most of Nushell's filter commands work with tables. For a longer list see: `help commands | where category == filters`.
:::
