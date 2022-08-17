---
title: join
version: 0.67.0
usage: |
  Joins with another table or derived table. Default join type is inner
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> join (table) (on) --as --left --right --outer --cross```

## Parameters

 -  `table`: table or derived table to join on
 -  `on`: expression to join tables
 -  `--as {string}`: Alias for the selected join
 -  `--left`: left outer join
 -  `--right`: right outer join
 -  `--outer`: full outer join
 -  `--cross`: cross join

## Examples

joins two tables on col_b
```shell
> open db.sqlite
    | from table table_1 --as t1
    | join table_2 col_b --as t2
    | select col_a
    | describe
```

joins a table with a derived table using aliases
```shell
> open db.sqlite
    | from table table_1 --as t1
    | join (
        open db.sqlite
        | from table table_2
        | select col_c
      ) ((field t1.col_a) == (field t2.col_c)) --as t2 --right
    | select col_a
    | describe
```
