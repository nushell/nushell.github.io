---
title: filter-with
version: 0.65.1
usage: |
  Filters dataframe using a mask or expression as reference
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
