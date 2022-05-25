---
title: debug
layout: command
version: 0.63.0
usage: |
  Debug print the value(s) piped in.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
