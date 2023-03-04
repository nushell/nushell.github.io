---
title: bytes index-of
categories: |
  bytes
version: 0.76.1
bytes: |
  Returns start index of first occurrence of pattern in bytes, or -1 if no match.
usage: |
  Returns start index of first occurrence of pattern in bytes, or -1 if no match.
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes index-of (pattern) ...rest --all --end```

## Parameters

 -  `pattern`: the pattern to find index of
 -  `...rest`: for a data structure input, find the indexes at the given cell paths
 -  `--all` `(-a)`: returns all matched index
 -  `--end` `(-e)`: search from the end of the binary

## Examples

Returns index of pattern in bytes
```shell
>  0x[33 44 55 10 01 13 44 55] | bytes index-of 0x[44 55]
```

Returns index of pattern, search from end
```shell
>  0x[33 44 55 10 01 13 44 55] | bytes index-of -e 0x[44 55]
```

Returns all matched index
```shell
>  0x[33 44 55 10 01 33 44 33 44] | bytes index-of -a 0x[33 44]
```

Returns all matched index, searching from end
```shell
>  0x[33 44 55 10 01 33 44 33 44] | bytes index-of -a -e 0x[33 44]
```

Returns index of pattern for specific column
```shell
>  [[ColA ColB ColC]; [0x[11 12 13] 0x[14 15 16] 0x[17 18 19]]] | bytes index-of 0x[11] ColA ColC
```
