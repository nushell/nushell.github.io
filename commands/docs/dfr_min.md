---
title: dfr min
categories: |
  lazyframe
version: 0.83.0
lazyframe: |
  Aggregates columns to their min value
usage: |
  Aggregates columns to their min value
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr min ```

## Examples

Min value from columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | dfr into-df | dfr min
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 1 │
╰───┴───┴───╯

```
