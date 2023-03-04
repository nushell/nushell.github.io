---
title: math min
categories: |
  math
version: 0.76.1
math: |
  Finds the minimum within a list of numbers or tables.
usage: |
  Finds the minimum within a list of numbers or tables.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math min ```

## Examples

Compute the minimum of a list of numbers
```shell
> [-50 100 25] | math min
```

Compute the minima of the columns of a table
```shell
> [{a: 1 b: 3} {a: 2 b: -1}] | math min
```
