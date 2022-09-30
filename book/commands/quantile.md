---
title: quantile
version: 0.69.1
usage: |
  Aggregates the columns to the selected quantile
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
