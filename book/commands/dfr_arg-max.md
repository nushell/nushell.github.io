---
title: dfr arg-max
layout: command
version: 0.60.1
usage: |
  Return index for max value in series
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr arg-max `

## Examples

Returns index for max value

```shell
> [1 3 2] | dfr to-df | dfr arg-max
```
