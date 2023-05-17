---
title: bytes starts-with
categories: |
  bytes
version: 0.80.0
bytes: |
  Check if bytes starts with a pattern.
usage: |
  Check if bytes starts with a pattern.
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes starts-with (pattern) ...rest```

## Parameters

 -  `pattern`: the pattern to match
 -  `...rest`: for a data structure input, check if bytes at the given cell paths start with the pattern

## Examples

Checks if binary starts with `0x[1F FF AA]`
```shell
> 0x[1F FF AA AA] | bytes starts-with 0x[1F FF AA]
true
```

Checks if binary starts with `0x[1F]`
```shell
> 0x[1F FF AA AA] | bytes starts-with 0x[1F]
true
```

Checks if binary starts with `0x[1F]`
```shell
> 0x[1F FF AA AA] | bytes starts-with 0x[11]
false
```
