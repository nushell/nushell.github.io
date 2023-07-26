---
title: math product
categories: |
  math
version: 0.83.0
math: |
  Returns the product of a list of numbers or the products of each column of a table.
usage: |
  Returns the product of a list of numbers or the products of each column of a table.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math product ```

## Examples

Compute the product of a list of numbers
```shell
> [2 3 3 4] | math product
72
```
