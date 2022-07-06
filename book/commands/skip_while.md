---
title: skip while
version: 0.65.1
usage: |
  Skip elements of the input while a predicate is true.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> skip while (predicate)```

## Parameters

 -  `predicate`: the predicate that skipped element must match

## Examples

Skip while the element is negative
```shell
> echo [-2 0 2 -1] | skip while $it < 0
```
