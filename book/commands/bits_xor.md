---
title: bits xor
version: 0.67.0
usage: |
  Performs bitwise xor for integers
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> bits xor (target)```

## Parameters

 -  `target`: target integer to perform bit xor

## Examples

Apply bits xor to two numbers
```shell
> 2 | bits xor 2
```

Apply logical xor to a list of numbers
```shell
> [8 3 2] | bits xor 2
```
