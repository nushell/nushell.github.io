---
title: extern
layout: command
version: 0.60.1
usage: |
  Define a signature for an external command
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> extern (def_name) (params)```

## Parameters

 -  `def_name`: definition name
 -  `params`: parameters

## Examples

Write a signature for an external command
```shell
> extern echo [text: string]
```
