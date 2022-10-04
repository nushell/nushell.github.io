---
title: bits xor
version: 0.69.1
bits: |
  Performs bitwise xor for integers
usage: |
  Performs bitwise xor for integers
---

# <code>{{ $frontmatter.title }}</code> for bits

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.bits }}</div>

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
