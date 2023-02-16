---
title: sort-by
categories: |
  filters
  lazyframe
version: 0.75.0
filters: |
  Sort by the given columns, in increasing order.
lazyframe: |
  sorts a lazy dataframe based on expression(s)
usage: |
  Sort by the given columns, in increasing order.
  sorts a lazy dataframe based on expression(s)
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> sort-by ...rest --reverse --ignore-case --natural```

## Parameters

 -  `...rest`: the column(s) to sort by
 -  `--reverse`: Sort in reverse order
 -  `--ignore-case`: Sort string-based columns case-insensitively
 -  `--natural`: Sort alphanumeric string-based columns naturally (1, 9, 10, 99, 100, ...)

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
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> sort-by ```

## Examples

Sort dataframe by one column
```shell
> [[a b]; [6 2] [1 4] [4 1]] | into df | sort-by a
```

Sort column using two columns
```shell
> [[a b]; [6 2] [1 1] [1 4] [2 4]] | into df | sort-by [a b] -r [false true]
```
