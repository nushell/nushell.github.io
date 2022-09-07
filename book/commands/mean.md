---
title: mean
version: 0.68.0
usage: |
  Creates a mean expression for an aggregation
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> mean ```

## Examples

Mean aggregation for a group by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | into df
    | group-by a
    | agg (col b | mean)
```
