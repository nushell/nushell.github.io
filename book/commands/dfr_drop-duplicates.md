---
title: dfr drop-duplicates
layout: command
version: 0.60.1
usage: |
  Drops duplicate values in dataframe
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> dfr drop-duplicates (subset) --maintain --last```

## Parameters

 -  `subset`: subset of columns to drop duplicates
 -  `--maintain`: maintain order
 -  `--last`: keeps last duplicate value (by default keeps first)

## Examples

drop duplicates
```shell
> [[a b]; [1 2] [3 4] [1 2]] | dfr to-df | dfr drop-duplicates
```
