---
title: take until
version: 0.67.0
usage: |
  Take elements of the input until a predicate is true.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> take until (predicate)```

## Parameters

 -  `predicate`: the predicate that element(s) must not match

## Examples

Take until the element is positive
```shell
> echo [-1 -2 9 1] | take until $it > 0
```
