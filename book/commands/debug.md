---
title: debug
version: 0.69.1
core: |
  Debug print the value(s) piped in.
usage: |
  Debug print the value(s) piped in.
---

# <code>{{ $frontmatter.title }}</code> for core

<div class='command-title'>{{ $frontmatter.core }}</div>

## Signature

```> debug --raw```

## Parameters

 -  `--raw`: Prints the raw value representation

## Examples

Print the value of a string
```shell
> 'hello' | debug
```

Print the value of a table
```shell
> echo [[version patch]; [0.1.0 false] [0.1.1 true] [0.2.0 false]] | debug
```
