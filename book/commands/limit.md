---
title: limit
version: 0.65.1
usage: |
  Limit result from query
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> limit (limit)```

## Parameters

 -  `limit`: Number of rows to extract for query

## Examples

Limits selection from table
```shell
> open db.mysql
    | into db
    | from table_a
    | select a
    | limit 10
    | describe
```
