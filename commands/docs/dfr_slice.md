---
title: dfr slice
categories: |
  dataframe
version: 0.77.0
dataframe: |
  Creates new dataframe from a slice of rows.
usage: |
  Creates new dataframe from a slice of rows.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr slice ```

## Examples

Create new dataframe from a slice of the rows
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr slice 0 1
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
╰───┴───┴───╯

```
