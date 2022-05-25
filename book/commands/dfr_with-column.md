---
title: dfr with-column
layout: command
version: 0.63.0
usage: |
  Adds a series to the dataframe
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr with-column ...series or expressions --name```

## Parameters

 -  `...series or expressions`: series to be added or expressions used to define the new columns
 -  `--name {string}`: new column name

## Examples

Adds a series to the dataframe
```shell
> [[a b]; [1 2] [3 4]]
    | dfr to-df
    | dfr with-column ([5 6] | dfr to-df) --name c
```

Adds a series to the dataframe
```shell
> [[a b]; [1 2] [3 4]]
    | dfr to-df
    | dfr to-lazy
    | dfr with-column ((dfr col a) * 2 | dfr as "c")
    | dfr collect
```
