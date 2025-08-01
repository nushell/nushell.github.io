---
title: drop
categories: |
  filters
version: 0.106.0
filters: |
  Remove items/rows from the end of the input list/table. Counterpart of `skip`. Opposite of `last`.
usage: |
  Remove items/rows from the end of the input list/table. Counterpart of `skip`. Opposite of `last`.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `drop` for [filters](/commands/categories/filters.md)

<div class='command-title'>Remove items&#x2f;rows from the end of the input list&#x2f;table. Counterpart of `skip`. Opposite of `last`.</div>

## Signature

```> drop {flags} (rows)```

## Parameters

 -  `rows`: The number of items to remove.


## Input/output types:

| input     | output    |
| --------- | --------- |
| table     | table     |
| list&lt;any&gt; | list&lt;any&gt; |
## Examples

Remove the last item of a list
```nu
> [0,1,2,3] | drop
╭───┬───╮
│ 0 │ 0 │
│ 1 │ 1 │
│ 2 │ 2 │
╰───┴───╯

```

Remove zero item of a list
```nu
> [0,1,2,3] | drop 0
╭───┬───╮
│ 0 │ 0 │
│ 1 │ 1 │
│ 2 │ 2 │
│ 3 │ 3 │
╰───┴───╯

```

Remove the last two items of a list
```nu
> [0,1,2,3] | drop 2
╭───┬───╮
│ 0 │ 0 │
│ 1 │ 1 │
╰───┴───╯

```

Remove the last row in a table
```nu
> [[a, b]; [1, 2] [3, 4]] | drop 1
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
╰───┴───┴───╯

```


## Subcommands:

| name                                           | description                                                                                         | type     |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------- |
| [`drop column`](/commands/docs/drop_column.md) | Remove N columns at the right-hand end of the input table. To remove columns by name, use `reject`. | built-in |
| [`drop nth`](/commands/docs/drop_nth.md)       | Drop the selected rows.                                                                             | built-in |