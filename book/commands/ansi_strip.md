---
title: ansi strip
categories: |
  platform
version: 0.70.0
platform: |
  Strip ANSI escape sequences from a string
usage: |
  Strip ANSI escape sequences from a string
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> ansi strip ...column path```

## Parameters

 -  `...column path`: optionally, remove ANSI sequences by column paths

## Examples

Strip ANSI escape sequences from a string
```shell
> echo [ (ansi green) (ansi cursor_on) "hello" ] | str join | ansi strip
```
