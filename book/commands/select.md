---
title: select
version: 0.69.1
database: |
  Creates a select statement for a DB
filters: |
  Down-select table to only these columns.
lazyframe: |
  Selects columns from lazyframe
usage: |
  Creates a select statement for a DB
  Down-select table to only these columns.
  Selects columns from lazyframe
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> select ...select```

## Parameters

 -  `...select`: Select expression(s) on the table

## Examples

selects a column from a database
```shell
> open db.sqlite | into db | select a | describe
```

selects columns from a database using alias
```shell
> open db.sqlite
    | into db
    | select (field a | as new_a) b c
    | from table table_1
    | describe
```

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> select ...rest --ignore-errors```

## Parameters

 -  `...rest`: the columns to select from the table
 -  `--ignore-errors`: when a column has empty cells, instead of erroring out, replace them with nothing

## Examples

Select just the name column
```shell
> ls | select name
```

Select the name and size columns
```shell
> ls | select name size
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> select ...select expressions```

## Parameters

 -  `...select expressions`: Expression(s) that define the column selection

## Examples

Select a column from the dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | select a
```
