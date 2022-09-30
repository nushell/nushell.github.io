---
title: query dfr
version: 0.69.1
usage: |
  Query dataframe using SQL. Note: The dataframe is always named 'df' in your query's from clause.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> query dfr (sql)```

## Parameters

 -  `sql`: sql query

## Examples

Query dataframe using SQL
```shell
> [[a b]; [1 2] [3 4]] | into df | query dfr 'select a from df'
```
