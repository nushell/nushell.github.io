---
title: insert
categories: |
  filters
version: 0.79.0
filters: |
  Insert a new column, using an expression or closure to create each row's values.
usage: |
  Insert a new column, using an expression or closure to create each row's values.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> insert (field) (new value)```

## Parameters

 -  `field`: the name of the column to insert
 -  `new value`: the new value to give the cell(s)

## Examples

Insert a new entry into a single record
```shell
> {'name': 'nu', 'stars': 5} | insert alias 'Nushell'
╭───────┬─────────╮
│ name  │ nu      │
│ stars │ 5       │
│ alias │ Nushell │
╰───────┴─────────╯
```

Insert a new column into a table, populating all rows
```shell
> [[project, lang]; ['Nushell', 'Rust']] | insert type 'shell'
╭───┬─────────┬──────┬───────╮
│ # │ project │ lang │ type  │
├───┼─────────┼──────┼───────┤
│ 0 │ Nushell │ Rust │ shell │
╰───┴─────────┴──────┴───────╯

```

Insert a column with values equal to their row index, plus the value of 'foo' in each row
```shell
> [[foo]; [7] [8] [9]] | enumerate | insert bar {|e| $e.item.foo + $e.index } | flatten
╭───┬─────┬─────╮
│ # │ foo │ bar │
├───┼─────┼─────┤
│ 0 │   7 │   7 │
│ 1 │   8 │   9 │
│ 2 │   9 │  11 │
╰───┴─────┴─────╯

```
