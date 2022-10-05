---
title: take while
version: 0.69.1
filters: |
  Take elements of the input while a predicate is true.
usage: |
  Take elements of the input while a predicate is true.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filters }}</div>

## Signature

```> take while (predicate)```

## Parameters

 -  `predicate`: the predicate that element(s) must match

## Examples

Take while the element is negative
```shell
> echo [-1 -2 9 1] | take while $it < 0
```
