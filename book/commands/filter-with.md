---
title: filter-with
version: 0.70.0
dataframe_or_lazyframe: |
  Filters dataframe using a mask or expression as reference
usage: |
  Filters dataframe using a mask or expression as reference
---

# <code>{{ $frontmatter.title }}</code> for dataframe or lazyframe

<div class='command-title'>{{ $frontmatter.dataframe_or_lazyframe }}</div>

## Signature

```> filter-with (mask or expression)```

## Parameters

 -  `mask or expression`: boolean mask used to filter data

## Examples

Filter dataframe using a bool mask
```shell
> let mask = ([true false] | into df);
    [[a b]; [1 2] [3 4]] | into df | filter-with $mask
```

Filter dataframe using an expression
```shell
> [[a b]; [1 2] [3 4]] | into df | filter-with ((col a) > 1)
```
