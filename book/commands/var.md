---
title: var
version: 0.64.0
usage: |
  Create a var expression for an aggregation
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> var ```

## Examples

Var aggregation for a group by
```shell
> [[a b]; [one 2] [one 2] [two 1] [two 1]]
    | to-df
    | group-by a
    | agg (col b | var)
```
