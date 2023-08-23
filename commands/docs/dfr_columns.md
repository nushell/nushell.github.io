---
title: dfr columns
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Show dataframe columns.
usage: |
  Show dataframe columns.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr columns ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Dataframe columns
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr columns
╭───┬───╮
│ 0 │ a │
│ 1 │ b │
╰───┴───╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag