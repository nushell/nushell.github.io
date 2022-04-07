---
title: take while
layout: command
version: 0.60.1
usage: |
  Take elements of the input while a predicate is true.
---

# `{{ $frontmatter.title }}`

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
