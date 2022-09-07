---
title: bytes reverse
version: 0.68.0
usage: |
  Reverse every bytes in the pipeline
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
