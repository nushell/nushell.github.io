---
title: roll up
version: 0.65.1
usage: |
  Roll table rows up
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> roll up --by```

## Parameters

 -  `--by {int}`: Number of rows to roll

## Examples

Rolls rows up
```shell
> [[a b]; [1 2] [3 4] [5 6]] | roll up
```
