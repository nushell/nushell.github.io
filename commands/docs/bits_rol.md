---
title: bits rol
categories: |
  bits
version: 0.106.0
bits: |
  Bitwise rotate left for ints or binary values.
usage: |
  Bitwise rotate left for ints or binary values.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `bits rol` for [bits](/commands/categories/bits.md)

<div class='command-title'>Bitwise rotate left for ints or binary values.</div>

## Signature

```> bits rol {flags} (bits)```

## Flags

 -  `--signed, -s`: always treat input number as a signed number
 -  `--number-bytes, -n {int}`: the word size in number of bytes, it can be 1, 2, 4, 8, auto, default value `8`

## Parameters

 -  `bits`: Number of bits to rotate left.


## Input/output types:

| input        | output       |
| ------------ | ------------ |
| int          | int          |
| binary       | binary       |
| list&lt;int&gt;    | list&lt;int&gt;    |
| list&lt;binary&gt; | list&lt;binary&gt; |
## Examples

Rotate left a number with 2 bits
```nu
> 17 | bits rol 2
68
```

Rotate left a list of numbers with 2 bits
```nu
> [5 3 2] | bits rol 2
╭───┬────╮
│ 0 │ 20 │
│ 1 │ 12 │
│ 2 │  8 │
╰───┴────╯

```

rotate left binary data
```nu
> 0x[c0 ff ee] | bits rol 10
Length: 3 (0x3) bytes | printable whitespace ascii_other non_ascii
00000000:   ff bb 03                                             ××•

```
