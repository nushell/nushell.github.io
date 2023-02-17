---
title: drop-nulls
categories: |
  dataframe
version: 0.75.0
dataframe: |
  Drops null values in dataframe
usage: |
  Drops null values in dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> drop-nulls ```

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
