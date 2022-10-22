---
title: last
categories: |
  dataframe
  expression
  filters
version: 0.70.0
dataframe: |
  Creates new dataframe with tail rows or creates a last expression
expression: |
  creates a last expression
filters: |
  Show only the last number of rows.
usage: |
  Creates new dataframe with tail rows or creates a last expression
  creates a last expression
  Show only the last number of rows.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> last (rows)```

## Parameters

 -  `rows`: Number of rows for tail

## Examples

Create new dataframe with last rows
```shell
> [[a b]; [1 2] [3 4]] | into df | last 1
```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> last ```

## Examples

Creates a last expression from a column
```shell
> col a | last
```

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> last (rows)```

## Parameters

 -  `rows`: starting from the back, the number of rows to return

## Examples

Get the last 2 items
```shell
> [1,2,3] | last 2
```

Get the last item
```shell
> [1,2,3] | last
```
