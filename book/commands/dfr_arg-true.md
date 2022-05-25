---
title: dfr arg-true
layout: command
version: 0.63.0
usage: |
  Returns indexes where values are true
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr arg-true ```

## Examples

Returns indexes where values are true
```shell
> [false true false] | dfr to-df | dfr arg-true
```
