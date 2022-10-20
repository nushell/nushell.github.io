---
title: take until
version: 0.70.0
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
> echo [-1 -2 9 1] | take until $it > 0
```
