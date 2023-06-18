---
title: dfr arg-max
categories: |
  dataframe
version: 0.81.0
dataframe: |
  Return index for max value in series.
usage: |
  Return index for max value in series.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr arg-max ```

## Examples

Returns index for max value
```shell
> [1 3 2] | dfr into-df | dfr arg-max
╭───┬─────────╮
│ # │ arg_max │
├───┼─────────┤
│ 0 │       1 │
╰───┴─────────╯

```
