---
title: dfr first
categories: |
  expression
version: 0.83.0
expression: |
  creates a first expression
usage: |
  creates a first expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr first ```

## Examples

Creates a first expression from a column
```shell
> dfr col a | dfr first

```
