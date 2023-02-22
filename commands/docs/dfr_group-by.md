---
title: dfr group-by
categories: |
  lazyframe
version: 0.76.0
lazyframe: |
  Creates a group-by object that can be used for other aggregations
usage: |
  Creates a group-by object that can be used for other aggregations
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr group-by ```

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
