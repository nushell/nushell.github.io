---
title: math eval
version: 0.69.1
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
