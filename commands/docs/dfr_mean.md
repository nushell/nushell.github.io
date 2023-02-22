---
title: dfr mean
categories: |
  expression
  lazyframe
version: 0.76.0
expression: |
  Creates a mean expression for an aggregation
lazyframe: |
  Aggregates columns to their mean value
usage: |
  Creates a mean expression for an aggregation
  Aggregates columns to their mean value
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr mean ```

## Examples

Mean aggregation for a group-by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | dfr into-df
    | dfr group-by a
    | dfr agg (dfr col b | dfr mean)
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr mean ```

## Examples

Mean value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr mean
```
