---
title: var
version: 0.70.0
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

```> var ```

## Examples

Var aggregation for a group by
```shell
> [[a b]; [one 2] [one 2] [two 1] [two 1]]
    | into df
    | group-by a
    | agg (col b | var)
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> var ```

## Examples

Var value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | var
```
