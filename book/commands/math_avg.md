---
title: math avg
version: 0.69.1
math: |
  Finds the average of a list of numbers or tables
usage: |
  Finds the average of a list of numbers or tables
---

# <code>{{ $frontmatter.title }}</code> for math

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.math }}</div>

## Signature

```> math avg ```

## Examples

Get the average of a list of numbers
```shell
> [-50 100.0 25] | math avg
```
