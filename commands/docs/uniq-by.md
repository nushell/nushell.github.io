---
title: uniq-by
categories: |
  filters
version: 0.76.1
filters: |
  Return the distinct values in the input by the given column(s).
usage: |
  Return the distinct values in the input by the given column(s).
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> uniq-by ...rest --count --repeated --ignore-case --unique```

## Parameters

 -  `...rest`: the column(s) to filter by
 -  `--count` `(-c)`: Return a table containing the distinct input values together with their counts
 -  `--repeated` `(-d)`: Return the input values that occur more than once
 -  `--ignore-case` `(-i)`: Ignore differences in case when comparing input values
 -  `--unique` `(-u)`: Return the input values that occur once only

## Examples

Get rows from table filtered by column uniqueness
```shell
> [[fruit count]; [apple 9] [apple 2] [pear 3] [orange 7]] | uniq-by fruit
```
