---
title: roll down
categories: |
  filters
version: 0.83.0
filters: |
  Roll table rows down.
usage: |
  Roll table rows down.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> roll down --by```

## Parameters

 -  `--by {int}`: Number of rows to roll

## Examples

Rolls rows down of a table
```shell
> [[a b]; [1 2] [3 4] [5 6]] | roll down
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 5 │ 6 │
│ 1 │ 1 │ 2 │
│ 2 │ 3 │ 4 │
╰───┴───┴───╯

```
