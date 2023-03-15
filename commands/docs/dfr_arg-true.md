---
title: dfr arg-true
categories: |
  dataframe
version: 0.77.0
dataframe: |
  Returns indexes where values are true.
usage: |
  Returns indexes where values are true.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr arg-true ```

## Examples

Returns indexes where values are true
```shell
> [false true false] | dfr into-df | dfr arg-true
╭───┬──────────╮
│ # │ arg_true │
├───┼──────────┤
│ 0 │        1 │
╰───┴──────────╯

```
