---
title: into nu
categories: |
  dataframe
  db-expression
  expression
version: 0.70.0
dataframe: |
  Converts a section of the dataframe into nushell Table
db_expression: |
  Convert a db expression into a nu value for access and exploration
expression: |
  Convert expression into a nu value for access and exploration
usage: |
  Converts a section of the dataframe into nushell Table
  Convert a db expression into a nu value for access and exploration
  Convert expression into a nu value for access and exploration
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> into nu --rows --tail```

## Parameters

 -  `--rows {number}`: number of rows to be shown
 -  `--tail`: shows tail rows

## Examples

Shows head rows from dataframe
```shell
> [[a b]; [1 2] [3 4]] | into df | into nu
```

Shows tail rows from dataframe
```shell
> [[a b]; [1 2] [5 6] [3 4]] | into df | into nu -t -n 1
```

# <code>{{ $frontmatter.title }}</code> for db-expression

<div class='command-title'>{{ $frontmatter.db_expression }}</div>

## Signature

```> into nu ```

## Examples

Convert a col expression into a nushell value
```shell
> field name_1 | into nu
```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> into nu ```

## Examples

Convert a col expression into a nushell value
```shell
> col a | into nu
```
