---
title: date to-table
categories: |
  date
version: 0.81.0
date: |
  Convert the date into a structured table.
usage: |
  Convert the date into a structured table.
---

# <code>{{ $frontmatter.title }}</code> for date

<div class='command-title'>{{ $frontmatter.date }}</div>

## Signature

```> date to-table ```

## Examples

Convert the current date into a table.
```shell
> date to-table

```

Convert the date into a table.
```shell
> date now | date to-table

```

Convert a given date into a table.
```shell
> 2020-04-12T22:10:57.000000789+02:00 | date to-table
╭───┬──────┬───────┬─────┬──────┬────────┬────────┬────────────┬──────────╮
│ # │ year │ month │ day │ hour │ minute │ second │ nanosecond │ timezone │
├───┼──────┼───────┼─────┼──────┼────────┼────────┼────────────┼──────────┤
│ 0 │ 2020 │     4 │  12 │   22 │     10 │     57 │        789 │ +02:00   │
╰───┴──────┴───────┴─────┴──────┴────────┴────────┴────────────┴──────────╯

```
