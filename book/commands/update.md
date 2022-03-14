---
title: update
layout: command
version: 0.59.1
usage: |
  Update an existing column to have a new value, or create a new column.
---

# `{{ $frontmatter.title }}`

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

## Signature

```> update (field) (replacement value)```

## Parameters

 -  `field`: the name of the column to update or create
 -  `replacement value`: the new value to give the cell(s)

## Examples

Update a column value
```shell
> echo {'name': 'nu', 'stars': 5} | update name 'Nushell'
```

Add a new column
```shell
> echo {'name': 'nu', 'stars': 5} | update language 'Rust'
```

Use in block form for more involved updating logic
```shell
> echo [[count fruit]; [1 'apple']] | update count {|f| $f.count + 1}
```

Use in block form for more involved updating logic
```shell
> echo [[project, authors]; ['nu', ['Andrés', 'JT', 'Yehuda']]] | update authors {|a| $a.authors | str collect ','}
```
