---
title: median
version: 0.67.0
usage: |
  Creates a median expression for an aggregation
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> median ```

## Examples

Median aggregation for a group by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | into df
    | group-by a
    | agg (col b | median)
```
