---
title: dfr summary
categories: |
  dataframe
version: 0.78.0
dataframe: |
  For a dataframe, produces descriptive statistics (summary statistics) for its numeric columns.
usage: |
  For a dataframe, produces descriptive statistics (summary statistics) for its numeric columns.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr summary ```

## Examples

list dataframe descriptives
```shell
> [[a b]; [1 1] [1 1]] | dfr into-df | dfr summary
╭───┬────────────┬─────────┬─────────╮
│ # │ descriptor │ a (i64) │ b (i64) │
├───┼────────────┼─────────┼─────────┤
│ 0 │ count      │  2.0000 │  2.0000 │
│ 1 │ sum        │  2.0000 │  2.0000 │
│ 2 │ mean       │  1.0000 │  1.0000 │
│ 3 │ median     │  1.0000 │  1.0000 │
│ 4 │ std        │  0.0000 │  0.0000 │
│ 5 │ min        │  1.0000 │  1.0000 │
│ 6 │ 25%        │  1.0000 │  1.0000 │
│ 7 │ 50%        │  1.0000 │  1.0000 │
│ 8 │ 75%        │  1.0000 │  1.0000 │
│ 9 │ max        │  1.0000 │  1.0000 │
╰───┴────────────┴─────────┴─────────╯

```
