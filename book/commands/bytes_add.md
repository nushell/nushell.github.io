---
title: bytes add
categories: |
  bytes
version: 0.73.1
bytes: |
  Add specified bytes to the input
usage: |
  Add specified bytes to the input
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes add (data) ...rest --index --end```

## Parameters

 -  `data`: the binary to add
 -  `...rest`: for a data structure input, add bytes to the data at the given cell paths
 -  `--index {int}`: index to insert binary data
 -  `--end`: add to the end of binary

## Examples

Add bytes `0x[AA]` to `0x[1F FF AA AA]`
```shell
> 0x[1F FF AA AA] | bytes add 0x[AA]
```

Add bytes `0x[AA BB]` to `0x[1F FF AA AA]` at index 1
```shell
> 0x[1F FF AA AA] | bytes add 0x[AA BB] -i 1
```

Add bytes `0x[11]` to `0x[FF AA AA]` at the end
```shell
> 0x[FF AA AA] | bytes add 0x[11] -e
```

Add bytes `0x[11 22 33]` to `0x[FF AA AA]` at the end, at index 1(the index is start from end)
```shell
> 0x[FF AA BB] | bytes add 0x[11 22 33] -e -i 1
```
