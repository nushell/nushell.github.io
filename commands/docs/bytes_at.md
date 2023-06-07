---
title: bytes at
categories: |
  bytes
version: 0.81.0
bytes: |
  Get bytes defined by a range
usage: |
  Get bytes defined by a range
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes at (range) ...rest```

## Parameters

 -  `range`: the range to get bytes
 -  `...rest`: for a data structure input, get bytes from data at the given cell paths

## Examples

Get a subbytes `0x[10 01]` from the bytes `0x[33 44 55 10 01 13]`
```shell
>  0x[33 44 55 10 01 13] | bytes at 3..<4
Length: 1 (0x1) bytes | printable whitespace ascii_other non_ascii
00000000:   10                                                   •

```

Get a subbytes `0x[10 01 13]` from the bytes `0x[33 44 55 10 01 13]`
```shell
>  0x[33 44 55 10 01 13] | bytes at 3..6
Length: 3 (0x3) bytes | printable whitespace ascii_other non_ascii
00000000:   10 01 13                                             •••

```

Get the remaining characters from a starting index
```shell
>  0x[33 44 55 10 01 13] | bytes at 3..
Length: 3 (0x3) bytes | printable whitespace ascii_other non_ascii
00000000:   10 01 13                                             •••

```

Get the characters from the beginning until ending index
```shell
>  0x[33 44 55 10 01 13] | bytes at ..<4
Length: 4 (0x4) bytes | printable whitespace ascii_other non_ascii
00000000:   33 44 55 10                                          3DU•

```

Or the characters from the beginning until ending index inside a table
```shell
>  [[ColA ColB ColC]; [0x[11 12 13] 0x[14 15 16] 0x[17 18 19]]] | bytes at 1.. ColB ColC
╭───┬──────────────┬──────────┬──────────╮
│ # │     ColA     │   ColB   │   ColC   │
├───┼──────────────┼──────────┼──────────┤
│ 0 │ [17, 18, 19] │ [21, 22] │ [24, 25] │
╰───┴──────────────┴──────────┴──────────╯

```
