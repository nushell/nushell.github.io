---
title: dfr slice
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Creates new dataframe from a slice of rows.
usage: |
  Creates new dataframe from a slice of rows.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr slice (offset) (size)```

## Parameters

 -  `offset`: start of slice
 -  `size`: size of slice


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Create new dataframe from a slice of the rows
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr slice 0 1
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
╰───┴───┴───╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag