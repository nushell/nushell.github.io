---
title: max
categories: |
  expression
  lazyframe
version: 0.73.1
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

```> max ```

## Examples

Max aggregation for a group-by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | into df
    | group-by a
    | agg (col b | max)
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> max ```

## Examples

Max value from columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | into df | max
```
