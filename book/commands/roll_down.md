---
title: roll down
layout: command
version: 0.60.0
usage: |
  Roll table rows down
---

# `{{ $frontmatter.title }}`

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
