---
title: ansi strip
layout: command
version: 0.60.0
usage: |
  strip ansi escape sequences from string
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> ansi strip ...column path`

## Parameters

- `...column path`: optionally, remove ansi sequences by column paths

## Examples

strip ansi escape sequences from string

```shell
> echo [ (ansi green) (ansi cursor_on) "hello" ] | str collect | ansi strip
```
