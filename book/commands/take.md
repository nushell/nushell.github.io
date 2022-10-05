---
title: take
version: 0.69.1
dataframe: |
  Creates new dataframe using the given indices
filters: |
  Take only the first n elements.
usage: |
  Creates new dataframe using the given indices
  Take only the first n elements.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> take (indices)```

## Parameters

 -  `indices`: list of indices used to take data

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
> [1 2 3] | take
```

Return the first 2 items of a list/table
```shell
> [1 2 3] | take 2
```
