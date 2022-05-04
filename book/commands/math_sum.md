---
title: math sum
layout: command
version: 0.62.0
usage: |
  Finds the sum of a list of numbers or tables
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> math sum ```

## Examples

Sum a list of numbers
```shell
> [1 2 3] | math sum
```

Get the disk usage for the current directory
```shell
> ls | get size | math sum
```
