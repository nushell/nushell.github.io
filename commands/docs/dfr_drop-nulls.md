---
title: dfr drop-nulls
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Drops null values in dataframe
usage: |
  Drops null values in dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr drop-nulls ```

## Examples

drop null values in dataframe
```shell
> let df = ([[a b]; [1 2] [3 0] [1 2]] | dfr into-df);
    let res = ($df.b / $df.b);
    let a = ($df | dfr with-column $res --name res);
    $a | dfr drop-nulls
```

drop null values in dataframe
```shell
> let s = ([1 2 0 0 3 4] | dfr into-df);
    ($s / $s) | dfr drop-nulls
```
