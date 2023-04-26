---
title: math pi
categories: |
  math
version: 0.79.0
math: |
  Returns the mathematical constant π.
usage: |
  Returns the mathematical constant π.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math pi ```

## Examples

Get the first two decimal digits of π
```shell
> math pi | math round --precision 2
3.14
```
