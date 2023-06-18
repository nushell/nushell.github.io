---
title: flatten
categories: |
  filters
version: 0.81.0
filters: |
  Flatten the table.
usage: |
  Flatten the table.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> flatten ...rest --all```

## Parameters

 -  `...rest`: optionally flatten data by column
 -  `--all` `(-a)`: flatten inner table one level out

## Examples

flatten a table
```shell
> [[N, u, s, h, e, l, l]] | flatten
╭───┬───╮
│ 0 │ N │
│ 1 │ u │
│ 2 │ s │
│ 3 │ h │
│ 4 │ e │
│ 5 │ l │
│ 6 │ l │
╰───┴───╯

```

flatten a table, get the first item
```shell
> [[N, u, s, h, e, l, l]] | flatten | first

```

flatten a column having a nested table
```shell
> [[origin, people]; [Ecuador, ([[name, meal]; ['Andres', 'arepa']])]] | flatten --all | get meal

```

restrict the flattening by passing column names
```shell
> [[origin, crate, versions]; [World, ([[name]; ['nu-cli']]), ['0.21', '0.22']]] | flatten versions --all | last | get versions

```

Flatten inner table
```shell
> { a: b, d: [ 1 2 3 4 ],  e: [ 4 3  ] } | flatten d --all
╭───┬───┬───┬───────────╮
│ # │ a │ d │     e     │
├───┼───┼───┼───────────┤
│ 0 │ b │ 1 │ ╭───┬───╮ │
│   │   │   │ │ 0 │ 4 │ │
│   │   │   │ │ 1 │ 3 │ │
│   │   │   │ ╰───┴───╯ │
│ 1 │ b │ 2 │ ╭───┬───╮ │
│   │   │   │ │ 0 │ 4 │ │
│   │   │   │ │ 1 │ 3 │ │
│   │   │   │ ╰───┴───╯ │
│ 2 │ b │ 3 │ ╭───┬───╮ │
│   │   │   │ │ 0 │ 4 │ │
│   │   │   │ │ 1 │ 3 │ │
│   │   │   │ ╰───┴───╯ │
│ 3 │ b │ 4 │ ╭───┬───╮ │
│   │   │   │ │ 0 │ 4 │ │
│   │   │   │ │ 1 │ 3 │ │
│   │   │   │ ╰───┴───╯ │
╰───┴───┴───┴───────────╯

```
