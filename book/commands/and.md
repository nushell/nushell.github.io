---
title: and
version: 0.65.1
usage: |
  Includes an AND clause for an expression
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> and (and)```

## Parameters

 -  `and`: AND expression

## Examples

Creates an AND expression
```shell
> (field a) > 1 | and ((field a) < 10) | into nu
```
