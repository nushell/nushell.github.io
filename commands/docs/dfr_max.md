---
title: dfr max
categories: |
  lazyframe
version: 0.83.0
lazyframe: |
  Aggregates columns to their max value
usage: |
  Aggregates columns to their max value
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr max ```

## Examples

Max value from columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | dfr into-df | dfr max
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 6 │ 4 │
╰───┴───┴───╯

```
