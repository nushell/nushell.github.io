---
title: dfr std
categories: |
  lazyframe
version: 0.83.0
lazyframe: |
  Aggregates columns to their std value
usage: |
  Aggregates columns to their std value
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr std ```

## Examples

Std value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr std
╭───┬──────┬──────╮
│ # │  a   │  b   │
├───┼──────┼──────┤
│ 0 │ 2.00 │ 0.00 │
╰───┴──────┴──────╯

```
