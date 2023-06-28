---
title: dfr fill-nan
categories: |
  lazyframe
version: 0.82.1
lazyframe: |
  Replaces NaN values with the given expression.
usage: |
  Replaces NaN values with the given expression.
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr fill-nan (fill)```

## Parameters

 -  `fill`: Expression to use to fill the NAN values

## Examples

Fills the NaN values with 0
```shell
> [1 2 NaN 3 NaN] | dfr into-df | dfr fill-nan 0
╭───┬───╮
│ # │ 0 │
├───┼───┤
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 0 │
│ 3 │ 3 │
│ 4 │ 0 │
╰───┴───╯

```

Fills the NaN values of a whole dataframe
```shell
> [[a b]; [0.2 1] [0.1 NaN]] | dfr into-df | dfr fill-nan 0
╭───┬────────┬───╮
│ # │   a    │ b │
├───┼────────┼───┤
│ 0 │ 0.2000 │ 1 │
│ 1 │ 0.1000 │ 0 │
╰───┴────────┴───╯

```
