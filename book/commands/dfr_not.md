---
title: dfr not
layout: command
version: 0.59.1
usage: |
  Inverts boolean mask
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr not ```

## Examples

Inverts boolean mask
```shell
> [true false true] | dfr to-df | dfr not
```
