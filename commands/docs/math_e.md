---
title: math e
categories: |
  math
version: 0.83.0
math: |
  Returns the mathematical constant e (exp(1)/'1 | math exp').
usage: |
  Returns the mathematical constant e (exp(1)/'1 | math exp').
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math e ```

## Examples

Get the first three decimal digits of e
```shell
> math e | math round --precision 3
2.718
```
