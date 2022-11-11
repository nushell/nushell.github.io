---
title: bits ror
categories: |
  bits
version: 0.71.0
bits: |
  Bitwise rotate right for integers
usage: |
  Bitwise rotate right for integers
---

# <code>{{ $frontmatter.title }}</code> for bits

<div class='command-title'>{{ $frontmatter.bits }}</div>

## Signature

```> bits ror (bits) --signed --number-bytes```

## Parameters

 -  `bits`: number of bits to rotate right
 -  `--signed`: always treat input number as a signed number
 -  `--number-bytes {string}`: the word size in number of bytes, it can be 1, 2, 4, 8, auto, default value `8`

## Examples

Rotate right a number with 60 bits
```shell
> 17 | bits ror 60
```

Rotate right a list of numbers of one byte
```shell
> [15 33 92] | bits ror 2 -n 1
```
