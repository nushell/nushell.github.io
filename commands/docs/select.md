---
title: select
categories: |
  filters
version: 0.83.0
filters: |
  Select only these columns or rows from the input. Opposite of `reject`.
usage: |
  Select only these columns or rows from the input. Opposite of `reject`.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> select ...rest --ignore-errors```

## Parameters

 -  `...rest`: the columns to select from the table
 -  `--ignore-errors` `(-i)`: ignore missing data (make all cell path members optional)

## Notes
This differs from `get` in that, rather than accessing the given value in the data structure,
it removes all non-selected values from the structure. Hence, using `select` on a table will
produce a table, a list will produce a list, and a record will produce a record.
## Examples

Select a column in a table
```shell
> [{a: a b: b}] | select a
╭───┬───╮
│ # │ a │
├───┼───┤
│ 0 │ a │
╰───┴───╯

```

Select a field in a record
```shell
> {a: a b: b} | select a
╭───┬───╮
│ a │ a │
╰───┴───╯
```

Select just the `name` column
```shell
> ls | select name

```

Select the first four rows (this is the same as `first 4`)
```shell
> ls | select 0 1 2 3

```
