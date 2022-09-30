---
title: bytes build
version: 0.69.1
usage: |
  Create bytes from the arguments.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> bytes build ...rest```

## Parameters

 -  `...rest`: list of bytes

## Examples

Builds binary data from 0x[01 02], 0x[03], 0x[04]
```shell
> bytes build 0x[01 02] 0x[03] 0x[04]
```
