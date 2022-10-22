---
title: col
categories: |
  expression
version: 0.70.0
expression: |
  Creates a named column expression
usage: |
  Creates a named column expression
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> col (column name)```

## Parameters

 -  `column name`: Name of column to be used

## Examples

Creates a named column expression and converts it to a nu object
```shell
> col a | into nu
```
