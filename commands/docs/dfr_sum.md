---
title: dfr sum
categories: |
  lazyframe
version: 0.83.0
lazyframe: |
  Aggregates columns to their sum value
usage: |
  Aggregates columns to their sum value
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr sum ```

## Examples

Sums all columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | dfr into-df | dfr sum
╭───┬────┬───╮
│ # │ a  │ b │
├───┼────┼───┤
│ 0 │ 11 │ 7 │
╰───┴────┴───╯

```
