---
title: dfr melt
categories: |
  dataframe
version: 0.82.1
dataframe: |
  Unpivot a DataFrame from wide to long format.
usage: |
  Unpivot a DataFrame from wide to long format.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr melt --columns --values --variable-name --value-name```

## Parameters

 -  `--columns {table}`: column names for melting
 -  `--values {table}`: column names used as value columns
 -  `--variable-name {string}`: optional name for variable column
 -  `--value-name {string}`: optional name for value column

## Examples

melt dataframe
```shell
> [[a b c d]; [x 1 4 a] [y 2 5 b] [z 3 6 c]] | dfr into-df | dfr melt -c [b c] -v [a d]
╭───┬───┬───┬──────────┬───────╮
│ # │ b │ c │ variable │ value │
├───┼───┼───┼──────────┼───────┤
│ 0 │ 1 │ 4 │ a        │ x     │
│ 1 │ 2 │ 5 │ a        │ y     │
│ 2 │ 3 │ 6 │ a        │ z     │
│ 3 │ 1 │ 4 │ d        │ a     │
│ 4 │ 2 │ 5 │ d        │ b     │
│ 5 │ 3 │ 6 │ d        │ c     │
╰───┴───┴───┴──────────┴───────╯

```
