---
title: columns
version: 0.69.1
dataframe: |
  Show dataframe columns
filters: |
  Show the columns in the input.
usage: |
  Show dataframe columns
  Show the columns in the input.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> columns ```

## Examples

Dataframe columns
```shell
> [[a b]; [1 2] [3 4]] | into df | columns
```

# <code>{{ $frontmatter.title }}</code> for filters

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filters }}</div>

## Signature

```> columns ```

## Examples

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
