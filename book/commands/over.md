---
title: over
categories: |
  db-expression
version: 0.71.0
db_expression: |
  Adds a partition to an expression function
usage: |
  Adds a partition to an expression function
---

# <code>{{ $frontmatter.title }}</code> for db-expression

<div class='command-title'>{{ $frontmatter.db_expression }}</div>

## Signature

```> over ...partition-by```

## Parameters

 -  `...partition-by`: columns to partition the window function

## Examples

Adds a partition to a function expression
```shell
> fn avg col_a | over col_b | into nu
```

orders query by a column
```shell
> open db.sqlite
    | from table table_a
    | select (fn lead col_a | over col_b)
    | describe
```
