---
title: field
categories: |
  db-expression
version: 0.71.0
db_expression: |
  Creates column expression for database
usage: |
  Creates column expression for database
---

# <code>{{ $frontmatter.title }}</code> for db-expression

<div class='command-title'>{{ $frontmatter.db_expression }}</div>

## Signature

```> field (name)```

## Parameters

 -  `name`: column name

## Examples

Creates a named field expression
```shell
> field name_1 | into nu
```
