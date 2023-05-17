---
title: math floor
categories: |
  math
version: 0.80.0
math: |
  Returns the floor of a number (largest integer less than or equal to that number).
usage: |
  Returns the floor of a number (largest integer less than or equal to that number).
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math floor ```

## Examples

Apply the floor function to a list of numbers
```shell
> [1.5 2.3 -3.1] | math floor
╭───┬────╮
│ 0 │  1 │
│ 1 │  2 │
│ 2 │ -4 │
╰───┴────╯

```
