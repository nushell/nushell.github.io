---
title: drop
categories: |
  dataframe
  filters
version: 0.74.0
dataframe: |
  Creates a new dataframe by dropping the selected columns
filters: |
  Remove items/rows from the end of the input list/table. Counterpart of 'skip'. Opposite of 'last'.
usage: |
  Creates a new dataframe by dropping the selected columns
  Remove items/rows from the end of the input list/table. Counterpart of 'skip'. Opposite of 'last'.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> drop ```

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

 -  `rows`: The number of items to remove

## Examples

Remove the last item of a list
```shell
> [0,1,2,3] | drop
```

Remove zero item of a list
```shell
> [0,1,2,3] | drop 0
```

Remove the last two items of a list
```shell
> [0,1,2,3] | drop 2
```

Remove the last row in a table
```shell
> [[a, b]; [1, 2] [3, 4]] | drop 1
```
