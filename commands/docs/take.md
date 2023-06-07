---
title: take
categories: |
  filters
version: 0.81.0
filters: |
  Take only the first n elements of a list, or the first n bytes of a binary value.
usage: |
  Take only the first n elements of a list, or the first n bytes of a binary value.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> take (n)```

## Parameters

 -  `n`: starting from the front, the number of elements to return

## Examples

Return the first item of a list/table
```shell
> [1 2 3] | take 1
╭───┬───╮
│ 0 │ 1 │
╰───┴───╯

```

Return the first 2 items of a list/table
```shell
> [1 2 3] | take 2
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
╰───┴───╯

```

Return the first two rows of a table
```shell
> [[editions]; [2015] [2018] [2021]] | take 2
╭───┬──────────╮
│ # │ editions │
├───┼──────────┤
│ 0 │     2015 │
│ 1 │     2018 │
╰───┴──────────╯

```

Return the first 2 bytes of a binary value
```shell
> 0x[01 23 45] | take 2
Length: 2 (0x2) bytes | printable whitespace ascii_other non_ascii
00000000:   01 23                                                •#

```

Return the first 3 elements of a range
```shell
> 1..10 | take 3
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 3 │
╰───┴───╯

```
