---
title: roll right
categories: |
  filters
version: 0.76.0
filters: |
  Roll table columns right
usage: |
  Roll table columns right
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> roll right --by --cells-only```

## Parameters

 -  `--by {int}`: Number of columns to roll
 -  `--cells-only` `(-c)`: rotates columns leaving headers fixed

## Examples

Rolls columns of a record to the right
```shell
> {a:1 b:2 c:3} | roll right
```

Rolls columns to the right
```shell
> [[a b c]; [1 2 3] [4 5 6]] | roll right
```

Rolls columns to the right with fixed headers
```shell
> [[a b c]; [1 2 3] [4 5 6]] | roll right --cells-only
```
