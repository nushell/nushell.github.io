---
title: update
categories: |
  filters
version: 0.90.0
filters: |
  Update an existing column to have a new value.
usage: |
  Update an existing column to have a new value.
feature: default
---

<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

`> update {flags} (field) (replacement value)`

## Parameters

- `field`: The name of the column to update.
- `replacement value`: The new value to give the cell(s), or a closure to create the value.

## Input/output types:

| input       | output      |
| ----------- | ----------- |
| list\<any\> | list\<any\> |
| record      | record      |
| table       | table       |

## Examples

Update a column value

```nu
> {'name': 'nu', 'stars': 5} | update name 'Nushell'
╭───────┬─────────╮
│ name  │ Nushell │
│ stars │ 5       │
╰───────┴─────────╯
```

Use a closure to alter each value in the 'authors' column to a single string

```nu
> [[project, authors]; ['nu', ['Andrés', 'JT', 'Yehuda']]] | update authors {|row| $row.authors | str join ',' }
╭───┬─────────┬──────────────────╮
│ # │ project │     authors      │
├───┼─────────┼──────────────────┤
│ 0 │ nu      │ Andrés,JT,Yehuda │
╰───┴─────────┴──────────────────╯

```

You can also use a simple command to update 'authors' to a single string

```nu
> [[project, authors]; ['nu', ['Andrés', 'JT', 'Yehuda']]] | update authors { str join ',' }
╭───┬─────────┬──────────────────╮
│ # │ project │     authors      │
├───┼─────────┼──────────────────┤
│ 0 │ nu      │ Andrés,JT,Yehuda │
╰───┴─────────┴──────────────────╯

```

Update a value at an index in a list

```nu
> [1 2 3] | update 1 4
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 4 │
│ 2 │ 3 │
╰───┴───╯

```

Use a closure to compute a new value at an index

```nu
> [1 2 3] | update 1 {|i| $i + 2 }
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 4 │
│ 2 │ 3 │
╰───┴───╯

```

## Subcommands:

| name                                          | type    | usage                   |
| --------------------------------------------- | ------- | ----------------------- |
| [`update cells`](/commands/docs/update_cells) | Builtin | Update the table cells. |