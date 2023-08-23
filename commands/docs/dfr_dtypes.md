---
title: dfr dtypes
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Show dataframe data types.
usage: |
  Show dataframe data types.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr dtypes ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Dataframe dtypes
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr dtypes
╭───┬────────┬───────╮
│ # │ column │ dtype │
├───┼────────┼───────┤
│ 0 │ a      │ i64   │
│ 1 │ b      │ i64   │
╰───┴────────┴───────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag