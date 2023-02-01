---
title: math max
categories: |
  math
version: 0.75.0
math: |
  Returns the maximum of a list of numbers, or of columns in a table
usage: |
  Returns the maximum of a list of numbers, or of columns in a table
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math max ```

## Examples

Find the maximum of list of numbers
```shell
> [-50 100 25] | math max
```

Find the maxima of the columns of a table
```shell
> [{a: 1 b: 3} {a: 2 b: -1}] | math max
```
