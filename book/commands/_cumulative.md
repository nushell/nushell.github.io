---
title: cumulative
version: 0.67.0
usage: |
  Cumulative calculation for a series
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
