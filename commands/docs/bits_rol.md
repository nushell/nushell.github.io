---
title: bits rol
categories: |
  bits
version: 0.77.0
bits: |
  Bitwise rotate left for integers.
usage: |
  Bitwise rotate left for integers.
---

# <code>{{ $frontmatter.title }}</code> for bits

<div class='command-title'>{{ $frontmatter.bits }}</div>

## Signature

```> bits rol (bits) --signed --number-bytes```

## Parameters

 -  `bits`: number of bits to rotate left
 -  `--signed` `(-s)`: always treat input number as a signed number
 -  `--number-bytes {string}`: the word size in number of bytes, it can be 1, 2, 4, 8, auto, default value `8`

## Examples

Rotate left a number with 2 bits
```shell
> 17 | bits rol 2
68
```

Rotate left a list of numbers with 2 bits
```shell
> [5 3 2] | bits rol 2
╭───┬────╮
│ 0 │ 20 │
│ 1 │ 12 │
│ 2 │  8 │
╰───┴────╯

```
