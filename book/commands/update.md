---
title: update
categories: |
  filters
version: 0.75.0
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
 -  `replacement value`: the new value to give the cell(s), or a closure to create the value

## Examples

Update a column value
```shell
> {'name': 'nu', 'stars': 5} | update name 'Nushell'
```

Use in closure form for more involved updating logic
```shell
> [[count fruit]; [1 'apple']] | update count {|row index| ($row.fruit | str length) + $index }
```

Alter each value in the 'authors' column to use a single string instead of a list
```shell
> [[project, authors]; ['nu', ['Andrés', 'JT', 'Yehuda']]] | update authors {|row| $row.authors | str join ','}
```
