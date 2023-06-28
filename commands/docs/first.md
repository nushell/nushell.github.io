---
title: first
categories: |
  filters
version: 0.82.1
filters: |
  Return only the first several rows of the input. Counterpart of `last`. Opposite of `skip`.
usage: |
  Return only the first several rows of the input. Counterpart of `last`. Opposite of `skip`.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> first (rows)```

## Parameters

 -  `rows`: starting from the front, the number of rows to return

## Examples

Return the first item of a list/table
```shell
> [1 2 3] | first
1
```

Return the first 2 items of a list/table
```shell
> [1 2 3] | first 2
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
╰───┴───╯

```

Return the first 2 bytes of a binary value
```shell
> 0x[01 23 45] | first 2
Length: 2 (0x2) bytes | printable whitespace ascii_other non_ascii
00000000:   01 23                                                •#

```
