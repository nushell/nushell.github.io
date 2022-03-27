---
title: export alias
layout: command
version: 0.60.1
usage: |
  Define an alias and export it from a module
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> export alias (name) (initial_value)`

## Parameters

- `name`: name of the alias
- `initial_value`: equals sign followed by value

## Examples

export an alias of ll to ls -l, from a module

```shell
> export alias ll = ls -l
```
