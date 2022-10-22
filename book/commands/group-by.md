---
title: group-by
categories: |
  database
  default
  lazyframe
version: 0.70.0
database: |
  Group by query
default: |
  Create a new table grouped.
lazyframe: |
  Creates a groupby object that can be used for other aggregations
usage: |
  Group by query
  Create a new table grouped.
  Creates a groupby object that can be used for other aggregations
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> group-by ...select```

## Parameters

 -  `...select`: Select expression(s) on the table

## Examples

groups by column a and calculates the max
```shell
> open db.sqlite
    | from table table_a
    | select (fn max a)
    | group-by a
    | describe
```

groups by column column a and counts records
```shell
> open db.sqlite
    | from table table_a
    | select (fn count *)
    | group-by a
    | describe
```

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> group-by (grouper)```

## Parameters

 -  `grouper`: the grouper value to use

## Examples

group items by column named "type"
```shell
> ls | group-by type
```

you can also group by raw values by leaving out the argument
```shell
> echo ['1' '3' '1' '3' '2' '1' '1'] | group-by
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

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
