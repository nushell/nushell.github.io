---
title: roll left
categories: |
  filters
version: 0.70.0
filters: |
  Roll table columns left
usage: |
  Roll table columns left
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> roll left --by --cells-only```

## Parameters

 -  `--by {int}`: Number of columns to roll
 -  `--cells-only`: rotates columns leaving headers fixed

## Examples

Rolls columns to the left
```shell
> [[a b c]; [1 2 3] [4 5 6]] | roll left
```

Rolls columns to the left with fixed headers
```shell
> [[a b c]; [1 2 3] [4 5 6]] | roll left --cells-only
```
