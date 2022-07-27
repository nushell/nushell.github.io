---
title: bytes starts-with
version: 0.66.1
usage: |
  Check if bytes starts with a pattern
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> bytes starts-with (pattern) ...rest```

## Parameters

 -  `pattern`: the pattern to match
 -  `...rest`: optionally matches prefix of text by column paths

## Examples

Checks if binary starts with `0x[1F FF AA]`
```shell
> 0x[1F FF AA AA] | bytes starts-with 0x[1F FF AA]
```

Checks if binary starts with `0x[1F]`
```shell
> 0x[1F FF AA AA] | bytes starts-with 0x[1F]
```

Checks if binary starts with `0x[1F]`
```shell
> 0x[1F FF AA AA] | bytes starts-with 0x[11]
```
