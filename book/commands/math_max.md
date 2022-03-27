---
title: math max
layout: command
version: 0.60.0
usage: |
  Finds the maximum within a list of numbers or tables
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> math max `

## Examples

Find the maximum of list of numbers

```shell
> [-50 100 25] | math max
```
