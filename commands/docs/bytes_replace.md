---
title: bytes replace
categories: |
  bytes
version: 0.76.0
bytes: |
  Find and replace binary
usage: |
  Find and replace binary
---

# <code>{{ $frontmatter.title }}</code> for bytes

<div class='command-title'>{{ $frontmatter.bytes }}</div>

## Signature

```> bytes replace (find) (replace) ...rest --all```

## Parameters

 -  `find`: the pattern to find
 -  `replace`: the replacement pattern
 -  `...rest`: for a data structure input, replace bytes in data at the given cell paths
 -  `--all` `(-a)`: replace all occurrences of find binary

## Examples

Find and replace contents
```shell
> 0x[10 AA FF AA FF] | bytes replace 0x[10 AA] 0x[FF]
```

Find and replace all occurrences of find binary
```shell
> 0x[10 AA 10 BB 10] | bytes replace -a 0x[10] 0x[A0]
```

Find and replace all occurrences of find binary in table
```shell
> [[ColA ColB ColC]; [0x[11 12 13] 0x[14 15 16] 0x[17 18 19]]] | bytes replace -a 0x[11] 0x[13] ColA ColC
```
