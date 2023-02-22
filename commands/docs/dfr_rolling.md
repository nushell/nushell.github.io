---
title: dfr rolling
categories: |
  dataframe
version: 0.76.0
dataframe: |
  Rolling calculation for a series
usage: |
  Rolling calculation for a series
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr rolling ```

## Examples

Rolling sum for a series
```shell
> [1 2 3 4 5] | dfr into-df | dfr rolling sum 2 | dfr drop-nulls
```

Rolling max for a series
```shell
> [1 2 3 4 5] | dfr into-df | dfr rolling max 2 | dfr drop-nulls
```
