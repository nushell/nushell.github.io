---
title: ansi strip
version: 0.69.1
usage: |
  Strip ANSI escape sequences from a string
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> ansi strip ...column path```

## Parameters

 -  `...column path`: optionally, remove ANSI sequences by column paths

## Examples

Strip ANSI escape sequences from a string
```shell
> echo [ (ansi green) (ansi cursor_on) "hello" ] | str join | ansi strip
```
