---
title: bytes ends-with
categories: |
  bytes
version: 0.74.0
bytes: |
  Check if bytes ends with a pattern
usage: |
  Check if bytes ends with a pattern
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes ends-with (pattern) ...rest```

## Parameters

 -  `pattern`: the pattern to match
 -  `...rest`: for a data structure input, check if bytes at the given cell paths end with the pattern

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
