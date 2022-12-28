---
title: take
categories: |
  dataframe
  filters
version: 0.73.1
dataframe: |
  Creates new dataframe using the given indices
filters: |
  Take only the first n elements of a list, or the first n bytes of a binary value.
usage: |
  Creates new dataframe using the given indices
  Take only the first n elements of a list, or the first n bytes of a binary value.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> take ```

## Examples

Takes selected rows from dataframe
```shell
> let df = ([[a b]; [4 1] [5 2] [4 3]] | into df);
    let indices = ([0 2] | into df);
    $df | take $indices
```

Takes selected rows from series
```shell
> let series = ([4 1 5 2 4 3] | into df);
    let indices = ([0 2] | into df);
    $series | take $indices
```

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> take (n)```

## Parameters

 -  `n`: starting from the front, the number of elements to return

## Examples

Return the first item of a list/table
```shell
> [1 2 3] | take 1
```

Return the first 2 items of a list/table
```shell
> [1 2 3] | take 2
```

Return the first two rows of a table
```shell
> [[editions]; [2015] [2018] [2021]] | take 2
```

Return the first 2 bytes of a binary value
```shell
> 0x[01 23 45] | take 2
```

Return the first 3 elements of a range
```shell
> 1..10 | take 3
```
