---
title: filter
categories: |
  filters
  lazyframe
version: 0.74.0
filters: |
  Filter values based on a predicate closure.
lazyframe: |
  Filter dataframe based in expression
usage: |
  Filter values based on a predicate closure.
  Filter dataframe based in expression
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> filter (closure)```

## Parameters

 -  `closure`: Predicate closure

## Notes
This command works similar to 'where' but allows reading the predicate closure from
a variable. On the other hand, the "row condition" syntax is not supported.
## Examples

Filter items of a list according to a condition
```shell
> [1 2] | filter {|x| $x > 1}
```

Filter rows of a table according to a condition
```shell
> [{a: 1} {a: 2}] | filter {|x| $x.a > 1}
```

Filter rows of a table according to a stored condition
```shell
> let cond = {|x| $x.a > 1}; [{a: 1} {a: 2}] | filter $cond
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> filter ```

## Examples

Filter dataframe using an expression
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | filter ((col a) >= 4)
```
