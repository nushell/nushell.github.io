---
title: bytes remove
categories: |
  bytes
version: 0.80.0
bytes: |
  Remove bytes.
usage: |
  Remove bytes.
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes remove (pattern) ...rest --end --all```

## Parameters

 -  `pattern`: the pattern to find
 -  `...rest`: for a data structure input, remove bytes from data at the given cell paths
 -  `--end` `(-e)`: remove from end of binary
 -  `--all` `(-a)`: remove occurrences of finding binary

## Examples

Remove contents
```shell
> 0x[10 AA FF AA FF] | bytes remove 0x[10 AA]
Length: 3 (0x3) bytes | printable whitespace ascii_other non_ascii
00000000:   ff aa ff                                             ×××

```

Remove all occurrences of find binary
```shell
> 0x[10 AA 10 BB 10] | bytes remove -a 0x[10]
Length: 2 (0x2) bytes | printable whitespace ascii_other non_ascii
00000000:   aa bb                                                ××

```

Remove occurrences of find binary from end
```shell
> 0x[10 AA 10 BB CC AA 10] | bytes remove -e 0x[10]
Length: 6 (0x6) bytes | printable whitespace ascii_other non_ascii
00000000:   10 aa 10 bb  cc aa                                   •×•×××

```

Remove all occurrences of find binary in table
```shell
> [[ColA ColB ColC]; [0x[11 12 13] 0x[14 15 16] 0x[17 18 19]]] | bytes remove 0x[11] ColA ColC
╭───┬──────────┬──────────────┬──────────────╮
│ # │   ColA   │     ColB     │     ColC     │
├───┼──────────┼──────────────┼──────────────┤
│ 0 │ [18, 19] │ [20, 21, 22] │ [23, 24, 25] │
╰───┴──────────┴──────────────┴──────────────╯

```
