---
title: skip
version: 0.70.0
filters: |
  Skip the first n elements of the input.
usage: |
  Skip the first n elements of the input.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> skip (n)```

## Parameters

 -  `n`: the number of elements to skip

## Examples

Skip two elements
```shell
> echo [[editions]; [2015] [2018] [2021]] | skip 2
```

Skip the first value
```shell
> echo [2 4 6 8] | skip
```
