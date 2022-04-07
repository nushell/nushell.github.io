---
title: dfr arg-unique
layout: command
version: 0.60.1
usage: |
  Returns indexes for unique values
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr arg-unique ```

## Examples

Returns indexes for unique values
```shell
> [1 2 2 3 3] | dfr to-df | dfr arg-unique
```
