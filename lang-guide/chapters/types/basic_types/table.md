# Table

|                             |                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **_Description:_**          | A two-dimensional container with both columns and rows where each cell can hold any basic or structured data type |
| **_Annotation:_**           | `table`                                                                                                           |
| **_Table-Literal Syntax:_** | See below                                                                                                         |
| **_Casts:_**                | N/A                                                                                                               |
| **_See Also:_**             | [Working with Tables](/book/working_with_tables.md)                                                               |
|                             | [Navigating and Accessing Structured Data](/book/navigating_structured_data.md)                                   |
|                             | [Types of Data - Tables](/book/types_of_data.md#tables)                                                           |

## Creating Tables

### Table-literal syntax

Table literals can be created using a syntax similar to that of a list literal. Because tables also contain columns and not just values, we also specify the column names:

```nu
> [[column1, column2]; [Value1, Value2] [Value3, Value4]]
╭───┬─────────┬─────────╮
│ # │ column1 │ column2 │
├───┼─────────┼─────────┤
│ 0 │ Value1  │ Value2  │
│ 1 │ Value3  │ Value4  │
╰───┴─────────┴─────────╯
```

In this syntax, the headers are separated from the data cells using a semicolon(`;`). The semicolon separator is mandatory in a table-literal. It must follow the headers.

### List-of-Records syntax

You can also create a table as a list of records, JSON-style:

```nu
> [{name: "Sam", rank: 10}, {name: "Bob", rank: 7}]
╭───┬──────┬──────╮
│ # │ name │ rank │
├───┼──────┼──────┤
│ 0 │ Sam  │   10 │
│ 1 │ Bob  │    7 │
╰───┴──────┴──────╯
```

This list-of-records pattern plays on the Nushell data model, which sees a list of records as equivalent to a table. This is useful in cases where the length of a table may not be known ahead of time. In such a case, a stream of records likewise represents a table.

## Common commands that can be used with `table`

- `table`
- `ls`
- `ps`
- `sys`
- `select`
- `get`
- `where`
- `range`

::: tip Note
Most of Nushell's filter commands work with tables. For a longer list see: `help commands | where category == filters`.
:::
