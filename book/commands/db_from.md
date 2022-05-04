---
title: db from
layout: command
version: 0.62.0
usage: |
  Select section from query statement for a DB
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db from (select)```

## Parameters

 -  `select`: Name of table to select from

## Examples

Selects table from database
```shell
> db open db.mysql | db from table_a
```
