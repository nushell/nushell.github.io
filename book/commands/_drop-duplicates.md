---
title: drop-duplicates
version: 0.64.0
usage: |
  Drops duplicate values in dataframe
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> drop-duplicates (subset) --maintain --last```

## Parameters

 -  `subset`: subset of columns to drop duplicates
 -  `--maintain`: maintain order
 -  `--last`: keeps last duplicate value (by default keeps first)

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4] [1 2]] | to-df | drop-duplicates
```
