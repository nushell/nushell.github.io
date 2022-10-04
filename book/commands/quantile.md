---
title: quantile
version: 0.69.1
expression: |
  Aggregates the columns to the selected quantile
lazyframe: |
  Aggregates the columns to the selected quantile
usage: |
  Aggregates the columns to the selected quantile
  Aggregates the columns to the selected quantile
---

# <code>{{ $frontmatter.title }}</code> for expression

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.expression }}</div>

## Signature

```> quantile (quantile)```

## Parameters

 -  `quantile`: quantile value for quantile operation

## Examples

Quantile aggregation for a group by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | into df
    | group-by a
    | agg (col b | quantile 0.5)
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> quantile (quantile)```

## Parameters

 -  `quantile`: quantile value for quantile operation

## Examples

quantile value from columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | into df | quantile 0.5
```
