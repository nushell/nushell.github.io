---
title: from table
version: 0.69.1
database: |
  Select section from query statement for a DB
usage: |
  Select section from query statement for a DB
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> from table (select) --as```

## Parameters

 -  `select`: table of derived table to select from
 -  `--as {string}`: Alias for the selected table

## Examples

Selects a table from database
```shell
> open db.sqlite | from table table_a | describe
```
