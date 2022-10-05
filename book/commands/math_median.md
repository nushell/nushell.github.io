---
title: math median
version: 0.69.1
math: |
  Gets the median of a list of numbers
usage: |
  Gets the median of a list of numbers
---

# <code>{{ $frontmatter.title }}</code> for math

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.math }}</div>

## Signature

```> math median ```

## Examples

Get the median of a list of numbers
```shell
> [3 8 9 12 12 15] | math median
```
