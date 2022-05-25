---
title: dfr shift
layout: command
version: 0.63.0
usage: |
  Shifts the values by a given period
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr shift (period) --fill```

## Parameters

 -  `period`: shift period
 -  `--fill {any}`: Expression to use to fill the null values (lazy df)

## Examples

Shifts the values by a given period
```shell
> [1 2 2 3 3] | dfr to-df | dfr shift 2 | dfr drop-nulls
```
