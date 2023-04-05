---
title: dfr count-null
categories: |
  dataframe
version: 0.78.0
dataframe: |
  Counts null values.
usage: |
  Counts null values.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr count-null ```

## Examples

Counts null values
```shell
> let s = ([1 1 0 0 3 3 4] | dfr into-df);
    ($s / $s) | dfr count-null
╭───┬────────────╮
│ # │ count_null │
├───┼────────────┤
│ 0 │          2 │
╰───┴────────────╯

```
