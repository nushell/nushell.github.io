---
title: window
version: 0.69.1
filters: |
  Creates a sliding window of `window_size` that slide by n rows/elements across input.
usage: |
  Creates a sliding window of `window_size` that slide by n rows/elements across input.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> window (window_size) --stride```

## Parameters

 -  `window_size`: the size of each window
 -  `--stride {int}`: the number of rows to slide over between windows

## Examples

A sliding window of two elements
```shell
> echo [1 2 3 4] | window 2
```

A sliding window of two elements, with a stride of 3
```shell
> [1, 2, 3, 4, 5, 6, 7, 8] | window 2 --stride 3
```
