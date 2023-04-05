---
title: bits shl
categories: |
  bits
version: 0.78.0
bits: |
  Bitwise shift left for integers.
usage: |
  Bitwise shift left for integers.
---

# <code>{{ $frontmatter.title }}</code> for bits

<div class='command-title'>{{ $frontmatter.bits }}</div>

## Signature

```> bits shl (bits) --signed --number-bytes```

## Parameters

 -  `bits`: number of bits to shift left
 -  `--signed` `(-s)`: always treat input number as a signed number
 -  `--number-bytes {string}`: the word size in number of bytes, it can be 1, 2, 4, 8, auto, default value `8`

## Examples

Shift left a number by 7 bits
```shell
> 2 | bits shl 7
256
```

Shift left a number with 1 byte by 7 bits
```shell
> 2 | bits shl 7 -n '1'
0
```

Shift left a signed number by 1 bit
```shell
> 0x7F | bits shl 1 -s
254
```

Shift left a list of numbers
```shell
> [5 3 2] | bits shl 2
╭───┬────╮
│ 0 │ 20 │
│ 1 │ 12 │
│ 2 │  8 │
╰───┴────╯

```
