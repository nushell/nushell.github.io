---
title: select
categories: |
  filters
version: 0.76.0
filters: |
  Down-select table to only these columns.
usage: |
  Down-select table to only these columns.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> select ...rest --ignore-errors```

## Parameters

 -  `...rest`: the columns to select from the table
 -  `--ignore-errors` `(-i)`: when an error occurs, instead of erroring out, suppress the error message

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
