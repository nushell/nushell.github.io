---
title: dfr fill-nan
categories: |
  lazyframe
version: 0.76.0
lazyframe: |
  Replaces NaN values with the given expression
usage: |
  Replaces NaN values with the given expression
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> dfr fill-nan ```

## Examples

Fills the NaN values with 0
```shell
> [1 2 NaN 3 NaN] | dfr into-df | dfr fill-nan 0
```

Fills the NaN values of a whole dataframe
```shell
> [[a b]; [0.2 1] [0.1 NaN]] | dfr into-df | dfr fill-nan 0
```
