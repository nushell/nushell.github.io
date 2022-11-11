---
title: bits not
categories: |
  bits
version: 0.71.0
bits: |
  Performs logical negation on each bit
usage: |
  Performs logical negation on each bit
---

# <code>{{ $frontmatter.title }}</code> for bits

<div class='command-title'>{{ $frontmatter.bits }}</div>

## Signature

```> bits not --signed --number-bytes```

## Parameters

 -  `--signed`: always treat input number as a signed number
 -  `--number-bytes {string}`: the size of unsigned number in bytes, it can be 1, 2, 4, 8, auto

## Examples

Apply logical negation to a list of numbers
```shell
> [4 3 2] | bits not
```

Apply logical negation to a list of numbers, treat input as 2 bytes number
```shell
> [4 3 2] | bits not -n 2
```

Apply logical negation to a list of numbers, treat input as signed number
```shell
> [4 3 2] | bits not -s
```
