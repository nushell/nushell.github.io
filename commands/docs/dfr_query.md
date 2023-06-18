---
title: dfr query
categories: |
  dataframe
version: 0.81.0
dataframe: |
  Query dataframe using SQL. Note: The dataframe is always named 'df' in your query's from clause.
usage: |
  Query dataframe using SQL. Note: The dataframe is always named 'df' in your query's from clause.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr query (sql)```

## Parameters

 -  `sql`: sql query

## Examples

Query dataframe using SQL
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr query 'select a from df'
╭───┬───╮
│ # │ a │
├───┼───┤
│ 0 │ 1 │
│ 1 │ 3 │
╰───┴───╯

```
