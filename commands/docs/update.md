---
title: update
categories: |
  filters
version: 0.84.0
filters: |
  Update an existing column to have a new value.
usage: |
  Update an existing column to have a new value.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> update (field) (replacement value)```

## Parameters

 -  `field`: the name of the column to update
 -  `replacement value`: the new value to give the cell(s), or a closure to create the value


## Input/output types:

| input     | output    |
| --------- | --------- |
| list\<any\> | list\<any\> |
| record    | record    |
| table     | table     |
## Examples

Update a column value
```shell
> {'name': 'nu', 'stars': 5} | update name 'Nushell'
╭───────┬─────────╮
│ name  │ Nushell │
│ stars │ 5       │
╰───────┴─────────╯
```

Use in closure form for more involved updating logic
```shell
> [[count fruit]; [1 'apple']] | enumerate | update item.count {|e| ($e.item.fruit | str length) + $e.index } | get item
╭───┬───────┬───────╮
│ # │ count │ fruit │
├───┼───────┼───────┤
│ 0 │     5 │ apple │
╰───┴───────┴───────╯

```

Alter each value in the 'authors' column to use a single string instead of a list
```shell
> [[project, authors]; ['nu', ['Andrés', 'JT', 'Yehuda']]] | update authors {|row| $row.authors | str join ','}
╭───┬─────────┬──────────────────╮
│ # │ project │     authors      │
├───┼─────────┼──────────────────┤
│ 0 │ nu      │ Andrés,JT,Yehuda │
╰───┴─────────┴──────────────────╯

```

You can also use a simple command to update 'authors' to a single string
```shell
> [[project, authors]; ['nu', ['Andrés', 'JT', 'Yehuda']]] | update authors {|| str join ','}
╭───┬─────────┬──────────────────╮
│ # │ project │     authors      │
├───┼─────────┼──────────────────┤
│ 0 │ nu      │ Andrés,JT,Yehuda │
╰───┴─────────┴──────────────────╯

```


## Subcommands:

| name                                             | type    | usage                   |
| ------------------------------------------------ | ------- | ----------------------- |
| [`update cells`](/commands/docs/update_cells.md) | Builtin | Update the table cells. |
