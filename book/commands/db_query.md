---
title: db query
version: 0.64.0
usage: |
  Query a database using SQL.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db query (query)```

## Parameters

 -  `query`: SQL to execute against the database

## Examples

Get 1 table out of a SQLite database
```shell
> db open foo.db | db query "SELECT * FROM Bar"
```
