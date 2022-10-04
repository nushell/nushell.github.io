---
title: expr-not
version: 0.69.1
expression: |
  creates a not expression
usage: |
  creates a not expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.expression }}</div>

## Signature

```> expr-not ```

## Examples

Creates a not expression
```shell
> (col a) > 2) | expr-not
```
