---
title: skip until
version: 0.65.1
usage: |
  Skip elements of the input until a predicate is true.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> skip until (predicate)```

## Parameters

 -  `predicate`: the predicate that skipped element must not match

## Examples

Skip until the element is positive
```shell
> echo [-2 0 2 -1] | skip until $it > 0
```
