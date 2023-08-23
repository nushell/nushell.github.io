---
title: skip
categories: |
  filters
version: 0.84.0
filters: |
  Skip the first several rows of the input. Counterpart of `drop`. Opposite of `first`.
usage: |
  Skip the first several rows of the input. Counterpart of `drop`. Opposite of `first`.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> skip (n)```

## Parameters

 -  `n`: the number of elements to skip


## Input/output types:

| input     | output    |
| --------- | --------- |
| list\<any\> | list\<any\> |
| table     | table     |
## Examples

Skip the first value of a list
```shell
> [2 4 6 8] | skip 1
╭───┬───╮
│ 0 │ 4 │
│ 1 │ 6 │
│ 2 │ 8 │
╰───┴───╯

```

Skip two rows of a table
```shell
> [[editions]; [2015] [2018] [2021]] | skip 2
╭───┬──────────╮
│ # │ editions │
├───┼──────────┤
│ 0 │     2021 │
╰───┴──────────╯

```

## Notes
To skip specific numbered rows, try `drop nth`. To skip specific named columns, try `reject`.

## Subcommands:

| name                                         | type    | usage                                                 |
| -------------------------------------------- | ------- | ----------------------------------------------------- |
| [`skip until`](/commands/docs/skip_until.md) | Builtin | Skip elements of the input until a predicate is true. |
| [`skip while`](/commands/docs/skip_while.md) | Builtin | Skip elements of the input while a predicate is true. |