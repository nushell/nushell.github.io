---
title: dfr cumulative
categories: |
  dataframe
version: 0.84.0
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


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

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


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag