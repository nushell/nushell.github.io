---
title: math mode
categories: |
  math
version: 0.71.0
math: |
  Gets the most frequent element(s) from a list of numbers or tables
usage: |
  Gets the most frequent element(s) from a list of numbers or tables
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math mode ```

## Examples

Get the mode(s) of a list of numbers
```shell
> [3 3 9 12 12 15] | math mode
```
