---
title: bits shr
categories: |
  bits
version: 0.79.0
bits: |
  Bitwise shift right for integers.
usage: |
  Bitwise shift right for integers.
---

# <code>{{ $frontmatter.title }}</code> for bits

<div class='command-title'>{{ $frontmatter.bits }}</div>

## Signature

```> bits shr (bits) --signed --number-bytes```

## Parameters

 -  `bits`: number of bits to shift right
 -  `--signed` `(-s)`: always treat input number as a signed number
 -  `--number-bytes {string}`: the word size in number of bytes, it can be 1, 2, 4, 8, auto, default value `8`

## Examples

Shift right a number with 2 bits
```shell
> 8 | bits shr 2
2
```

Shift right a list of numbers
```shell
> [15 35 2] | bits shr 2
╭───┬───╮
│ 0 │ 3 │
│ 1 │ 8 │
│ 2 │ 0 │
╰───┴───╯

```
