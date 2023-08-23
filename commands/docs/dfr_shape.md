---
title: dfr shape
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Shows column and row size for a dataframe.
usage: |
  Shows column and row size for a dataframe.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr shape ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Shows row and column shape
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr shape
╭───┬──────┬─────────╮
│ # │ rows │ columns │
├───┼──────┼─────────┤
│ 0 │    2 │       2 │
╰───┴──────┴─────────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag