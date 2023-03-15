---
title: dfr not
categories: |
  dataframe
version: 0.77.0
dataframe: |
  Inverts boolean mask.
usage: |
  Inverts boolean mask.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr not ```

## Examples

Inverts boolean mask
```shell
> [true false true] | dfr into-df | dfr not
╭───┬───────╮
│ # │   0   │
├───┼───────┤
│ 0 │ false │
│ 1 │ true  │
│ 2 │ false │
╰───┴───────╯

```
