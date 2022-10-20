---
title: math sum
version: 0.70.0
math: |
  Finds the sum of a list of numbers or tables
usage: |
  Finds the sum of a list of numbers or tables
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

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
