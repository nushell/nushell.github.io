---
title: db group-by
layout: command
version: 0.63.0
usage: |
  Group by query
---

# `{{ $frontmatter.title }}`

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
