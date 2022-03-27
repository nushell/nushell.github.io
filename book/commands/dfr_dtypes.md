---
title: dfr dtypes
layout: command
version: 0.59.1
usage: |
  Show dataframe data types
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr dtypes `

## Examples

Dataframe dtypes

```shell
> [[a b]; [1 2] [3 4]] | dfr to-df | dfr dtypes
```
