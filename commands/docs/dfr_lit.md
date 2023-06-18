---
title: dfr lit
categories: |
  expression
version: 0.81.0
expression: |
  Creates a literal expression.
usage: |
  Creates a literal expression.
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr lit (literal)```

## Parameters

 -  `literal`: literal to construct the expression

## Examples

Created a literal expression and converts it to a nu object
```shell
> dfr lit 2 | dfr into-nu
╭───────┬─────────╮
│ expr  │ literal │
│ value │ 2       │
╰───────┴─────────╯
```
