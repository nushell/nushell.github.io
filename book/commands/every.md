---
title: every
version: 0.69.1
filters: |
  Show (or skip) every n-th row, starting from the first one.
usage: |
  Show (or skip) every n-th row, starting from the first one.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.filters }}</div>

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
