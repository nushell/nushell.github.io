---
title: bits or
version: 0.67.0
usage: |
  Performs bitwise or for integers
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
