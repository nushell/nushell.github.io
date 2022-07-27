---
title: zip
version: 0.66.1
usage: |
  Combine a stream with the input
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> zip (other)```

## Parameters

 -  `other`: the other input

## Examples

Zip multiple streams and get one of the results
```shell
> 1..3 | zip 4..6
```
