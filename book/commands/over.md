---
title: over
version: 0.65.1
usage: |
  Adds a partition to an expression function
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
> open db.mysql
    | into db
    | select (fn lead col_a | over col_b)
    | from table_a
    | describe
```
