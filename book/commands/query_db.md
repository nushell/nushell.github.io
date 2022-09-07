---
title: query db
version: 0.68.0
usage: |
  Query a database using SQL.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> query db (SQL)```

## Parameters

 -  `SQL`: SQL to execute against the database

## Examples

Execute SQL against a SQLite database
```shell
> open foo.db | query db "SELECT * FROM Bar"
```
