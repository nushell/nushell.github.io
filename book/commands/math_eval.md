---
title: math eval
categories: |
  math
version: 0.71.0
math: |
  Evaluate a math expression into a number
usage: |
  Evaluate a math expression into a number
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math eval (math expression)```

## Parameters

 -  `math expression`: the math expression to evaluate

## Examples

Evaluate math in the pipeline
```shell
> '10 / 4' | math eval
```
