---
title: dfr min
categories: |
  expression
  lazyframe
version: 0.77.0
expression: |
  Creates a min expression
lazyframe: |
  Aggregates columns to their min value
usage: |
  Creates a min expression
  Aggregates columns to their min value
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr min ```

## Examples

Min aggregation for a group-by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | dfr into-df
    | dfr group-by a
    | dfr agg (dfr col b | dfr min)
╭───┬─────┬───╮
│ # │  a  │ b │
├───┼─────┼───┤
│ 0 │ one │ 2 │
│ 1 │ two │ 1 │
╰───┴─────┴───╯

```

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
