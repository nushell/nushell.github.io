---
title: dfr arg-sort
layout: command
version: 0.63.0
usage: |
  Returns indexes for a sorted series
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr arg-sort --reverse --nulls-last```

## Parameters

 -  `--reverse`: reverse order
 -  `--nulls-last`: nulls ordered last

## Examples

Returns indexes for a sorted series
```shell
> [1 2 2 3 3] | dfr to-df | dfr arg-sort
```

Returns indexes for a sorted series
```shell
> [1 2 2 3 3] | dfr to-df | dfr arg-sort -r
```
