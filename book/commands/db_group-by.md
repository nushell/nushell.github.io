---
title: db group-by
version: 0.64.0
usage: |
  Group by query
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db group-by ...select```

## Parameters

 -  `...select`: Select expression(s) on the table

## Examples

orders query by a column
```shell
> db open db.mysql
    | db from table_a
    | db select a
    | db group-by a
    | db describe
```
