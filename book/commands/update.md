---
title: update
version: 0.69.1
filters: |
  Update an existing column to have a new value.
usage: |
  Update an existing column to have a new value.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> update (field) (replacement value)```

## Parameters

 -  `field`: the name of the column to update
 -  `replacement value`: the new value to give the cell(s)

## Examples

Update a column value
```shell
> echo {'name': 'nu', 'stars': 5} | update name 'Nushell'
```

Use in block form for more involved updating logic
```shell
> echo [[count fruit]; [1 'apple']] | update count {|f| $f.count + 1}
```
