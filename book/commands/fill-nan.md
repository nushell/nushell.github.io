---
title: fill-nan
categories: |
  lazyframe
version: 0.73.1
lazyframe: |
  Replaces NaN values with the given expression
usage: |
  Replaces NaN values with the given expression
---

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> fill-nan ```

## Examples

Fills the NaN values with 0
```shell
> [1 2 NaN 3 NaN] | into df | fill-nan 0
```

Fills the NaN values of a whole dataframe
```shell
> [[a b]; [0.2 1] [0.1 NaN]] | into df | fill-nan 0
```
