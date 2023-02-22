---
title: dfr quantile
categories: |
  expression
  lazyframe
version: 0.76.0
expression: |
  Aggregates the columns to the selected quantile
lazyframe: |
  Aggregates the columns to the selected quantile
usage: |
  Aggregates the columns to the selected quantile
  Aggregates the columns to the selected quantile
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr quantile ```

## Examples

Quantile aggregation for a group-by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | dfr into-df
    | dfr group-by a
    | dfr agg (dfr col b | dfr quantile 0.5)
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr quantile ```

## Examples

quantile value from columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | dfr into-df | dfr quantile 0.5
```
