---
title: dfr std
categories: |
  expression
  lazyframe
version: 0.76.0
expression: |
  Creates a std expression for an aggregation
lazyframe: |
  Aggregates columns to their std value
usage: |
  Creates a std expression for an aggregation
  Aggregates columns to their std value
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr std ```

## Examples

Std aggregation for a group-by
```shell
> [[a b]; [one 2] [one 2] [two 1] [two 1]]
    | dfr into-df
    | dfr group-by a
    | dfr agg (dfr col b | dfr std)
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr std ```

## Examples

Std value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr std
```
