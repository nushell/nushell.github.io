---
title: reject
categories: |
  filters
version: 0.83.0
filters: |
  Remove the given columns or rows from the table. Opposite of `select`.
usage: |
  Remove the given columns or rows from the table. Opposite of `select`.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> reject ...rest```

## Parameters

 -  `...rest`: the names of columns to remove from the table

## Notes
To remove a quantity of rows or columns, use `skip`, `drop`, or `drop column`.
## Examples

Reject a column in the `ls` table
```shell
> ls | reject modified

```

Reject a column in a table
```shell
> [[a, b]; [1, 2]] | reject a
╭───┬───╮
│ # │ b │
├───┼───┤
│ 0 │ 2 │
╰───┴───╯

```

Reject the specified field in a record
```shell
> {a: 1, b: 2} | reject a
╭───┬───╮
│ b │ 2 │
╰───┴───╯
```

Reject a nested field in a record
```shell
> {a: {b: 3, c: 5}} | reject a.b
╭───┬───────────╮
│   │ ╭───┬───╮ │
│ a │ │ c │ 5 │ │
│   │ ╰───┴───╯ │
╰───┴───────────╯
```
