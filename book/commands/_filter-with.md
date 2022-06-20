---
title: filter-with
version: 0.64.0
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
> let mask = ([true false] | to-df);
    [[a b]; [1 2] [3 4]] | to-df | filter-with $mask
```

Filter dataframe using an expression
```shell
> [[a b]; [1 2] [3 4]] | to-df | filter-with ((col a) > 1)
```
