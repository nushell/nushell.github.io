---
title: sort
version: 0.69.1
filters: |
  Sort in increasing order.
usage: |
  Sort in increasing order.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> sort --reverse --insensitive --values```

## Parameters

 -  `--reverse`: Sort in reverse order
 -  `--insensitive`: Sort string-based columns case-insensitively
 -  `--values`: If input is a single record, sort the record by values, ignored if input is not a single record

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
> echo [airplane Truck Car] | sort -i
```

Sort strings (reversed case-insensitive)
```shell
> echo [airplane Truck Car] | sort -i -r
```

Sort record by key
```shell
> {b: 3, a: 4} | sort
```

Sort record by value
```shell
> {a: 4, b: 3} | sort
```
