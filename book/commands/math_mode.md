---
title: math mode
categories: |
  math
version: 0.74.0
math: |
  Returns the most frequent element(s) from a list of numbers or tables
usage: |
  Returns the most frequent element(s) from a list of numbers or tables
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math mode ```

## Examples

Compute the mode(s) of a list of numbers
```shell
> [3 3 9 12 12 15] | math mode
```

Compute the mode(s) of the columns of a table
```shell
> [{a: 1 b: 3} {a: 2 b: -1} {a: 1 b: 5}] | math mode
```
