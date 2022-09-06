---
title: bits rol
version: 0.67.1
usage: |
  Bitwise rotate left for integers
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> bits rol (bits) --signed --number-bytes```

## Parameters

 -  `bits`: number of bits to rotate left
 -  `--signed`: always treat input number as a signed number
 -  `--number-bytes {string}`: the word size in number of bytes, it can be 1, 2, 4, 8, auto, default value `8`

## Examples

Rotate left a number with 2 bits
```shell
> 17 | bits rol 2
```

Rotate left a list of numbers with 2 bits
```shell
> [5 3 2] | bits rol 2
```
