---
title: dfr filter
categories: |
  lazyframe
version: 0.82.0
lazyframe: |
  Filter dataframe based in expression.
usage: |
  Filter dataframe based in expression.
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr filter (filter expression)```

## Parameters

 -  `filter expression`: Expression that define the column selection

## Examples

Filter dataframe using an expression
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr filter ((dfr col a) >= 4)
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 6 │ 2 │
│ 1 │ 4 │ 2 │
╰───┴───┴───╯

```
