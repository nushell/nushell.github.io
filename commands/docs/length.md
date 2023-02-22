---
title: length
categories: |
  filters
version: 0.76.0
filters: |
  Count the number of elements in the input.
usage: |
  Count the number of elements in the input.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> length --column```

## Parameters

 -  `--column`: Show the number of columns in a table

## Examples

Count the number of items in a list
```shell
> [1 2 3 4 5] | length
```

Count the number of columns in a table
```shell
> [{columnA: A0 columnB: B0}] | length -c
```
