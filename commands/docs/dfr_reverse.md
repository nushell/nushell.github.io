---
title: dfr reverse
categories: |
  lazyframe
version: 0.76.0
lazyframe: |
  Reverses the LazyFrame
usage: |
  Reverses the LazyFrame
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr reverse ```

## Examples

Reverses the dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr reverse
```
