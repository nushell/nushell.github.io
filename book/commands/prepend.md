---
title: prepend
version: 0.70.0
filters: |
  Prepend any number of rows to a table.
usage: |
  Prepend any number of rows to a table.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> prepend (row)```

## Parameters

 -  `row`: the row, list, or table to prepend

## Examples

Prepend one Int item
```shell
> [1,2,3,4] | prepend 0
```

Prepend two Int items
```shell
> [2,3,4] | prepend [0,1]
```

Prepend Ints and Strings
```shell
> [2,nu,4,shell] | prepend [0,1,rocks]
```
