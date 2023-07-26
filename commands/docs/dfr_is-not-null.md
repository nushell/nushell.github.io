---
title: dfr is-not-null
categories: |
  expression
version: 0.83.0
expression: |
  creates a is not null expression
usage: |
  creates a is not null expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr is-not-null ```

## Examples

Creates a is not null expression from a column
```shell
> dfr col a | dfr is-not-null

```
