---
title: sort-by
version: 0.66.1
usage: |
  Sort by the given columns, in increasing order.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
