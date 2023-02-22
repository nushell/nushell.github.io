---
title: dfr dtypes
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Show dataframe data types
usage: |
  Show dataframe data types
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr dtypes ```

## Examples

Dataframe dtypes
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr dtypes
```
