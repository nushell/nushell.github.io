---
title: as
version: 0.70.0
database: |
  Creates an alias for a column selection
db_expression: |
  Creates an alias for a column selection
expression: |
  Creates an alias expression
usage: |
  Creates an alias for a column selection
  Creates an alias for a column selection
  Creates an alias expression
---

# <code>{{ $frontmatter.title }}</code> for database

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> as (alias)```

## Parameters

 -  `alias`: alias name

## Examples

Creates an alias for a selected table
```shell
> open db.sqlite
    | from table table_1
    | select a
    | as t1
    | describe
```

Creates an alias for a derived table
```shell
> open db.sqlite
    | from table (
        open db.sqlite
        | from table table_a
        | select a b
      )
    | select a
    | as t1
    | describe
```

# <code>{{ $frontmatter.title }}</code> for db-expression

<div class='command-title'>{{ $frontmatter.db_expression }}</div>

## Signature

```> as (alias)```

## Parameters

 -  `alias`: alias name

## Examples

Creates an alias for a column selection
```shell
> field name_a | as new_a | into nu
```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> as (Alias name)```

## Parameters

 -  `Alias name`: Alias name for the expression

## Examples

Creates and alias expression
```shell
> col a | as new_a | into nu
```
