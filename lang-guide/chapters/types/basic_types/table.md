# Table

What it is: A table is a two-dimensional container with both columns and rows.

Annotation: `table`

There are two ways to write a table. These two examples are equivalent:

```nu
[[a, b]; [1, 2], [3, 4]]
```

```nu
[{a: 1, b: 2}, {a: 3, b: 4}]
```

In the first syntax, the headers are separated from the data cells using a semicolon(`;`). The semicolon separator is mandatory in this syntax to create a table. It must follow the headers.

The second syntax is simply a list of records. This plays on the Nushell data model, which sees a list of records as equivalent to a table. This is used in cases where the length of a table may not be known ahead of time. In such a case, a stream of records likewise represents a table.

## Commands that use table

- `table`
- `ls`
- `ps`
- `sys`
- `select`
- `get`
- `where`
- `range`

Note: Almost all of Nushell's filter commands work with tables. For a longer list see: `help commands | where category == filters`.
