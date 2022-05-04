---
title: db limit
layout: command
version: 0.62.0
usage: |
  Limit result from query
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db limit (limit)```

## Parameters

 -  `limit`: Number of rows to extract for query

## Examples

Limits selection from table
```shell
> db open db.mysql
    | db from table_a
    | db select a
    | db limit 10
    | db describe
```
