---
title: dfr col
categories: |
  expression
version: 0.82.1
expression: |
  Creates a named column expression.
usage: |
  Creates a named column expression.
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr col (column name)```

## Parameters

 -  `column name`: Name of column to be used

## Examples

Creates a named column expression and converts it to a nu object
```shell
> dfr col a | dfr into-nu
╭───────┬────────╮
│ expr  │ column │
│ value │ a      │
╰───────┴────────╯
```
