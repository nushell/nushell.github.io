---
title: dfr median
categories: |
  expression
  lazyframe
version: 0.82.0
expression: |
  Creates a median expression for an aggregation
lazyframe: |
  Aggregates columns to their median value
usage: |
  Creates a median expression for an aggregation
  Aggregates columns to their median value
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr median ```

## Examples

Median aggregation for a group-by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | dfr into-df
    | dfr group-by a
    | dfr agg (dfr col b | dfr median)
╭───┬─────┬────────╮
│ # │  a  │   b    │
├───┼─────┼────────┤
│ 0 │ one │ 3.0000 │
│ 1 │ two │ 1.0000 │
╰───┴─────┴────────╯

```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr median ```

## Examples

Median value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr median
╭───┬────────┬────────╮
│ # │   a    │   b    │
├───┼────────┼────────┤
│ 0 │ 4.0000 │ 2.0000 │
╰───┴────────┴────────╯

```
