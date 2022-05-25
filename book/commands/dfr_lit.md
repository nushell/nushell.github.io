---
title: dfr lit
layout: command
version: 0.63.0
usage: |
  Creates a literal expression
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr lit (literal)```

## Parameters

 -  `literal`: literal to construct the expression

## Examples

Created a literal expression and converts it to a nu object
```shell
> dfr lit 2 | dfr to-nu
```
