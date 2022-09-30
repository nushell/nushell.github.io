---
title: bits and
version: 0.69.1
usage: |
  Performs bitwise and for integers
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> bits and (target)```

## Parameters

 -  `target`: target integer to perform bit and

## Examples

Apply bits and to two numbers
```shell
> 2 | bits and 2
```

Apply logical and to a list of numbers
```shell
> [4 3 2] | bits and 2
```
