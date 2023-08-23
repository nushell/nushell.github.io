---
title: dfr uppercase
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Uppercase the strings in the column.
usage: |
  Uppercase the strings in the column.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr uppercase ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Modifies strings to uppercase
```shell
> [Abc aBc abC] | dfr into-df | dfr uppercase
╭───┬─────╮
│ # │  0  │
├───┼─────┤
│ 0 │ ABC │
│ 1 │ ABC │
│ 2 │ ABC │
╰───┴─────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag