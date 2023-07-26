---
title: dfr is-null
categories: |
  expression
version: 0.83.0
expression: |
  creates a is null expression
usage: |
  creates a is null expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr is-null ```

## Examples

Creates a is null expression from a column
```shell
> dfr col a | dfr is-null

```
