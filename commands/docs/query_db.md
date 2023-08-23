---
title: query db
categories: |
  database
version: 0.84.0
database: |
  Query a database using SQL.
usage: |
  Query a database using SQL.
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> query db (SQL)```

## Parameters

 -  `SQL`: SQL to execute against the database


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Execute SQL against a SQLite database
```shell
> open foo.db | query db "SELECT * FROM Bar"

```
