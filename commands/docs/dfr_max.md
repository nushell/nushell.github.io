---
title: dfr max
categories: |
  expression
  lazyframe
version: 0.77.0
expression: |
  Creates a max expression
lazyframe: |
  Aggregates columns to their max value
usage: |
  Creates a max expression
  Aggregates columns to their max value
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr max ```

## Examples

Max aggregation for a group-by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | dfr into-df
    | dfr group-by a
    | dfr agg (dfr col b | dfr max)
╭───┬─────┬───╮
│ # │  a  │ b │
├───┼─────┼───┤
│ 0 │ one │ 4 │
│ 1 │ two │ 1 │
╰───┴─────┴───╯

```

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
