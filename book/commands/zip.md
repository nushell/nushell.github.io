---
title: zip
layout: command
version: 0.60.0
usage: |
  Combine a stream with the input
---

# `{{ $frontmatter.title }}`

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
