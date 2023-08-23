---
title: dfr arg-unique
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Returns indexes for unique values.
usage: |
  Returns indexes for unique values.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr arg-unique ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Returns indexes for unique values
```shell
> [1 2 2 3 3] | dfr into-df | dfr arg-unique
╭───┬────────────╮
│ # │ arg_unique │
├───┼────────────┤
│ 0 │          0 │
│ 1 │          1 │
│ 2 │          3 │
╰───┴────────────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag