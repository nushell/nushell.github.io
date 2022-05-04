---
title: db query
layout: command
version: 0.62.0
usage: |
  Query a database using SQL.
---

# `{{ $frontmatter.title }}`

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
