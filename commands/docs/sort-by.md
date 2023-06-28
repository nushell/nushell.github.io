---
title: sort-by
categories: |
  filters
version: 0.82.0
filters: |
  Sort by the given columns, in increasing order.
usage: |
  Sort by the given columns, in increasing order.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> sort-by ...rest --reverse --ignore-case --natural```

## Parameters

 -  `...rest`: the column(s) to sort by
 -  `--reverse` `(-r)`: Sort in reverse order
 -  `--ignore-case` `(-i)`: Sort string-based columns case-insensitively
 -  `--natural` `(-n)`: Sort alphanumeric string-based columns naturally (1, 9, 10, 99, 100, ...)

## Examples

Sort files by modified date
```shell
> ls | sort-by modified

```

Sort files by name (case-insensitive)
```shell
> ls | sort-by name -i

```

Sort a table by a column (reversed order)
```shell
> [[fruit count]; [apple 9] [pear 3] [orange 7]] | sort-by fruit -r
╭───┬────────┬───────╮
│ # │ fruit  │ count │
├───┼────────┼───────┤
│ 0 │ pear   │     3 │
│ 1 │ orange │     7 │
│ 2 │ apple  │     9 │
╰───┴────────┴───────╯

```
