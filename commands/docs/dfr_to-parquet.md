---
title: dfr to-parquet
categories: |
  dataframe
version: 0.84.0
dataframe: |
  Saves dataframe to parquet file.
usage: |
  Saves dataframe to parquet file.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr to-parquet (file)```

## Parameters

 -  `file`: file path to save dataframe


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Saves dataframe to parquet file
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr to-parquet test.parquet

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag