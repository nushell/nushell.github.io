---
title: bits shr
categories: |
  bits
version: 0.106.0
bits: |
  Bitwise shift right for ints or binary values.
usage: |
  Bitwise shift right for ints or binary values.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `bits shr` for [bits](/commands/categories/bits.md)

<div class='command-title'>Bitwise shift right for ints or binary values.</div>

## Signature

```> bits shr {flags} (bits)```

## Flags

 -  `--signed, -s`: always treat input number as a signed number
 -  `--number-bytes, -n {int}`: the word size in number of bytes, it can be 1, 2, 4, 8, auto, default value `8`

## Parameters

 -  `bits`: Number of bits to shift right.


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| int          | int          |
| binary       | binary       |
| list&lt;int&gt;    | list&lt;int&gt;    |
| list&lt;binary&gt; | list&lt;binary&gt; |
## Examples

Shift right a number with 2 bits
```nu
> 8 | bits shr 2
2
```

Shift right a list of numbers
```nu
> [15 35 2] | bits shr 2
╭───┬───╮
│ 0 │ 3 │
│ 1 │ 8 │
│ 2 │ 0 │
╰───┴───╯

```

Shift right a binary value
```nu
> 0x[4f f4] | bits shr 4
Length: 2 (0x2) bytes | printable whitespace ascii_other non_ascii
00000000:   04 ff                                                •×

```
