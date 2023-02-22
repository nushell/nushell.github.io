---
title: reverse
categories: |
  filters
version: 0.76.0
filters: |
  Reverses the input list or table.
usage: |
  Reverses the input list or table.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> reverse ```

## Examples

Reverse a list
```shell
> [0,1,2,3] | reverse
```

Reverse a table
```shell
> [{a: 1} {a: 2}] | reverse
```
