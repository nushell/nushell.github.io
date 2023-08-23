---
title: dfr get
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Creates dataframe with the selected columns.
usage: |
  Creates dataframe with the selected columns.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr get ...rest```

## Parameters

 -  `...rest`: column names to sort dataframe


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Returns the selected column
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr get a
╭───┬───╮
│ # │ a │
├───┼───┤
│ 0 │ 1 │
│ 1 │ 3 │
╰───┴───╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag