---
title: group-by
categories: |
  default
  lazyframe
version: 0.74.0
default: |
  Splits a list or table into groups, and returns a record containing those groups.
lazyframe: |
  Creates a group-by object that can be used for other aggregations
usage: |
  Splits a list or table into groups, and returns a record containing those groups.
  Creates a group-by object that can be used for other aggregations
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> group-by (grouper)```

## Parameters

 -  `grouper`: the grouper value to use

## Examples

Group items by the "type" column's values
```shell
> ls | group-by type
```

You can also group by raw values by leaving out the argument
```shell
> ['1' '3' '1' '3' '2' '1' '1'] | group-by
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> group-by ```

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
