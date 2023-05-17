---
title: group-by
categories: |
  default
version: 0.80.0
default: |
  Splits a list or table into groups, and returns a record containing those groups.
usage: |
  Splits a list or table into groups, and returns a record containing those groups.
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> group-by (grouper)```

## Parameters

 -  `grouper`: the grouper value to use

## Examples

Group items by the "type" column's values
```shell
> ls | group-by type

```

You can also group by raw values by leaving out the argument
```shell
> ['1' '3' '1' '3' '2' '1' '1'] | group-by
╭───┬───────────╮
│   │ ╭───┬───╮ │
│ 1 │ │ 0 │ 1 │ │
│   │ │ 1 │ 1 │ │
│   │ │ 2 │ 1 │ │
│   │ │ 3 │ 1 │ │
│   │ ╰───┴───╯ │
│   │ ╭───┬───╮ │
│ 3 │ │ 0 │ 3 │ │
│   │ │ 1 │ 3 │ │
│   │ ╰───┴───╯ │
│   │ ╭───┬───╮ │
│ 2 │ │ 0 │ 2 │ │
│   │ ╰───┴───╯ │
╰───┴───────────╯
```
