---
title: dfr count-null
layout: command
version: 0.60.1
usage: |
  Counts null values
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr count-null `

## Examples

Counts null values

```shell
> let s = ([1 1 0 0 3 3 4] | dfr to-df);
    ($s / $s) | dfr count-null
```
