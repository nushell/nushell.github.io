---
title: and
version: 0.69.1
database: |
  Includes an AND clause for a query
db_expression: |
  Includes an AND clause for an expression
usage: |
  Includes an AND clause for a query
  Includes an AND clause for an expression
---

# <code>{{ $frontmatter.title }}</code> for database

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.database }}</div>

## Signature

```> and (where)```

## Parameters

 -  `where`: Where expression on the table

## Examples

Selects a column from a database with an AND clause
```shell
> open db.sqlite
    | from table table_1
    | select a
    | where ((field a) > 1)
    | and ((field b) == 1)
    | describe
```

Creates a AND clause combined with an expression AND
```shell
> open db.sqlite
    | from table table_1
    | select a
    | where ((field a) > 1 | and ((field a) < 10))
    | and ((field b) == 1)
    | describe
```

# <code>{{ $frontmatter.title }}</code> for db-expression

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.db_expression }}</div>

## Signature

```> and (and)```

## Parameters

 -  `and`: AND expression

## Examples

Creates an AND expression
```shell
> (field a) > 1 | and ((field a) < 10) | into nu
```
