---
title: debug
categories: |
  debug
version: 0.79.0
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
hello
```

Debug print a list
```shell
> ['hello'] | debug
╭───┬───────╮
│ 0 │ hello │
╰───┴───────╯

```

Debug print a table
```shell
> [[version patch]; ['0.1.0' false] ['0.1.1' true] ['0.2.0' false]] | debug
╭───┬────────────────────────────────╮
│ 0 │ {version: 0.1.0, patch: false} │
│ 1 │ {version: 0.1.1, patch: true}  │
│ 2 │ {version: 0.2.0, patch: false} │
╰───┴────────────────────────────────╯

```
