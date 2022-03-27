---
title: dfr to-parquet
layout: command
version: 0.60.1
usage: |
  Saves dataframe to parquet file
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr to-parquet (file)`

## Parameters

- `file`: file path to save dataframe

## Examples

Saves dataframe to csv file

```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr to-parquet test.parquet
```
