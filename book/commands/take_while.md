---
title: take while
categories: |
  filters
version: 0.74.0
filters: |
  Take elements of the input while a predicate is true.
usage: |
  Take elements of the input while a predicate is true.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> take while (predicate)```

## Parameters

 -  `predicate`: the predicate that element(s) must match

## Examples

Take while the element is negative
```shell
> [-1 -2 9 1] | take while {|x| $x < 0 }
```

Take while the element is negative using stored condition
```shell
> let cond = {|x| $x < 0 }; [-1 -2 9 1] | take while $cond
```

Take while the field value is negative
```shell
> [{a: -1} {a: -2} {a: 9} {a: 1}] | take while {|x| $x.a < 0 }
```
