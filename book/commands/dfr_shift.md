---
title: dfr shift
layout: command
version: 0.59.1
usage: |
  Shifts the values by a given period
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

`> dfr shift (period)`

## Parameters

- `period`: shift period

## Examples

Shifts the values by a given period

```shell
> [1 2 2 3 3] | dfr to-df | dfr shift 2 | dfr drop-nulls
```
