---
title: math abs
version: 0.70.0
math: |
  Returns absolute values of a list of numbers
usage: |
  Returns absolute values of a list of numbers
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math abs ```

## Examples

Get absolute of each value in a list of numbers
```shell
> [-50 -100.0 25] | math abs
```
