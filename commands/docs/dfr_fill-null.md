---
title: dfr fill-null
categories: |
  lazyframe
version: 0.76.0
lazyframe: |
  Replaces NULL values with the given expression
usage: |
  Replaces NULL values with the given expression
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr fill-null ```

## Examples

Fills the null values by 0
```shell
> [1 2 2 3 3] | dfr into-df | dfr shift 2 | dfr fill-null 0
```
