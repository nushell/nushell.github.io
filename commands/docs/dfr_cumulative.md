---
title: dfr cumulative
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Cumulative calculation for a series
usage: |
  Cumulative calculation for a series
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr cumulative ```

## Examples

Cumulative sum for a series
```shell
> [1 2 3 4 5] | dfr into-df | dfr cumulative sum
```
