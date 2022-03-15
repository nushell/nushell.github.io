---
title: dfr unique
layout: command
version: 0.59.1
usage: |
  Returns unique values from a series
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr unique ```

## Examples

Returns unique values from a series
```shell
> [2 2 2 2 2] | dfr to-df | dfr unique
```
