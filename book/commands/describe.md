---
title: describe
version: 0.69.1
core: |
  Describe the type and structure of the value(s) piped in.
database: |
  Describes connection and query of the DB object
dataframe: |
  Describes dataframes numeric columns
usage: |
  Describe the type and structure of the value(s) piped in.
  Describes connection and query of the DB object
  Describes dataframes numeric columns
---

# <code>{{ $frontmatter.title }}</code> for core

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.core }}</div>

## Signature

```> describe ```

## Examples

Describe the type of a string
```shell
> 'hello' | describe
```

# <code>{{ $frontmatter.title }}</code> for database

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.database }}</div>

## Signature

```> describe ```

## Examples

Describe SQLite database constructed query
```shell
> open foo.db | from table table_1 | select col_1 | describe
```

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> describe --quantiles```

## Parameters

 -  `--quantiles {table}`: optional quantiles for describe

## Examples

dataframe description
```shell
> [[a b]; [1 1] [1 1]] | into df | describe
```
