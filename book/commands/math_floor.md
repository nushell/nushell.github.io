---
title: math floor
version: 0.69.1
math: |
  Applies the floor function to a list of numbers
usage: |
  Applies the floor function to a list of numbers
---

# <code>{{ $frontmatter.title }}</code> for math

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.math }}</div>

## Signature

```> math floor ```

## Examples

Apply the floor function to a list of numbers
```shell
> [1.5 2.3 -3.1] | math floor
```
