---
title: dfr cumulative
layout: command
version: 0.59.1
usage: |
  Cumulative calculation for a series
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr cumulative (type) --reverse`

## Parameters

- `type`: rolling operation
- `--reverse`: Reverse cumulative calculation

## Examples

Cumulative sum for a series

```shell
> [1 2 3 4 5] | dfr to-df | dfr cumulative sum
```
