---
title: std
version: 0.68.0
usage: |
  Creates a std expression for an aggregation
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> std ```

## Examples

Std aggregation for a group by
```shell
> [[a b]; [one 2] [one 2] [two 1] [two 1]]
    | into df
    | group-by a
    | agg (col b | std)
```
