---
title: debug
categories: |
  debug
version: 0.76.1
debug: |
  Debug print the value(s) piped in.
usage: |
  Debug print the value(s) piped in.
---

# <code>{{ $frontmatter.title }}</code> for debug

<div class='command-title'>{{ $frontmatter.debug }}</div>

## Signature

```> debug --raw```

## Parameters

 -  `--raw` `(-r)`: Prints the raw value representation

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
