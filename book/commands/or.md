---
title: or
categories: |
  database
  db-expression
version: 0.71.0
database: |
  Includes an OR clause for a query
db_expression: |
  Includes an OR clause for an expression
usage: |
  Includes an OR clause for a query
  Includes an OR clause for an expression
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> or (where)```

## Parameters

 -  `where`: Where expression on the table

## Examples

selects a column from a database with an OR clause
```shell
> open db.sqlite
    | from table table_1
    | select a
    | where ((field a) > 1)
    | or ((field b) == 1)
    | describe
```

Creates an OR clause in the column names and a column
```shell
> open db.sqlite
    | from table table_1
    | select a
    | where ((field a) > 1 | or ((field a) < 10))
    | or ((field b) == 1)
    | describe
```

# <code>{{ $frontmatter.title }}</code> for db-expression

<div class='command-title'>{{ $frontmatter.db_expression }}</div>

## Signature

```> or (or)```

## Parameters

 -  `or`: OR expression

## Examples

Creates an AND expression
```shell
> (field a) > 1 | or ((field a) < 10) | into nu
```
