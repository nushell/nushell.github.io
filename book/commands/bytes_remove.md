---
title: bytes remove
version: 0.69.1
usage: |
  Remove bytes
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> bytes remove (pattern) ...rest --end --all```

## Parameters

 -  `pattern`: the pattern to find
 -  `...rest`: optionally remove bytes by column paths
 -  `--end`: remove from end of binary
 -  `--all`: remove occurrences of finding binary

## Examples

Remove contents
```shell
> 0x[10 AA FF AA FF] | bytes remove 0x[10 AA]
```

Remove all occurrences of find binary
```shell
> 0x[10 AA 10 BB 10] | bytes remove -a 0x[10]
```

Remove occurrences of find binary from end
```shell
> 0x[10 AA 10 BB CC AA 10] | bytes remove -e 0x[10]
```

Remove all occurrences of find binary in table
```shell
> [[ColA ColB ColC]; [0x[11 12 13] 0x[14 15 16] 0x[17 18 19]]] | bytes remove 0x[11] ColA ColC
```
