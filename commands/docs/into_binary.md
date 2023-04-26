---
title: into binary
categories: |
  conversions
version: 0.79.0
conversions: |
  Convert value to a binary primitive.
usage: |
  Convert value to a binary primitive.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into binary ...rest```

## Parameters

 -  `...rest`: for a data structure input, convert data at the given cell paths

## Examples

convert string to a nushell binary primitive
```shell
> 'This is a string that is exactly 52 characters long.' | into binary
Length: 52 (0x34) bytes | printable whitespace ascii_other non_ascii
00000000:   54 68 69 73  20 69 73 20  61 20 73 74  72 69 6e 67   This is a string
00000010:   20 74 68 61  74 20 69 73  20 65 78 61  63 74 6c 79    that is exactly
00000020:   20 35 32 20  63 68 61 72  61 63 74 65  72 73 20 6c    52 characters l
00000030:   6f 6e 67 2e                                          ong.

```

convert a number to a nushell binary primitive
```shell
> 1 | into binary
Length: 8 (0x8) bytes | printable whitespace ascii_other non_ascii
00000000:   01 00 00 00  00 00 00 00                             •0000000

```

convert a boolean to a nushell binary primitive
```shell
> true | into binary
Length: 8 (0x8) bytes | printable whitespace ascii_other non_ascii
00000000:   01 00 00 00  00 00 00 00                             •0000000

```

convert a filesize to a nushell binary primitive
```shell
> ls | where name == LICENSE | get size | into binary

```

convert a filepath to a nushell binary primitive
```shell
> ls | where name == LICENSE | get name | path expand | into binary

```

convert a decimal to a nushell binary primitive
```shell
> 1.234 | into binary
Length: 8 (0x8) bytes | printable whitespace ascii_other non_ascii
00000000:   58 39 b4 c8  76 be f3 3f                             X9××v××?

```
