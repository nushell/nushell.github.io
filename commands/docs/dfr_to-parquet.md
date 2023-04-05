---
title: dfr to-parquet
categories: |
  dataframe
version: 0.78.0
dataframe: |
  Saves dataframe to parquet file.
usage: |
  Saves dataframe to parquet file.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr to-parquet ```

## Examples

Saves dataframe to parquet file
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr to-parquet test.parquet

```
