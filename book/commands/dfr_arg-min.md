---
title: dfr arg-min
layout: command
version: 0.60.1
usage: |
  Return index for min value in series
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr arg-min `

## Examples

Returns index for min value

```shell
> [1 3 2] | dfr to-df | dfr arg-min
```
