---
title: every
categories: |
  filters
version: 0.81.0
filters: |
  Show (or skip) every n-th row, starting from the first one.
usage: |
  Show (or skip) every n-th row, starting from the first one.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> every (stride) --skip```

## Parameters

 -  `stride`: how many rows to skip between (and including) each row returned
 -  `--skip` `(-s)`: skip the rows that would be returned, instead of selecting them

## Examples

Get every second row
```shell
> [1 2 3 4 5] | every 2
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 3 │
│ 2 │ 5 │
╰───┴───╯

```

Skip every second row
```shell
> [1 2 3 4 5] | every 2 --skip
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 4 │
╰───┴───╯

```
