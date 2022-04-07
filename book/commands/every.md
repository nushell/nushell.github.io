---
title: every
layout: command
version: 0.60.1
usage: |
  Show (or skip) every n-th row, starting from the first one.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> every (stride) --skip```

## Parameters

 -  `stride`: how many rows to skip between (and including) each row returned
 -  `--skip`: skip the rows that would be returned, instead of selecting them

## Examples

Get every second row
```shell
> [1 2 3 4 5] | every 2
```

Skip every second row
```shell
> [1 2 3 4 5] | every 2 --skip
```
