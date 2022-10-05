---
title: roll down
version: 0.69.1
filters: |
  Roll table rows down
usage: |
  Roll table rows down
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> roll down --by```

## Parameters

 -  `--by {int}`: Number of rows to roll

## Examples

Rolls rows down
```shell
> [[a b]; [1 2] [3 4] [5 6]] | roll down
```
