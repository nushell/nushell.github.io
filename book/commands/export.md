---
title: export
layout: command
version: 0.60.0
usage: |
  Export custom commands or environment variables from a module.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> export `

## Examples

Export a definition from a module

```shell
> module utils { export def my-command [] { "hello" } }; use utils my-command; my-command
```
