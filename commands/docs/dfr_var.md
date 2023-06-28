---
title: dfr var
categories: |
  expression
  lazyframe
version: 0.82.0
expression: |
  Create a var expression for an aggregation
lazyframe: |
  Aggregates columns to their var value
usage: |
  Create a var expression for an aggregation
  Aggregates columns to their var value
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr var ```

## Examples

Var aggregation for a group-by
```shell
> [[a b]; [one 2] [one 2] [two 1] [two 1]]
    | dfr into-df
    | dfr group-by a
    | dfr agg (dfr col b | dfr var)
╭───┬─────┬────────╮
│ # │  a  │   b    │
├───┼─────┼────────┤
│ 0 │ one │ 0.0000 │
│ 1 │ two │ 0.0000 │
╰───┴─────┴────────╯

```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr var ```

## Examples

Var value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr var
╭───┬────────┬────────╮
│ # │   a    │   b    │
├───┼────────┼────────┤
│ 0 │ 4.0000 │ 0.0000 │
╰───┴────────┴────────╯

```
