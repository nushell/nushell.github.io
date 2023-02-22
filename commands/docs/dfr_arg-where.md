---
title: dfr arg-where
categories: |
  expression
version: 0.76.0
expression: |
  Creates an expression that returns the arguments where expression is true
usage: |
  Creates an expression that returns the arguments where expression is true
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr arg-where ```

## Examples

Return a dataframe where the value match the expression
```shell
> let df = ([[a b]; [one 1] [two 2] [three 3]] | dfr into-df);
    $df | dfr select (dfr arg-where ((dfr col b) >= 2) | dfr as b_arg)
```
