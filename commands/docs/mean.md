---
title: mean
categories: |
  expression
  lazyframe
version: 0.75.0
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

```> mean ```

## Examples

Mean aggregation for a group-by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | into df
    | group-by a
    | agg (col b | mean)
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> mean ```

## Examples

Mean value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | mean
```
