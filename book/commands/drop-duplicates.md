---
title: drop-duplicates
version: 0.69.1
dataframe: |
  Drops duplicate values in dataframe
usage: |
  Drops duplicate values in dataframe
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> drop-duplicates (subset) --maintain --last```

## Parameters

 -  `subset`: subset of columns to drop duplicates
 -  `--maintain`: maintain order
 -  `--last`: keeps last duplicate value (by default keeps first)

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4] [1 2]] | into df | drop-duplicates
```
