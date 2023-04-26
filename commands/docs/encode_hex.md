---
title: encode hex
categories: |
  formats
version: 0.79.0
formats: |
  Encode a binary value using hex.
usage: |
  Encode a binary value using hex.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> encode hex ...rest```

## Parameters

 -  `...rest`: For a data structure input, encode data at the given cell paths

## Examples

Encode binary data
```shell
> 0x[09 F9 11 02 9D 74 E3 5B D8 41 56 C5 63 56 88 C0] | encode hex
09F911029D74E35BD84156C5635688C0
```
