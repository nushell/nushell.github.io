---
title: bytes length
categories: |
  bytes
version: 0.73.1
bytes: |
  Output the length of any bytes in the pipeline
usage: |
  Output the length of any bytes in the pipeline
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes length ...rest```

## Parameters

 -  `...rest`: for a data structure input, find the length of data at the given cell paths

## Examples

Return the lengths of multiple strings
```shell
> 0x[1F FF AA AB] | bytes length
```

Return the lengths of multiple strings
```shell
> [0x[1F FF AA AB] 0x[1F]] | bytes length
```
