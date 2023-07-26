---
title: dfr var
categories: |
  lazyframe
version: 0.83.0
lazyframe: |
  Aggregates columns to their var value
usage: |
  Aggregates columns to their var value
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr var ```

## Examples

Var value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr var
╭───┬──────┬──────╮
│ # │  a   │  b   │
├───┼──────┼──────┤
│ 0 │ 4.00 │ 0.00 │
╰───┴──────┴──────╯

```
