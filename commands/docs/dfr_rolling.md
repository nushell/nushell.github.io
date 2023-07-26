---
title: dfr rolling
categories: |
  dataframe
version: 0.83.0
dataframe: |
  Rolling calculation for a series.
usage: |
  Rolling calculation for a series.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr rolling (type) (window)```

## Parameters

 -  `type`: rolling operation
 -  `window`: Window size for rolling

## Examples

Rolling sum for a series
```shell
> [1 2 3 4 5] | dfr into-df | dfr rolling sum 2 | dfr drop-nulls
╭───┬───────────────╮
│ # │ 0_rolling_sum │
├───┼───────────────┤
│ 0 │             3 │
│ 1 │             5 │
│ 2 │             7 │
│ 3 │             9 │
╰───┴───────────────╯

```

Rolling max for a series
```shell
> [1 2 3 4 5] | dfr into-df | dfr rolling max 2 | dfr drop-nulls
╭───┬───────────────╮
│ # │ 0_rolling_max │
├───┼───────────────┤
│ 0 │             2 │
│ 1 │             3 │
│ 2 │             4 │
│ 3 │             5 │
╰───┴───────────────╯

```
