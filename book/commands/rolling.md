---
title: rolling
categories: |
  dataframe
version: 0.74.0
dataframe: |
  Rolling calculation for a series
usage: |
  Rolling calculation for a series
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> rolling ```

## Examples

Rolling sum for a series
```shell
> [1 2 3 4 5] | into df | rolling sum 2 | drop-nulls
```

Rolling max for a series
```shell
> [1 2 3 4 5] | into df | rolling max 2 | drop-nulls
```
