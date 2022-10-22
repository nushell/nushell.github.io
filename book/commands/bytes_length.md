---
title: bytes length
categories: |
  bytes
version: 0.70.0
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

 -  `...rest`: optionally find length of binary by column paths

## Examples

Return the lengths of multiple strings
```shell
> 0x[1F FF AA AB] | bytes length
```

Return the lengths of multiple strings
```shell
> [0x[1F FF AA AB] 0x[1F]] | bytes length
```
