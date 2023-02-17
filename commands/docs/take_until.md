---
title: take until
categories: |
  filters
version: 0.75.0
filters: |
  Take elements of the input until a predicate is true.
usage: |
  Take elements of the input until a predicate is true.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> take until (predicate)```

## Parameters

 -  `predicate`: the predicate that element(s) must not match

## Examples

Take until the element is positive
```shell
> [-1 -2 9 1] | take until {|x| $x > 0 }
```

Take until the element is positive using stored condition
```shell
> let cond = {|x| $x > 0 }; [-1 -2 9 1] | take until $cond
```

Take until the field value is positive
```shell
> [{a: -1} {a: -2} {a: 9} {a: 1}] | take until {|x| $x.a > 0 }
```
