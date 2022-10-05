---
title: cumulative
version: 0.69.1
dataframe: |
  Cumulative calculation for a series
usage: |
  Cumulative calculation for a series
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.dataframe }}</div>

## Signature

```> cumulative (type) --reverse```

## Parameters

 -  `type`: rolling operation
 -  `--reverse`: Reverse cumulative calculation

## Examples

Cumulative sum for a series
```shell
> [1 2 3 4 5] | into df | cumulative sum
```
