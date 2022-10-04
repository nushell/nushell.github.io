---
title: skip until
version: 0.69.1
filters: |
  Skip elements of the input until a predicate is true.
usage: |
  Skip elements of the input until a predicate is true.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filters }}</div>

## Signature

```> skip until (predicate)```

## Parameters

 -  `predicate`: the predicate that skipped element must not match

## Examples

Skip until the element is positive
```shell
> echo [-2 0 2 -1] | skip until $it > 0
```
