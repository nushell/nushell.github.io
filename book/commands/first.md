---
title: first
categories: |
  dataframe
  expression
  filters
version: 0.71.0
dataframe: |
  Show only the first number of rows.
expression: |
  creates a first expression
filters: |
  Return only the first several rows of the input. Counterpart of 'last'. Opposite of 'skip'.
usage: |
  Show only the first number of rows.
  creates a first expression
  Return only the first several rows of the input. Counterpart of 'last'. Opposite of 'skip'.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> first (rows)```

## Parameters

 -  `rows`: starting from the front, the number of rows to return

## Examples

Return the first row of a dataframe
```shell
> [[a b]; [1 2] [3 4]] | into df | first
```

Return the first two rows of a dataframe
```shell
> [[a b]; [1 2] [3 4]] | into df | first 2
```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> first ```

## Examples

Creates a first expression from a column
```shell
> col a | first
```

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> first (rows)```

## Parameters

 -  `rows`: starting from the front, the number of rows to return

## Examples

Return the first item of a list/table
```shell
> [1 2 3] | first
```

Return the first 2 items of a list/table
```shell
> [1 2 3] | first 2
```

Return the first 2 items of a bytes
```shell
> 0x[01 23 45] | first 2
```
