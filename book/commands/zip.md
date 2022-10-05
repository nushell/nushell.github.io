---
title: zip
version: 0.69.1
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

Zip multiple streams and get one of the results
```shell
> 1..3 | zip 4..6
```
