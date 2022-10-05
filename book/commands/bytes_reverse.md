---
title: bytes reverse
version: 0.69.1
bytes: |
  Reverse every bytes in the pipeline
usage: |
  Reverse every bytes in the pipeline
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes reverse ...rest```

## Parameters

 -  `...rest`: optionally matches prefix of text by column paths

## Examples

Reverse bytes `0x[1F FF AA AA]`
```shell
> 0x[1F FF AA AA] | bytes reverse
```

Reverse bytes `0x[FF AA AA]`
```shell
> 0x[FF AA AA] | bytes reverse
```
