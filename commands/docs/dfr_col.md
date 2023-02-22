---
title: dfr col
categories: |
  expression
version: 0.76.0
expression: |
  Creates a named column expression
usage: |
  Creates a named column expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr col ```

## Examples

Creates a named column expression and converts it to a nu object
```shell
> dfr col a | dfr into-nu
```
