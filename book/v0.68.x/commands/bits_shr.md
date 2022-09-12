---
title: bits shr
version: 0.68.0
usage: |
  Bitwise shift right for integers
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> bits shr (bits) --signed --number-bytes```

## Parameters

 -  `bits`: number of bits to shift right
 -  `--signed`: always treat input number as a signed number
 -  `--number-bytes {string}`: the word size in number of bytes, it can be 1, 2, 4, 8, auto, default value `8`

## Examples

Shift right a number with 2 bits
```shell
> 8 | bits shr 2
```

Shift right a list of numbers
```shell
> [15 35 2] | bits shr 2
```
