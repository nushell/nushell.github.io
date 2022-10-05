---
title: where
version: 0.69.1
database: |
  Includes a where statement for a query
filters: |
  Filter values based on a condition.
usage: |
  Includes a where statement for a query
  Filter values based on a condition.
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> where (where)```

## Parameters

 -  `where`: Where expression on the table

## Examples

selects a column from a database with a where clause
```shell
> open db.sqlite
    | from table table_1
    | select a
    | where ((field a) > 1)
    | describe
```

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> where (cond) --block```

## Parameters

 -  `cond`: condition
 -  `--block {block}`: use where with a block or variable instead

## Examples

List all files in the current directory with sizes greater than 2kb
```shell
> ls | where size > 2kb
```

List only the files in the current directory
```shell
> ls | where type == file
```

List all files with names that contain "Car"
```shell
> ls | where name =~ "Car"
```

List all files that were modified in the last two weeks
```shell
> ls | where modified >= (date now) - 2wk
```

Get all numbers above 3 with an existing block condition
```shell
> let a = {$in > 3}; [1, 2, 5, 6] | where -b $a
```
