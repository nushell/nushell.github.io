---
title: sort
categories: |
  filters
version: 0.78.0
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

 -  `--reverse` `(-r)`: Sort in reverse order
 -  `--ignore-case` `(-i)`: Sort string-based data case-insensitively
 -  `--values` `(-v)`: If input is a single record, sort the record by values; ignored if input is not a single record
 -  `--natural` `(-n)`: Sort alphanumeric string-based values naturally (1, 9, 10, 99, 100, ...)

## Examples

sort the list by increasing value
```shell
> [2 0 1] | sort
╭───┬───╮
│ 0 │ 0 │
│ 1 │ 1 │
│ 2 │ 2 │
╰───┴───╯

```

sort the list by decreasing value
```shell
> [2 0 1] | sort -r
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 1 │
│ 2 │ 0 │
╰───┴───╯

```

sort a list of strings
```shell
> [betty amy sarah] | sort
╭───┬───────╮
│ 0 │ amy   │
│ 1 │ betty │
│ 2 │ sarah │
╰───┴───────╯

```

sort a list of strings in reverse
```shell
> [betty amy sarah] | sort -r
╭───┬───────╮
│ 0 │ sarah │
│ 1 │ betty │
│ 2 │ amy   │
╰───┴───────╯

```

Sort strings (case-insensitive)
```shell
> [airplane Truck Car] | sort -i
╭───┬──────────╮
│ 0 │ airplane │
│ 1 │ Car      │
│ 2 │ Truck    │
╰───┴──────────╯

```

Sort strings (reversed case-insensitive)
```shell
> [airplane Truck Car] | sort -i -r
╭───┬──────────╮
│ 0 │ Truck    │
│ 1 │ Car      │
│ 2 │ airplane │
╰───┴──────────╯

```

Sort record by key (case-insensitive)
```shell
> {b: 3, a: 4} | sort
╭───┬───╮
│ a │ 4 │
│ b │ 3 │
╰───┴───╯
```

Sort record by value
```shell
> {b: 4, a: 3, c:1} | sort -v
╭───┬───╮
│ c │ 1 │
│ a │ 3 │
│ b │ 4 │
╰───┴───╯
```
