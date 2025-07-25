---
title: flatten
categories: |
  filters
version: 0.106.0
filters: |
  Flatten the table.
usage: |
  Flatten the table.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `flatten` for [filters](/commands/categories/filters.md)

<div class='command-title'>Flatten the table.</div>

## Signature

```> flatten {flags} ...rest```

## Flags

 -  `--all, -a`: flatten inner table one level out

## Parameters

 -  `...rest`: Optionally flatten data by column.


## Input/output types:

| input     | output    |
| --------- | --------- |
| list&lt;any&gt; | list&lt;any&gt; |
| record    | table     |
## Examples

flatten a table
```nu
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
```nu
> [[N, u, s, h, e, l, l]] | flatten | first

```

flatten a column having a nested table
```nu
> [[origin, people]; [Ecuador, ([[name, meal]; ['Andres', 'arepa']])]] | flatten --all | get meal

```

restrict the flattening by passing column names
```nu
> [[origin, crate, versions]; [World, ([[name]; ['nu-cli']]), ['0.21', '0.22']]] | flatten versions --all | last | get versions

```

Flatten inner table
```nu
> { a: b, d: [ 1 2 3 4 ], e: [ 4 3 ] } | flatten d --all
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
