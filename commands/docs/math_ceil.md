---
title: math ceil
categories: |
  math
version: 0.78.0
math: |
  Returns the ceil of a number (smallest integer greater than or equal to that number).
usage: |
  Returns the ceil of a number (smallest integer greater than or equal to that number).
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math ceil ```

## Examples

Apply the ceil function to a list of numbers
```shell
> [1.5 2.3 -3.1] | math ceil
╭───┬────╮
│ 0 │  2 │
│ 1 │  3 │
│ 2 │ -3 │
╰───┴────╯

```
