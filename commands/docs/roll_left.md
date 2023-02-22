---
title: roll left
categories: |
  filters
version: 0.76.0
filters: |
  Roll record or table columns left
usage: |
  Roll record or table columns left
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> roll left --by --cells-only```

## Parameters

 -  `--by {int}`: Number of columns to roll
 -  `--cells-only`: rotates columns leaving headers fixed

## Examples

Rolls columns of a record to the left
```shell
> {a:1 b:2 c:3} | roll left
```

Rolls columns of a table to the left
```shell
> [[a b c]; [1 2 3] [4 5 6]] | roll left
```

Rolls columns to the left without changing column names
```shell
> [[a b c]; [1 2 3] [4 5 6]] | roll left --cells-only
```
