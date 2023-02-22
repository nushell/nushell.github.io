---
title: dfr shape
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Shows column and row size for a dataframe
usage: |
  Shows column and row size for a dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr shape ```

## Examples

Shows row and column shape
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr shape
```
