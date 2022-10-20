---
title: sort-by
version: 0.70.0
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

```> sort-by ...columns --reverse --insensitive --natural```

## Parameters

 -  `...columns`: the column(s) to sort by
 -  `--reverse`: Sort in reverse order
 -  `--insensitive`: Sort string-based columns case-insensitively
 -  `--natural`: Sort alphanumeric string-based columns naturally

## Examples

sort the list by increasing value
```shell
> [2 0 1] | sort-by
```

sort the list by decreasing value
```shell
> [2 0 1] | sort-by -r
```

sort a list of strings
```shell
> [betty amy sarah] | sort-by
```

sort a list of strings in reverse
```shell
> [betty amy sarah] | sort-by -r
```

sort a list of alphanumeric strings naturally
```shell
> [test1 test11 test2] | sort-by -n
```

Sort strings (case-insensitive)
```shell
> echo [airplane Truck Car] | sort-by -i
```

Sort strings (reversed case-insensitive)
```shell
> echo [airplane Truck Car] | sort-by -i -r
```

Sort a table by its column (reversed order)
```shell
> [[fruit count]; [apple 9] [pear 3] [orange 7]] | sort-by fruit -r
```

# <code>{{ $frontmatter.title }}</code> for lazyframe

<div class='command-title'>{{ $frontmatter.lazyframe }}</div>

## Signature

```> sort-by ...sort expression --reverse --nulls-last```

## Parameters

 -  `...sort expression`: sort expression for the dataframe
 -  `--reverse {list<bool>}`: Reverse sorting. Default is false
 -  `--nulls-last`: nulls are shown last in the dataframe

## Examples

Sort dataframe by one column
```shell
> [[a b]; [6 2] [1 4] [4 1]] | into df | sort-by a
```

Sort column using two columns
```shell
> [[a b]; [6 2] [1 1] [1 4] [2 4]] | into df | sort-by [a b] -r [false true]
```
