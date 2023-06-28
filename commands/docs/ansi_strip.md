---
title: ansi strip
categories: |
  platform
version: 0.82.1
platform: |
  Strip ANSI escape sequences from a string.
usage: |
  Strip ANSI escape sequences from a string.
---

# <code>{{ $frontmatter.title }}</code> for platform

<div class='command-title'>{{ $frontmatter.platform }}</div>

## Signature

```> ansi strip ...rest```

## Parameters

 -  `...rest`: for a data structure input, remove ANSI sequences from strings at the given cell paths

## Examples

Strip ANSI escape sequences from a string
```shell
> $'(ansi green)(ansi cursor_on)hello' | ansi strip
hello
```
