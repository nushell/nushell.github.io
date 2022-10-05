---
title: limit
version: 0.69.1
database: |
  Limit result from query
usage: |
  Limit result from query
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> limit (limit)```

## Parameters

 -  `limit`: Number of rows to extract for query

## Examples

Limits selection from table
```shell
> open db.sqlite
    | from table table_a
    | select a
    | limit 10
    | describe
```
