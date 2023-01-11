---
title: select
categories: |
  filters
  lazyframe
version: 0.74.0
filters: |
  Down-select table to only these columns.
lazyframe: |
  Selects columns from lazyframe
usage: |
  Down-select table to only these columns.
  Selects columns from lazyframe
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> select ...rest --ignore-errors```

## Parameters

 -  `...rest`: the columns to select from the table
 -  `--ignore-errors`: when an error occurs, instead of erroring out, suppress the error message

## Examples

Select a column in a table
```shell
> [{a: a b: b}] | select a
```

Select a field in a record
```shell
> {a: a b: b} | select a
```

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

```> select ```

## Examples

Select a column from the dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | select a
```
