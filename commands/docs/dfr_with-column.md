---
title: dfr with-column
categories: |
  dataframe or lazyframe
version: 0.82.0
dataframe_or_lazyframe: |
  Adds a series to the dataframe.
usage: |
  Adds a series to the dataframe.
---

# <code>{{ $frontmatter.title }}</code> for dataframe or lazyframe

<div class='command-title'>{{ $frontmatter.dataframe_or_lazyframe }}</div>

## Signature

```> dfr with-column ...rest --name```

## Parameters

 -  `...rest`: series to be added or expressions used to define the new columns
 -  `--name {string}`: new column name

## Examples

Adds a series to the dataframe
```shell
> [[a b]; [1 2] [3 4]]
    | dfr into-df
    | dfr with-column ([5 6] | dfr into-df) --name c
╭───┬───┬───┬───╮
│ # │ a │ b │ c │
├───┼───┼───┼───┤
│ 0 │ 1 │ 2 │ 5 │
│ 1 │ 3 │ 4 │ 6 │
╰───┴───┴───┴───╯

```

Adds a series to the dataframe
```shell
> [[a b]; [1 2] [3 4]]
    | dfr into-lazy
    | dfr with-column [
        ((dfr col a) * 2 | dfr as "c")
        ((dfr col a) * 3 | dfr as "d")
      ]
    | dfr collect
╭───┬───┬───┬───┬───╮
│ # │ a │ b │ c │ d │
├───┼───┼───┼───┼───┤
│ 0 │ 1 │ 2 │ 2 │ 3 │
│ 1 │ 3 │ 4 │ 6 │ 9 │
╰───┴───┴───┴───┴───╯

```
