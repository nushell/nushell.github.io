---
title: take while
version: 0.68.0
usage: |
  Take elements of the input while a predicate is true.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> take while (predicate)```

## Parameters

 -  `predicate`: the predicate that element(s) must match

## Examples

Take while the element is negative
```shell
> echo [-1 -2 9 1] | take while $it < 0
```
