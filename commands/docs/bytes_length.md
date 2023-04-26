---
title: bytes length
categories: |
  bytes
version: 0.79.0
bytes: |
  Output the length of any bytes in the pipeline.
usage: |
  Output the length of any bytes in the pipeline.
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes length ...rest```

## Parameters

 -  `...rest`: for a data structure input, find the length of data at the given cell paths

## Examples

Return the length of a binary
```shell
> 0x[1F FF AA AB] | bytes length
4
```

Return the lengths of multiple binaries
```shell
> [0x[1F FF AA AB] 0x[1F]] | bytes length
╭───┬───╮
│ 0 │ 4 │
│ 1 │ 1 │
╰───┴───╯

```
