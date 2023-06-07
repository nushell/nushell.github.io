---
title: compact
categories: |
  filters
version: 0.81.0
filters: |
  Creates a table with non-empty rows.
usage: |
  Creates a table with non-empty rows.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> compact ...rest```

## Parameters

 -  `...rest`: the columns to compact from the table

## Examples

Filter out all records where 'Hello' is null (returns nothing)
```shell
> [["Hello" "World"]; [null 3]] | compact Hello
╭────────────╮
│ empty list │
╰────────────╯
```

Filter out all records where 'World' is null (Returns the table)
```shell
> [["Hello" "World"]; [null 3]] | compact World
╭───┬───────┬───────╮
│ # │ Hello │ World │
├───┼───────┼───────┤
│ 0 │       │     3 │
╰───┴───────┴───────╯

```

Filter out all instances of nothing from a list (Returns [1,2])
```shell
> [1, null, 2] | compact
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
╰───┴───╯

```
