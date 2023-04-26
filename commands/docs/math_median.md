---
title: math median
categories: |
  math
version: 0.79.0
math: |
  Computes the median of a list of numbers.
usage: |
  Computes the median of a list of numbers.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math median ```

## Examples

Compute the median of a list of numbers
```shell
> [3 8 9 12 12 15] | math median
10.5
```

Compute the medians of the columns of a table
```shell
> [{a: 1 b: 3} {a: 2 b: -1} {a: -3 b: 5}] | math median
╭───┬───╮
│ a │ 1 │
│ b │ 3 │
╰───┴───╯
```
