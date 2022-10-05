---
title: math min
version: 0.69.1
math: |
  Finds the minimum within a list of numbers or tables
usage: |
  Finds the minimum within a list of numbers or tables
---

# <code>{{ $frontmatter.title }}</code> for math

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.math }}</div>

## Signature

```> math min ```

## Examples

Get the minimum of a list of numbers
```shell
> [-50 100 25] | math min
```
