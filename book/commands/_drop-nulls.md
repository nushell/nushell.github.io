---
title: drop-nulls
version: 0.69.1
usage: |
  Drops null values in dataframe
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> drop-nulls (subset)```

## Parameters

 -  `subset`: subset of columns to drop nulls

## Examples

drop null values in dataframe
```shell
> let df = ([[a b]; [1 2] [3 0] [1 2]] | into df);
    let res = ($df.b / $df.b);
    let a = ($df | with-column $res --name res);
    $a | drop-nulls
```

drop null values in dataframe
```shell
> let s = ([1 2 0 0 3 4] | into df);
    ($s / $s) | drop-nulls
```
