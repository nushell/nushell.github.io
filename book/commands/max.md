---
title: max
version: 0.64.0
usage: |
  Creates a max expression
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> max ```

## Examples

Max aggregation for a group by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | to-df
    | group-by a
    | agg (col b | max)
```
