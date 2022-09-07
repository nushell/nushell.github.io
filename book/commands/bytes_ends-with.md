---
title: bytes ends-with
version: 0.68.0
usage: |
  Check if bytes ends with a pattern
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> bytes ends-with (pattern) ...rest```

## Parameters

 -  `pattern`: the pattern to match
 -  `...rest`: optionally matches prefix of text by column paths

## Examples

Checks if binary ends with `0x[AA]`
```shell
> 0x[1F FF AA AA] | bytes ends-with 0x[AA]
```

Checks if binary ends with `0x[FF AA AA]`
```shell
> 0x[1F FF AA AA] | bytes ends-with 0x[FF AA AA]
```

Checks if binary ends with `0x[11]`
```shell
> 0x[1F FF AA AA] | bytes ends-with 0x[11]
```
