---
title: dfr agg
categories: |
  lazyframe
version: 0.76.0
lazyframe: |
  Performs a series of aggregations from a group-by
usage: |
  Performs a series of aggregations from a group-by
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr agg ```

## Examples

Group by and perform an aggregation
```shell
> [[a b]; [1 2] [1 4] [2 6] [2 4]]
    | dfr into-df
    | dfr group-by a
    | dfr agg [
        (dfr col b | dfr min | dfr as "b_min")
        (dfr col b | dfr max | dfr as "b_max")
        (dfr col b | dfr sum | dfr as "b_sum")
     ]
```

Group by and perform an aggregation
```shell
> [[a b]; [1 2] [1 4] [2 6] [2 4]]
    | dfr into-lazy
    | dfr group-by a
    | dfr agg [
        (dfr col b | dfr min | dfr as "b_min")
        (dfr col b | dfr max | dfr as "b_max")
        (dfr col b | dfr sum | dfr as "b_sum")
     ]
    | dfr collect
```
