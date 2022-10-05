---
title: rename
version: 0.69.1
dataframe_or_lazyframe: |
  Rename a dataframe column
filters: |
  Creates a new table with columns renamed.
usage: |
  Rename a dataframe column
  Creates a new table with columns renamed.
---

# <code>{{ $frontmatter.title }}</code> for dataframe or lazyframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe_or_lazyframe }}</div>

## Signature

```> rename (columns) (new names)```

## Parameters

 -  `columns`: Column(s) to be renamed. A string or list of strings
 -  `new names`: New names for the selected column(s). A string or list of strings

## Examples

Renames a series
```shell
> [5 6 7 8] | into df | rename '0' new_name
```

Renames a dataframe column
```shell
> [[a b]; [1 2] [3 4]] | into df | rename a a_new
```

Renames two dataframe columns
```shell
> [[a b]; [1 2] [3 4]] | into df | rename [a b] [a_new b_new]
```

# <code>{{ $frontmatter.title }}</code> for filters

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filters }}</div>

## Signature

```> rename ...rest --column```

## Parameters

 -  `...rest`: the new names for the columns
 -  `--column {list<string>}`: column name to be changed

## Examples

Rename a column
```shell
> [[a, b]; [1, 2]] | rename my_column
```

Rename many columns
```shell
> [[a, b, c]; [1, 2, 3]] | rename eggs ham bacon
```

Rename a specific column
```shell
> [[a, b, c]; [1, 2, 3]] | rename -c [a ham]
```
