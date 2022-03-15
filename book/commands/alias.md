---
title: alias
layout: command
version: 0.59.1
usage: |
  Alias a command (with optional flags) to a new name
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> alias (name) (initial_value)```

## Parameters

 -  `name`: name of the alias
 -  `initial_value`: equals sign followed by value

## Examples

Alias ll to ls -l
```shell
> alias ll = ls -l
```
