---
title: dfr agg
categories: |
  lazyframe
version: 0.78.0
lazyframe: |
  Performs a series of aggregations from a group-by.
usage: |
  Performs a series of aggregations from a group-by.
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
╭───┬───┬───────┬───────┬───────╮
│ # │ a │ b_min │ b_max │ b_sum │
├───┼───┼───────┼───────┼───────┤
│ 0 │ 1 │     2 │     4 │     6 │
│ 1 │ 2 │     4 │     6 │    10 │
╰───┴───┴───────┴───────┴───────╯

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
╭───┬───┬───────┬───────┬───────╮
│ # │ a │ b_min │ b_max │ b_sum │
├───┼───┼───────┼───────┼───────┤
│ 0 │ 1 │     2 │     4 │     6 │
│ 1 │ 2 │     4 │     6 │    10 │
╰───┴───┴───────┴───────┴───────╯

```
