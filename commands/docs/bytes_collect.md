---
title: bytes collect
categories: |
  bytes
version: 0.83.0
bytes: |
  Concatenate multiple binary into a single binary, with an optional separator between each.
usage: |
  Concatenate multiple binary into a single binary, with an optional separator between each.
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes collect (separator)```

## Parameters

 -  `separator`: optional separator to use when creating binary

## Examples

Create a byte array from input
```shell
> [0x[11] 0x[13 15]] | bytes collect
Length: 3 (0x3) bytes | printable whitespace ascii_other non_ascii
00000000:   11 13 15                                             •••

```

Create a byte array from input with a separator
```shell
> [0x[11] 0x[33] 0x[44]] | bytes collect 0x[01]
Length: 5 (0x5) bytes | printable whitespace ascii_other non_ascii
00000000:   11 01 33 01  44                                      ••3•D

```
