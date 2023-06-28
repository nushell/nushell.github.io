---
title: dfr filter-with
categories: |
  dataframe or lazyframe
version: 0.82.1
dataframe_or_lazyframe: |
  Filters dataframe using a mask or expression as reference.
usage: |
  Filters dataframe using a mask or expression as reference.
---

# <code>{{ $frontmatter.title }}</code> for dataframe or lazyframe

<div class='command-title'>{{ $frontmatter.dataframe_or_lazyframe }}</div>

## Signature

```> dfr filter-with (mask or expression)```

## Parameters

 -  `mask or expression`: boolean mask used to filter data

## Examples

Filter dataframe using a bool mask
```shell
> let mask = ([true false] | dfr into-df);
    [[a b]; [1 2] [3 4]] | dfr into-df | dfr filter-with $mask
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
╰───┴───┴───╯

```

Filter dataframe using an expression
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr filter-with ((dfr col a) > 1)
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 3 │ 4 │
╰───┴───┴───╯

```
