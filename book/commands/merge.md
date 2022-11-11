---
title: merge
categories: |
  filters
version: 0.71.0
filters: |
  Merge the input with a record or table, overwriting values in matching columns.
usage: |
  Merge the input with a record or table, overwriting values in matching columns.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> merge (block)```

## Parameters

 -  `block`: the new value to merge with, or a block that produces it

## Notes
```text
You may provide a column structure to merge, or a block
that generates a column structure.

When merging tables, row 0 of the input table is overwritten
with values from row 0 of the provided table, then
repeating this process with row 1, and so on.
```
## Examples

Add an 'index' column to the input table
```shell
> [a b c] | wrap name | merge { [1 2 3] | wrap index }
```

Merge two records
```shell
> {a: 1, b: 2} | merge {c: 3}
```

Merge records, overwriting overlapping values
```shell
> {a: 1, b: 3} | merge { { b: 2 } | merge { c: 4 } }
```
