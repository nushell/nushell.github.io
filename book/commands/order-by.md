---
title: order-by
categories: |
  database
version: 0.70.0
database: |
  Orders by query
usage: |
  Orders by query
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> order-by ...select --ascending --nulls-first```

## Parameters

 -  `...select`: Select expression(s) on the table
 -  `--ascending`: Order by ascending values
 -  `--nulls-first`: Show nulls first in order

## Examples

orders query by a column
```shell
> open db.sqlite
    | from table table_a
    | select a
    | order-by a
    | describe
```

orders query by column a ascending and by column b
```shell
> open db.sqlite
    | from table table_a
    | select a
    | order-by a --ascending
    | order-by b
    | describe
```
