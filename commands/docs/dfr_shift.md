---
title: dfr shift
categories: |
  dataframe or lazyframe
version: 0.82.1
dataframe_or_lazyframe: |
  Shifts the values by a given period.
usage: |
  Shifts the values by a given period.
---

# <code>{{ $frontmatter.title }}</code> for dataframe or lazyframe

<div class='command-title'>{{ $frontmatter.dataframe_or_lazyframe }}</div>

## Signature

```> dfr shift (period) --fill```

## Parameters

 -  `period`: shift period
 -  `--fill {any}`: Expression used to fill the null values (lazy df)

## Examples

Shifts the values by a given period
```shell
> [1 2 2 3 3] | dfr into-df | dfr shift 2 | dfr drop-nulls
╭───┬───╮
│ # │ 0 │
├───┼───┤
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 2 │
╰───┴───╯

```
