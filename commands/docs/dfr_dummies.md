---
title: dfr dummies
categories: |
  dataframe
version: 0.81.0
dataframe: |
  Creates a new dataframe with dummy variables.
usage: |
  Creates a new dataframe with dummy variables.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr dummies ```

## Examples

Create new dataframe with dummy variables from a dataframe
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr dummies
╭───┬─────┬─────┬─────┬─────╮
│ # │ a_1 │ a_3 │ b_2 │ b_4 │
├───┼─────┼─────┼─────┼─────┤
│ 0 │   1 │   0 │   1 │   0 │
│ 1 │   0 │   1 │   0 │   1 │
╰───┴─────┴─────┴─────┴─────╯

```

Create new dataframe with dummy variables from a series
```shell
> [1 2 2 3 3] | dfr into-df | dfr dummies
╭───┬─────┬─────┬─────╮
│ # │ 0_1 │ 0_2 │ 0_3 │
├───┼─────┼─────┼─────┤
│ 0 │   1 │   0 │   0 │
│ 1 │   0 │   1 │   0 │
│ 2 │   0 │   1 │   0 │
│ 3 │   0 │   0 │   1 │
│ 4 │   0 │   0 │   1 │
╰───┴─────┴─────┴─────╯

```
