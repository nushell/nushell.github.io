---
title: roll left
version: 0.64.0
usage: |
  Roll table columns left
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
