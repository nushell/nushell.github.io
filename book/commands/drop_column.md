---
title: drop column
categories: |
  filters
version: 0.70.0
filters: |
  Remove the last number of columns. If you want to remove columns by name, try 'reject'.
usage: |
  Remove the last number of columns. If you want to remove columns by name, try 'reject'.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> drop column (columns)```

## Parameters

 -  `columns`: starting from the end, the number of columns to remove

## Examples

Remove the last column of a table
```shell
> echo [[lib, extension]; [nu-lib, rs] [nu-core, rb]] | drop column
```
