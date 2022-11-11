---
title: collect
categories: |
  database
  filters
  lazyframe
version: 0.71.0
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

<div class='command-title'>{{ $frontmatter.database }}</div>

## Signature

```> collect ```

## Examples

Collect from a select query
```shell
> open foo.db | from table table_1 db | select a | collect
```

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> collect (block) --keep-env```

## Parameters

 -  `block`: the block to run once the stream is collected
 -  `--keep-env`: let the block affect environment variables

## Examples

Use the second value in the stream
```shell
> echo 1 2 3 | collect { |x| echo $x.1 }
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> collect ```

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4]] | into lazy | collect
```
