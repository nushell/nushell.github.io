---
title: dfr fill-null
categories: |
  lazyframe
version: 0.84.0
lazyframe: |
  Replaces NULL values with the given expression.
usage: |
  Replaces NULL values with the given expression.
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr fill-null (fill)```

## Parameters

 -  `fill`: Expression to use to fill the null values


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Fills the null values by 0
```shell
> [1 2 2 3 3] | dfr into-df | dfr shift 2 | dfr fill-null 0
╭───┬───╮
│ # │ 0 │
├───┼───┤
│ 0 │ 0 │
│ 1 │ 0 │
│ 2 │ 1 │
│ 3 │ 2 │
│ 4 │ 2 │
╰───┴───╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag