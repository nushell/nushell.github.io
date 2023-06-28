---
title: dfr cumulative
categories: |
  dataframe
version: 0.82.0
dataframe: |
  Cumulative calculation for a series.
usage: |
  Cumulative calculation for a series.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr cumulative (type) --reverse```

## Parameters

 -  `type`: rolling operation
 -  `--reverse` `(-r)`: Reverse cumulative calculation

## Examples

Cumulative sum for a series
```shell
> [1 2 3 4 5] | dfr into-df | dfr cumulative sum
╭───┬──────────────────╮
│ # │ 0_cumulative_sum │
├───┼──────────────────┤
│ 0 │                1 │
│ 1 │                3 │
│ 2 │                6 │
│ 3 │               10 │
│ 4 │               15 │
╰───┴──────────────────╯

```
