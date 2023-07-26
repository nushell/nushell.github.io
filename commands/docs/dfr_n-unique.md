---
title: dfr n-unique
categories: |
  expression
version: 0.83.0
expression: |
  creates a n-unique expression
usage: |
  creates a n-unique expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr n-unique ```

## Examples

Creates a is n-unique expression from a column
```shell
> dfr col a | dfr n-unique

```
