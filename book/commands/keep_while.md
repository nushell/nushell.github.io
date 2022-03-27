---
title: keep while
layout: command
version: 0.60.1
usage: |
  Keep elements of the input while a predicate is true.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> keep while (predicate)`

## Parameters

- `predicate`: the predicate that kept element must not match

## Examples

Keep while the element is negative

```shell
> echo [-1 -2 9 1] | keep while $it < 0
```
