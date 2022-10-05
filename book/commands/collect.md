---
title: collect
version: 0.69.1
database: |
  Collects a query from a database database connection
filters: |
  Collect the stream and pass it to a block.
lazyframe: |
  Collect lazy dataframe into eager dataframe
usage: |
  Collects a query from a database database connection
  Collect the stream and pass it to a block.
  Collect lazy dataframe into eager dataframe
---

# <code>{{ $frontmatter.title }}</code> for database

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.database }}</div>

## Signature

```> collect ```

## Examples

Collect from a select query
```shell
> open foo.db | from table table_1 db | select a | collect
```

# <code>{{ $frontmatter.title }}</code> for filters

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filters }}</div>

## Signature

```> collect (block)```

## Parameters

 -  `block`: the block to run once the stream is collected

## Examples

Use the second value in the stream
```shell
> echo 1 2 3 | collect { |x| echo $x.1 }
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> collect ```

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4]] | into lazy | collect
```
