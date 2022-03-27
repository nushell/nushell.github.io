---
title: math eval
layout: command
version: 0.60.0
usage: |
  Evaluate a math expression into a number
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> math eval (math expression)`

## Parameters

- `math expression`: the math expression to evaluate

## Examples

Evaluate math in the pipeline

```shell
> '10 / 4' | math eval
```
