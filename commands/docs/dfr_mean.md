---
title: dfr mean
categories: |
  lazyframe
version: 0.83.0
lazyframe: |
  Aggregates columns to their mean value
usage: |
  Aggregates columns to their mean value
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr mean ```

## Examples

Mean value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr mean
╭───┬──────┬──────╮
│ # │  a   │  b   │
├───┼──────┼──────┤
│ 0 │ 4.00 │ 2.00 │
╰───┴──────┴──────╯

```
