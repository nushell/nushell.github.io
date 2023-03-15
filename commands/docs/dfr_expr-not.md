---
title: dfr expr-not
categories: |
  expression
version: 0.77.0
expression: |
  creates a not expression
usage: |
  creates a not expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr expr-not ```

## Examples

Creates a not expression
```shell
> (dfr col a) > 2) | dfr expr-not

```
