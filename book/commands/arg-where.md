---
title: arg-where
version: 0.67.1
usage: |
  Creates an expression that returns the arguments where expression is true
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> arg-where (column name)```

## Parameters

 -  `column name`: Expression to evaluate

## Examples

Return a dataframe where the value match the expression
```shell
> let df = ([[a b]; [one 1] [two 2] [three 3]] | into df);
    $df | select (arg-where ((col b) >= 2) | as b_arg)
```
