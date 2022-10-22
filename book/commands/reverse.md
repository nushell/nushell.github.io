---
title: reverse
categories: |
  filters
  lazyframe
version: 0.70.0
filters: |
  Reverses the table.
lazyframe: |
  Reverses the LazyFrame
usage: |
  Reverses the table.
  Reverses the LazyFrame
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> reverse ```

## Examples

Reverse the items
```shell
> [0,1,2,3] | reverse
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> reverse ```

## Examples

Reverses the dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | into df | reverse
```
