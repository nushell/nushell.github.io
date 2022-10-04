---
title: bits or
version: 0.69.1
bits: |
  Performs bitwise or for integers
usage: |
  Performs bitwise or for integers
---

# <code>{{ $frontmatter.title }}</code> for bits

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.bits }}</div>

## Signature

```> bits or (target)```

## Parameters

 -  `target`: target integer to perform bit or

## Examples

Apply bits or to two numbers
```shell
> 2 | bits or 6
```

Apply logical or to a list of numbers
```shell
> [8 3 2] | bits or 2
```
