---
title: dfr drop-nulls
layout: command
version: 0.59.1
usage: |
  Drops null values in dataframe
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr drop-nulls (subset)`

## Parameters

- `subset`: subset of columns to drop nulls

## Examples

drop null values in dataframe

```shell
> let df = ([[a b]; [1 2] [3 0] [1 2]] | dfr to-df);
    let res = ($df.b / $df.b);
    let a = ($df | dfr with-column $res --name res);
    $a | dfr drop-nulls
```

drop null values in dataframe

```shell
> let s = ([1 2 0 0 3 4] | dfr to-df);
    ($s / $s) | dfr drop-nulls
```
