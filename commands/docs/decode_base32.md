---
title: decode base32
categories: |
  formats
version: 0.106.0
formats: |
  Decode a Base32 value.
usage: |
  Decode a Base32 value.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `decode base32` for [formats](/commands/categories/formats.md)

<div class='command-title'>Decode a Base32 value.</div>

## Signature

```> decode base32 {flags} ```

## Flags

 -  `--nopad`: Do not pad the output.


## Input/output types:

| input  | output |
| ------ | ------ |
| string | binary |
## Examples

Decode arbitrary binary data
```nu
> "AEBAGBAF" | decode base32
Length: 5 (0x5) bytes | printable whitespace ascii_other non_ascii
00000000:   01 02 03 04  05                                      •••••

```

Decode an encoded string
```nu
> "NBUQ====" | decode base32 | decode

```

Parse a string without padding
```nu
> "NBUQ" | decode base32 --nopad
Length: 2 (0x2) bytes | printable whitespace ascii_other non_ascii
00000000:   68 69                                                hi

```

## Notes
The default alphabet is taken from RFC 4648, section 6.

Note this command will collect stream input.