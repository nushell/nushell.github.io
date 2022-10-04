---
title: with-column
version: 0.69.1
dataframe_or_lazyframe: |
  Adds a series to the dataframe
usage: |
  Adds a series to the dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe or lazyframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe_or_lazyframe }}</div>

## Signature

```> with-column ...series or expressions --name```

## Parameters

 -  `...series or expressions`: series to be added or expressions used to define the new columns
 -  `--name {string}`: new column name

## Examples

Adds a series to the dataframe
```shell
> [[a b]; [1 2] [3 4]]
    | into df
    | with-column ([5 6] | into df) --name c
```

Adds a series to the dataframe
```shell
> [[a b]; [1 2] [3 4]]
    | into lazy
    | with-column [
        ((col a) * 2 | as "c")
        ((col a) * 3 | as "d")
      ]
    | collect
```
