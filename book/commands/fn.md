---
title: fn
version: 0.69.1
db_expression: |
  Creates function expression for a select operation
usage: |
  Creates function expression for a select operation
---

# <code>{{ $frontmatter.title }}</code> for db-expression

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.db_expression }}</div>

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
> open db.sqlite
    | from table table_a
    | select (fn lead col_a)
    | describe
```
