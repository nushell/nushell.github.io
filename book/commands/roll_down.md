---
title: roll down
version: 0.66.1
usage: |
  Roll table rows down
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> roll down --by```

## Parameters

 -  `--by {int}`: Number of rows to roll

## Examples

Rolls rows down
```shell
> [[a b]; [1 2] [3 4] [5 6]] | roll down
```
