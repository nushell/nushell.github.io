---
title: db from
version: 0.64.0
usage: |
  Select section from query statement for a DB
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db from (select) --as```

## Parameters

 -  `select`: table of derived table to select from
 -  `--as {string}`: Alias for the selected table

## Examples

Selects table from database
```shell
> db open db.mysql | db from table_a
```
