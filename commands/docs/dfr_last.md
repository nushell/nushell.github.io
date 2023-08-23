---
title: dfr last
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Creates new dataframe with tail rows or creates a last expression.
usage: |
  Creates new dataframe with tail rows or creates a last expression.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr last (rows)```

## Parameters

 -  `rows`: Number of rows for tail


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Create new dataframe with last rows
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr last 1
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 3 │ 4 │
╰───┴───┴───╯

```

Creates a last expression from a column
```shell
> dfr col a | dfr last

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag