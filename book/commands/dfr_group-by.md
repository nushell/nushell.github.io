---
title: dfr group-by
layout: command
version: 0.63.0
usage: |
  Creates a groupby object that can be used for other aggregations
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr group-by ...Group by expressions```

## Parameters

 -  `...Group by expressions`: Expression(s) that define the lazy group by

## Examples

Group by and perform an aggregation
```shell
> [[a b]; [1 2] [1 4] [2 6] [2 4]]
    | dfr to-df
    | dfr group-by a
    | dfr aggregate [
        ("b" | dfr min | dfr as "b_min")
        ("b" | dfr max | dfr as "b_max")
        ("b" | dfr sum | dfr as "b_sum")
     ]
```

Group by and perform an aggregation
```shell
> [[a b]; [1 2] [1 4] [2 6] [2 4]]
    | dfr to-df
    | dfr to-lazy
    | dfr group-by a
    | dfr aggregate [
        ("b" | dfr min | dfr as "b_min")
        ("b" | dfr max | dfr as "b_max")
        ("b" | dfr sum | dfr as "b_sum")
     ]
    | dfr collect
```
