---
title: columns
categories: |
  dataframe
  filters
version: 0.73.1
dataframe: |
  Show dataframe columns
filters: |
  Given a record or table, produce a list of its columns' names.
usage: |
  Show dataframe columns
  Given a record or table, produce a list of its columns' names.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> columns ```

## Examples

Dataframe columns
```shell
> [[a b]; [1 2] [3 4]] | into df | columns
```

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> columns ```

## Notes
```text
This is a counterpart to `values`, which produces a list of columns' values.
```
## Examples

Get the columns from the record
```shell
> { acronym:PWD, meaning:'Print Working Directory' } | columns
```

Get the columns from the table
```shell
> [[name,age,grade]; [bill,20,a]] | columns
```

Get the first column from the table
```shell
> [[name,age,grade]; [bill,20,a]] | columns | first
```

Get the second column from the table
```shell
> [[name,age,grade]; [bill,20,a]] | columns | select 1
```
