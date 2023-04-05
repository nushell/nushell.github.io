---
title: rename
categories: |
  filters
version: 0.78.0
filters: |
  Creates a new table with columns renamed.
usage: |
  Creates a new table with columns renamed.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> rename ...rest --column```

## Parameters

 -  `...rest`: the new names for the columns
 -  `--column {list<string>}`: column name to be changed

## Examples

Rename a column
```shell
> [[a, b]; [1, 2]] | rename my_column
╭───┬───────────┬───╮
│ # │ my_column │ b │
├───┼───────────┼───┤
│ 0 │         1 │ 2 │
╰───┴───────────┴───╯

```

Rename many columns
```shell
> [[a, b, c]; [1, 2, 3]] | rename eggs ham bacon
╭───┬──────┬─────┬───────╮
│ # │ eggs │ ham │ bacon │
├───┼──────┼─────┼───────┤
│ 0 │    1 │   2 │     3 │
╰───┴──────┴─────┴───────╯

```

Rename a specific column
```shell
> [[a, b, c]; [1, 2, 3]] | rename -c [a ham]
╭───┬─────┬───┬───╮
│ # │ ham │ b │ c │
├───┼─────┼───┼───┤
│ 0 │   1 │ 2 │ 3 │
╰───┴─────┴───┴───╯

```

Rename the fields of a record
```shell
> {a: 1 b: 2} | rename x y
╭───┬───╮
│ x │ 1 │
│ y │ 2 │
╰───┴───╯
```
