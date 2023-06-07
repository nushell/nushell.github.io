---
title: group-by
categories: |
  default
version: 0.81.0
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

 -  `grouper`: the path to the column to group on

## Examples

Group items by the "type" column's values
```shell
> ls | group-by type

```

Group items by the "foo" column's values, ignoring records without a "foo" column
```shell
> open cool.json | group-by foo?

```

Group using a block which is evaluated against each input value
```shell
> [foo.txt bar.csv baz.txt] | group-by { path parse | get extension }
╭─────┬─────────────────╮
│     │ ╭───┬─────────╮ │
│ txt │ │ 0 │ foo.txt │ │
│     │ │ 1 │ baz.txt │ │
│     │ ╰───┴─────────╯ │
│     │ ╭───┬─────────╮ │
│ csv │ │ 0 │ bar.csv │ │
│     │ ╰───┴─────────╯ │
╰─────┴─────────────────╯
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
