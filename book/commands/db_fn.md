---
title: db fn
version: 0.64.0
usage: |
  Creates function expression for a select operation
---

# <code>{{ $frontmatter.title }}</code>

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
