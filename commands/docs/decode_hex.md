---
title: decode hex
categories: |
  formats
version: 0.78.0
formats: |
  Hex decode a value.
usage: |
  Hex decode a value.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> decode hex ...rest```

## Parameters

 -  `...rest`: For a data structure input, decode data at the given cell paths

## Examples

Hex decode a value and output as binary
```shell
> '0102030A0a0B' | decode hex
Length: 6 (0x6) bytes | printable whitespace ascii_other non_ascii
00000000:   01 02 03 0a  0a 0b                                   •••__•

```

Whitespaces are allowed to be between hex digits
```shell
> '01 02  03 0A 0a 0B' | decode hex
Length: 6 (0x6) bytes | printable whitespace ascii_other non_ascii
00000000:   01 02 03 0a  0a 0b                                   •••__•

```
