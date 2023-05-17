---
title: dfr rename
categories: |
  dataframe or lazyframe
version: 0.80.0
dataframe_or_lazyframe: |
  Rename a dataframe column.
usage: |
  Rename a dataframe column.
---

# <code>{{ $frontmatter.title }}</code> for dataframe or lazyframe

<div class='command-title'>{{ $frontmatter.dataframe_or_lazyframe }}</div>

## Signature

```> dfr rename (columns) (new names)```

## Parameters

 -  `columns`: Column(s) to be renamed. A string or list of strings
 -  `new names`: New names for the selected column(s). A string or list of strings

## Examples

Renames a series
```shell
> [5 6 7 8] | dfr into-df | dfr rename '0' new_name
╭───┬──────────╮
│ # │ new_name │
├───┼──────────┤
│ 0 │        5 │
│ 1 │        6 │
│ 2 │        7 │
│ 3 │        8 │
╰───┴──────────╯

```

Renames a dataframe column
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr rename a a_new
╭───┬───────┬───╮
│ # │ a_new │ b │
├───┼───────┼───┤
│ 0 │     1 │ 2 │
│ 1 │     3 │ 4 │
╰───┴───────┴───╯

```

Renames two dataframe columns
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr rename [a b] [a_new b_new]
╭───┬───────┬───────╮
│ # │ a_new │ b_new │
├───┼───────┼───────┤
│ 0 │     1 │     2 │
│ 1 │     3 │     4 │
╰───┴───────┴───────╯

```
