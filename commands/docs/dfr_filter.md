---
title: dfr filter
categories: |
  lazyframe
version: 0.76.0
lazyframe: |
  Filter dataframe based in expression
usage: |
  Filter dataframe based in expression
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr filter ```

## Examples

Filter dataframe using an expression
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr filter ((dfr col a) >= 4)
```
