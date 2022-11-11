---
title: expr-not
categories: |
  expression
version: 0.71.0
expression: |
  creates a not expression
usage: |
  creates a not expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> expr-not ```

## Examples

Creates a not expression
```shell
> (col a) > 2) | expr-not
```
