---
title: nu-highlight
layout: command
version: 0.60.1
usage: |
  Syntax highlight the input string.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> nu-highlight `

## Examples

Describe the type of a string

```shell
> 'let x = 3' | nu-highlight
```
