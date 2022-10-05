---
title: bits shl
version: 0.69.1
bits: |
  Bitwise shift left for integers
usage: |
  Bitwise shift left for integers
---

# <code>{{ $frontmatter.title }}</code> for bits

<div class='command-title'>{{ $frontmatter.bits }}</div>

## Signature

```> bits shl (bits) --signed --number-bytes```

## Parameters

 -  `bits`: number of bits to shift left
 -  `--signed`: always treat input number as a signed number
 -  `--number-bytes {string}`: the word size in number of bytes, it can be 1, 2, 4, 8, auto, default value `8`

## Examples

Shift left a number by 7 bits
```shell
> 2 | bits shl 7
```

Shift left a number with 1 byte by 7 bits
```shell
> 2 | bits shl 7 -n 1
```

Shift left a signed number by 1 bit
```shell
> 0x7F | bits shl 1 -s
```

Shift left a list of numbers
```shell
> [5 3 2] | bits shl 2
```
