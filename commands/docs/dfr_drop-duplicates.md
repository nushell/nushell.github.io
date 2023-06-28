---
title: dfr drop-duplicates
categories: |
  dataframe
version: 0.82.1
dataframe: |
  Drops duplicate values in dataframe.
usage: |
  Drops duplicate values in dataframe.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr drop-duplicates (subset) --maintain --last```

## Parameters

 -  `subset`: subset of columns to drop duplicates
 -  `--maintain` `(-m)`: maintain order
 -  `--last` `(-l)`: keeps last duplicate value (by default keeps first)

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4] [1 2]] | dfr into-df | dfr drop-duplicates
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 3 │ 4 │
│ 1 │ 1 │ 2 │
╰───┴───┴───╯

```
