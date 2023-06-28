---
title: items
categories: |
  filters
version: 0.82.1
filters: |
  Given a record, iterate on each pair of column name and associated value.
usage: |
  Given a record, iterate on each pair of column name and associated value.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> items (closure)```

## Parameters

 -  `closure`: the closure to run

## Notes
This is a the fusion of `columns`, `values` and `each`.
## Examples

Iterate over each key-value pair of a record
```shell
> { new: york, san: francisco } | items {|key, value| echo $'($key) ($value)' }
╭───┬───────────────╮
│ 0 │ new york      │
│ 1 │ san francisco │
╰───┴───────────────╯

```
