---
title: group-by
version: 0.68.0
usage: |
  Creates a groupby object that can be used for other aggregations
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> group-by ...Group by expressions```

## Parameters

 -  `...Group by expressions`: Expression(s) that define the lazy group by

## Examples

Group by and perform an aggregation
```shell
> [[a b]; [1 2] [1 4] [2 6] [2 4]]
    | into df
    | group-by a
    | agg [
        (col b | min | as "b_min")
        (col b | max | as "b_max")
        (col b | sum | as "b_sum")
     ]
```

Group by and perform an aggregation
```shell
> [[a b]; [1 2] [1 4] [2 6] [2 4]]
    | into lazy
    | group-by a
    | agg [
        (col b | min | as "b_min")
        (col b | max | as "b_max")
        (col b | sum | as "b_sum")
     ]
    | collect
```
