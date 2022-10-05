---
title: field
version: 0.69.1
db_expression: |
  Creates column expression for database
usage: |
  Creates column expression for database
---

# <code>{{ $frontmatter.title }}</code> for db-expression

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.db_expression }}</div>

## Signature

```> field (name)```

## Parameters

 -  `name`: column name

## Examples

Creates a named field expression
```shell
> field name_1 | into nu
```
