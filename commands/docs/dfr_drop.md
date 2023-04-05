---
title: dfr drop
categories: |
  dataframe
version: 0.78.0
dataframe: |
  Creates a new dataframe by dropping the selected columns.
usage: |
  Creates a new dataframe by dropping the selected columns.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr drop ```

## Examples

drop column a
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr drop a
╭───┬───╮
│ # │ b │
├───┼───┤
│ 0 │ 2 │
│ 1 │ 4 │
╰───┴───╯

```
