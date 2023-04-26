---
title: dfr lowercase
categories: |
  dataframe
version: 0.79.0
dataframe: |
  Lowercase the strings in the column.
usage: |
  Lowercase the strings in the column.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr lowercase ```

## Examples

Modifies strings to lowercase
```shell
> [Abc aBc abC] | dfr into-df | dfr lowercase
╭───┬─────╮
│ # │  0  │
├───┼─────┤
│ 0 │ abc │
│ 1 │ abc │
│ 2 │ abc │
╰───┴─────╯

```
