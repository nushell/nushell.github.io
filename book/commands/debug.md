---
title: debug
categories: |
  core
version: 0.73.1
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

Debug print a string
```shell
> 'hello' | debug
```

Debug print a list
```shell
> ['hello'] | debug
```

Debug print a table
```shell
> [[version patch]; [0.1.0 false] [0.1.1 true] [0.2.0 false]] | debug
```
