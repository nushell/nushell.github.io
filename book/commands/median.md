---
title: median
categories: |
  expression
  lazyframe
version: 0.71.0
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

```> median ```

## Examples

Median aggregation for a group-by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | into df
    | group-by a
    | agg (col b | median)
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> median ```

## Examples

Median value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | median
```
