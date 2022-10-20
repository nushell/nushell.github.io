---
title: drop
version: 0.70.0
dataframe: |
  Creates a new dataframe by dropping the selected columns
filters: |
  Remove the last number of rows or columns.
usage: |
  Creates a new dataframe by dropping the selected columns
  Remove the last number of rows or columns.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> drop ...rest```

## Parameters

 -  `...rest`: column names to be dropped

## Examples

drop column a
```shell
> [[a b]; [1 2] [3 4]] | into df | drop a
```

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> drop (rows)```

## Parameters

 -  `rows`: starting from the back, the number of rows to remove

## Examples

Remove the last item of a list/table
```shell
> [0,1,2,3] | drop
```

Remove zero item of a list/table
```shell
> [0,1,2,3] | drop 0
```

Remove the last two items of a list/table
```shell
> [0,1,2,3] | drop 2
```
