---
title: std
categories: |
  expression
  lazyframe
version: 0.71.0
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

```> std ```

## Examples

Std aggregation for a group-by
```shell
> [[a b]; [one 2] [one 2] [two 1] [two 1]]
    | into df
    | group-by a
    | agg (col b | std)
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> std ```

## Examples

Std value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | std
```
