---
title: dfr shape
layout: command
version: 0.62.0
usage: |
  Shows column and row size for a dataframe
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr shape ```

## Examples

Shows row and column shape
```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr shape
```
