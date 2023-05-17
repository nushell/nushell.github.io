---
title: dfr arg-sort
categories: |
  dataframe
version: 0.80.0
dataframe: |
  Returns indexes for a sorted series.
usage: |
  Returns indexes for a sorted series.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr arg-sort --reverse --nulls-last```

## Parameters

 -  `--reverse` `(-r)`: reverse order
 -  `--nulls-last` `(-n)`: nulls ordered last

## Examples

Returns indexes for a sorted series
```shell
> [1 2 2 3 3] | dfr into-df | dfr arg-sort
╭───┬──────────╮
│ # │ arg_sort │
├───┼──────────┤
│ 0 │        0 │
│ 1 │        1 │
│ 2 │        2 │
│ 3 │        3 │
│ 4 │        4 │
╰───┴──────────╯

```

Returns indexes for a sorted series
```shell
> [1 2 2 3 3] | dfr into-df | dfr arg-sort -r
╭───┬──────────╮
│ # │ arg_sort │
├───┼──────────┤
│ 0 │        3 │
│ 1 │        4 │
│ 2 │        1 │
│ 3 │        2 │
│ 4 │        0 │
╰───┴──────────╯

```
