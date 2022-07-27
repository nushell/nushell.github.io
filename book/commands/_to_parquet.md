---
title: to parquet
version: 0.66.1
usage: |
  Saves dataframe to parquet file
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> to parquet (file)```

## Parameters

 -  `file`: file path to save dataframe

## Examples

Saves dataframe to parquet file
```shell
> [[a b]; [1 2] [3 4]] | into df | to parquet test.parquet
```
