---
title: values
categories: |
  filters
version: 0.84.0
filters: |
  Given a record or table, produce a list of its columns' values.
usage: |
  Given a record or table, produce a list of its columns' values.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> values ```


## Input/output types:

| input  | output    |
| ------ | --------- |
| record | list\<any\> |
| table  | list\<any\> |
## Examples

Get the values from the record (produce a list)
```shell
> { mode:normal userid:31415 } | values
╭───┬────────╮
│ 0 │ normal │
│ 1 │  31415 │
╰───┴────────╯

```

Values are ordered by the column order of the record
```shell
> { f:250 g:191 c:128 d:1024 e:2000 a:16 b:32 } | values
╭───┬──────╮
│ 0 │  250 │
│ 1 │  191 │
│ 2 │  128 │
│ 3 │ 1024 │
│ 4 │ 2000 │
│ 5 │   16 │
│ 6 │   32 │
╰───┴──────╯

```

Get the values from the table (produce a list of lists)
```shell
> [[name meaning]; [ls list] [mv move] [cd 'change directory']] | values
╭───┬──────────────────────────╮
│ 0 │ ╭───┬────╮               │
│   │ │ 0 │ ls │               │
│   │ │ 1 │ mv │               │
│   │ │ 2 │ cd │               │
│   │ ╰───┴────╯               │
│ 1 │ ╭───┬──────────────────╮ │
│   │ │ 0 │ list             │ │
│   │ │ 1 │ move             │ │
│   │ │ 2 │ change directory │ │
│   │ ╰───┴──────────────────╯ │
╰───┴──────────────────────────╯

```

## Notes
This is a counterpart to `columns`, which produces a list of columns' names.