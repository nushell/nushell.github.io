---
title: drop column
categories: |
  filters
version: 0.83.0
filters: |
  Remove N columns at the right-hand end of the input table. To remove columns by name, use `reject`.
usage: |
  Remove N columns at the right-hand end of the input table. To remove columns by name, use `reject`.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> drop column (columns)```

## Parameters

 -  `columns`: starting from the end, the number of columns to remove

## Examples

Remove the last column of a table
```shell
> [[lib, extension]; [nu-lib, rs] [nu-core, rb]] | drop column
╭───┬─────────╮
│ # │   lib   │
├───┼─────────┤
│ 0 │ nu-lib  │
│ 1 │ nu-core │
╰───┴─────────╯

```
