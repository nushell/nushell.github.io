---
title: math mode
version: 0.69.1
math: |
  Gets the most frequent element(s) from a list of numbers or tables
usage: |
  Gets the most frequent element(s) from a list of numbers or tables
---

# <code>{{ $frontmatter.title }}</code> for math

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.math }}</div>

## Signature

```> math mode ```

## Examples

Get the mode(s) of a list of numbers
```shell
> [3 3 9 12 12 15] | math mode
```
