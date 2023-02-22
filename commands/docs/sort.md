---
title: sort
categories: |
  filters
version: 0.76.0
filters: |
  Sort in increasing order.
usage: |
  Sort in increasing order.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> sort --reverse --ignore-case --values --natural```

## Parameters

 -  `--reverse`: Sort in reverse order
 -  `--ignore-case`: Sort string-based data case-insensitively
 -  `--values`: If input is a single record, sort the record by values; ignored if input is not a single record
 -  `--natural`: Sort alphanumeric string-based values naturally (1, 9, 10, 99, 100, ...)

## Examples

sort the list by increasing value
```shell
> [2 0 1] | sort
```

sort the list by decreasing value
```shell
> [2 0 1] | sort -r
```

sort a list of strings
```shell
> [betty amy sarah] | sort
```

sort a list of strings in reverse
```shell
> [betty amy sarah] | sort -r
```

Sort strings (case-insensitive)
```shell
> [airplane Truck Car] | sort -i
```

Sort strings (reversed case-insensitive)
```shell
> [airplane Truck Car] | sort -i -r
```

Sort record by key (case-insensitive)
```shell
> {b: 3, a: 4} | sort
```

Sort record by value
```shell
> {b: 4, a: 3, c:1} | sort -v
```
