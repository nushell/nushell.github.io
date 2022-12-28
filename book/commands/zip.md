---
title: zip
categories: |
  filters
version: 0.73.1
filters: |
  Combine a stream with the input
usage: |
  Combine a stream with the input
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> zip (other)```

## Parameters

 -  `other`: the other input

## Examples

Zip two lists
```shell
> [1 2] | zip [3 4]
```

Zip two streams
```shell
> 1..3 | zip 4..6
```
