---
title: db fn
layout: command
version: 0.63.0
usage: |
  Creates function expression for a select operation
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db fn (name) ...arguments --distinct```

## Parameters

 -  `name`: function name
 -  `...arguments`: function arguments
 -  `--distinct`: distict values

## Examples

Creates a function expression
```shell
> db fn count name_1
```
