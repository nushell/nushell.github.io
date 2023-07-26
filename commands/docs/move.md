---
title: move
categories: |
  filters
version: 0.83.0
filters: |
  Move columns before or after other columns.
usage: |
  Move columns before or after other columns.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> move ...rest --after --before```

## Parameters

 -  `...rest`: the columns to move
 -  `--after {string}`: the column that will precede the columns moved
 -  `--before {string}`: the column that will be the next after the columns moved

## Examples

Move a column before the first column
```shell
> [[name value index]; [foo a 1] [bar b 2] [baz c 3]] | move index --before name
╭───┬──────┬───────╮
│ # │ name │ value │
├───┼──────┼───────┤
│ 1 │ foo  │ a     │
│ 2 │ bar  │ b     │
│ 3 │ baz  │ c     │
╰───┴──────┴───────╯

```

Move multiple columns after the last column and reorder them
```shell
> [[name value index]; [foo a 1] [bar b 2] [baz c 3]] | move value name --after index
╭───┬───────┬──────╮
│ # │ value │ name │
├───┼───────┼──────┤
│ 1 │ a     │ foo  │
│ 2 │ b     │ bar  │
│ 3 │ c     │ baz  │
╰───┴───────┴──────╯

```

Move columns of a record
```shell
> { name: foo, value: a, index: 1 } | move name --before index
╭───────┬─────╮
│ value │ a   │
│ name  │ foo │
│ index │ 1   │
╰───────┴─────╯
```
