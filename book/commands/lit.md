---
title: lit
version: 0.69.1
expression: |
  Creates a literal expression
usage: |
  Creates a literal expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.expression }}</div>

## Signature

```> lit (literal)```

## Parameters

 -  `literal`: literal to construct the expression

## Examples

Created a literal expression and converts it to a nu object
```shell
> lit 2 | into nu
```
