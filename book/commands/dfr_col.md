---
title: dfr col
layout: command
version: 0.63.0
usage: |
  Creates a named column expression
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr col (column name)```

## Parameters

 -  `column name`: Name of column to be used

## Examples

Creates a named column expression and converts it to a nu object
```shell
> dfr col col_a | dfr to-nu
```
