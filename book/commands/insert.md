---
title: insert
layout: command
version: 0.60.0
usage: |
  Insert a new column.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
