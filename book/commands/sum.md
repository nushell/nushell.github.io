---
title: sum
categories: |
  expression
  lazyframe
version: 0.70.0
expression: |
  Creates a sum expression for an aggregation
lazyframe: |
  Aggregates columns to their sum value
usage: |
  Creates a sum expression for an aggregation
  Aggregates columns to their sum value
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> sum ```

## Examples

Sum aggregation for a group by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | into df
    | group-by a
    | agg (col b | sum)
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> sum ```

## Examples

Sums all columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | into df | sum
```
