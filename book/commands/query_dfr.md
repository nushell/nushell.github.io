---
title: query dfr
version: 0.69.1
dataframe: |
  Query dataframe using SQL. Note: The dataframe is always named 'df' in your query's from clause.
usage: |
  Query dataframe using SQL. Note: The dataframe is always named 'df' in your query's from clause.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> query dfr (sql)```

## Parameters

 -  `sql`: sql query

## Examples

Query dataframe using SQL
```shell
> [[a b]; [1 2] [3 4]] | into df | query dfr 'select a from df'
```
