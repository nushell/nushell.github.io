---
title: skip until
version: 0.70.0
filters: |
  Skip elements of the input until a predicate is true.
usage: |
  Skip elements of the input until a predicate is true.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> skip until (predicate)```

## Parameters

 -  `predicate`: the predicate that skipped element must not match

## Examples

Skip until the element is positive
```shell
> echo [-2 0 2 -1] | skip until $it > 0
```
