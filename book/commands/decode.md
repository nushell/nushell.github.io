---
title: decode
layout: command
version: 0.60.0
usage: |
  Decode bytes as a string.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> decode (encoding)```

## Parameters

 -  `encoding`: the text encoding to use

## Examples

Decode the output of an external command
```shell
> cat myfile.q | decode utf-8
```
