---
title: insert
version: 0.69.1
filters: |
  Insert a new column.
usage: |
  Insert a new column.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> insert (field) (new value)```

## Parameters

 -  `field`: the name of the column to insert
 -  `new value`: the new value to give the cell(s)

## Examples

Insert a new value
```shell
> echo {'name': 'nu', 'stars': 5} | insert alias 'Nushell'
```
