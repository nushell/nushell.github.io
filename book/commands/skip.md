---
title: skip
categories: |
  filters
version: 0.71.0
filters: |
  Skip the first several rows of the input. Counterpart of 'drop'. Opposite of 'first'.
usage: |
  Skip the first several rows of the input. Counterpart of 'drop'. Opposite of 'first'.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> skip (n)```

## Parameters

 -  `n`: the number of elements to skip

## Notes
```text
To skip specific numbered rows, try 'drop nth'. To skip specific named columns, try 'reject'.
```
## Examples

Skip two elements
```shell
> echo [[editions]; [2015] [2018] [2021]] | skip 2
```

Skip the first value
```shell
> echo [2 4 6 8] | skip
```
