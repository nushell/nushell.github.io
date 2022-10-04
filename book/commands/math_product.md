---
title: math product
version: 0.69.1
math: |
  Finds the product of a list of numbers or tables
usage: |
  Finds the product of a list of numbers or tables
---

# <code>{{ $frontmatter.title }}</code> for math

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.math }}</div>

## Signature

```> math product ```

## Examples

Get the product of a list of numbers
```shell
> [2 3 3 4] | math product
```
