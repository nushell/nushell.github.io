---
title: db order-by
layout: command
version: 0.63.0
usage: |
  Orders by query
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> db order-by ...select --ascending --nulls_first```

## Parameters

 -  `...select`: Select expression(s) on the table
 -  `--ascending`: Order by ascending values
 -  `--nulls_first`: Show nulls first in order

## Examples

orders query by a column
```shell
> db open db.mysql
    | db from table_a
    | db select a
    | db order-by a
    | db describe
```
