---
title: upsert
version: 0.66.1
usage: |
  Update an existing column to have a new value, or insert a new column.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> upsert (field) (replacement value)```

## Parameters

 -  `field`: the name of the column to update or insert
 -  `replacement value`: the new value to give the cell(s)

## Examples

Update a column value
```shell
> echo {'name': 'nu', 'stars': 5} | upsert name 'Nushell'
```

Insert a new column
```shell
> echo {'name': 'nu', 'stars': 5} | upsert language 'Rust'
```

Use in block form for more involved updating logic
```shell
> echo [[count fruit]; [1 'apple']] | upsert count {|f| $f.count + 1}
```

Use in block form for more involved updating logic
```shell
> echo [[project, authors]; ['nu', ['Andrés', 'JT', 'Yehuda']]] | upsert authors {|a| $a.authors | str collect ','}
```
