---
title: export extern
layout: command
version: 0.60.1
usage: |
  Define an extern and export it from a module
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> export extern (def_name) (params)`

## Parameters

- `def_name`: definition name
- `params`: parameters

## Examples

Export the signature for an external command

```shell
> export extern echo [text: string]
```
