---
title: db or
layout: command
version: 0.63.0
usage: |
  Includes an OR clause for a query or expression
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db or (where)```

## Parameters

 -  `where`: Where expression on the table

## Examples

selects a column from a database with a where clause
```shell
> db open db.mysql
    | db select a
    | db from table_1
    | db where ((db col a) > 1)
    | db or ((db col b) == 1)
    | db describe
```

Creates a nested where clause
```shell
> db open db.mysql
    | db select a
    | db from table_1
    | db where ((db col a) > 1 | db or ((db col a) < 10))
    | db describe
```
