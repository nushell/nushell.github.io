---
title: merge
categories: |
  filters
version: 0.84.0
filters: |
  Merge the input with a record or table, overwriting values in matching columns.
usage: |
  Merge the input with a record or table, overwriting values in matching columns.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> merge (value)```

## Parameters

 -  `value`: the new value to merge with


## Input/output types:

| input  | output |
| ------ | ------ |
| record | record |
| table  | table  |
## Examples

Add an 'index' column to the input table
```shell
> [a b c] | wrap name | merge ( [1 2 3] | wrap index )
╭───┬──────╮
│ # │ name │
├───┼──────┤
│ 1 │ a    │
│ 2 │ b    │
│ 3 │ c    │
╰───┴──────╯

```

Merge two records
```shell
> {a: 1, b: 2} | merge {c: 3}
╭───┬───╮
│ a │ 1 │
│ b │ 2 │
│ c │ 3 │
╰───┴───╯
```

Merge two tables, overwriting overlapping columns
```shell
> [{columnA: A0 columnB: B0}] | merge [{columnA: 'A0*'}]
╭───┬─────────┬─────────╮
│ # │ columnA │ columnB │
├───┼─────────┼─────────┤
│ 0 │ A0*     │ B0      │
╰───┴─────────┴─────────╯

```

## Notes
You may provide a column structure to merge

When merging tables, row 0 of the input table is overwritten
with values from row 0 of the provided table, then
repeating this process with row 1, and so on.