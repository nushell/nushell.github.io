---
title: fn
version: 0.66.1
usage: |
  Creates function expression for a select operation
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> fn (name) ...arguments --distinct```

## Parameters

 -  `name`: function name
 -  `...arguments`: function arguments
 -  `--distinct`: distict values

## Examples

Creates a function expression
```shell
> fn count name_1 | into nu
```

orders query by a column
```shell
> open db.mysql
    | into db
    | select (fn lead col_a)
    | from table_a
    | describe
```
