---
title: into nu
version: 0.69.1
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

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

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

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.db_expression }}</div>

## Signature

```> into nu ```

## Examples

Convert a col expression into a nushell value
```shell
> field name_1 | into nu
```

# <code>{{ $frontmatter.title }}</code> for expression

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.expression }}</div>

## Signature

```> into nu ```

## Examples

Convert a col expression into a nushell value
```shell
> col a | into nu
```
