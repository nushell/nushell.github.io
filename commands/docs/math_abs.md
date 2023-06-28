---
title: math abs
categories: |
  math
version: 0.82.1
math: |
  Returns the absolute value of a number.
usage: |
  Returns the absolute value of a number.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math abs ```

## Examples

Compute absolute value of each number in a list of numbers
```shell
> [-50 -100.0 25] | math abs
╭───┬──────────╮
│ 0 │       50 │
│ 1 │ 100.0000 │
│ 2 │       25 │
╰───┴──────────╯

```
