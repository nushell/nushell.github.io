---
title: wrap
categories: |
  filters
version: 0.82.1
filters: |
  Wrap the value into a column.
usage: |
  Wrap the value into a column.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> wrap (name)```

## Parameters

 -  `name`: the name of the column

## Examples

Wrap a list into a table with a given column name
```shell
> [1 2 3] | wrap num
╭───┬─────╮
│ # │ num │
├───┼─────┤
│ 0 │   1 │
│ 1 │   2 │
│ 2 │   3 │
╰───┴─────╯

```

Wrap a range into a table with a given column name
```shell
> 1..3 | wrap num
╭───┬─────╮
│ # │ num │
├───┼─────┤
│ 0 │   1 │
│ 1 │   2 │
│ 2 │   3 │
╰───┴─────╯

```
