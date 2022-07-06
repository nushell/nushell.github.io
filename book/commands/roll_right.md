---
title: roll right
version: 0.65.1
usage: |
  Roll table columns right
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> roll right --by --cells-only```

## Parameters

 -  `--by {int}`: Number of columns to roll
 -  `--cells-only`: rotates columns leaving headers fixed

## Examples

Rolls columns to the right
```shell
> [[a b c]; [1 2 3] [4 5 6]] | roll right
```

Rolls columns to the right with fixed headers
```shell
> [[a b c]; [1 2 3] [4 5 6]] | roll right --cells-only
```
