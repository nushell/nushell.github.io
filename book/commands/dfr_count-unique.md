---
title: dfr count-unique
layout: command
version: 0.59.1
usage: |
  Counts unique values
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr count-unique ```

## Examples

Counts unique values
```shell
> [1 1 2 2 3 3 4] | dfr to-df | dfr count-unique
```
