---
title: dfr arg-sort
layout: command
version: 0.59.1
usage: |
  Returns indexes for a sorted series
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr arg-sort --reverse```

## Parameters

 -  `--reverse`: reverse order

## Examples

Returns indexes for a sorted series
```shell
> [1 2 2 3 3] | dfr to-df | dfr arg-sort
```

Returns indexes for a sorted series
```shell
> [1 2 2 3 3] | dfr to-df | dfr arg-sort -r
```
