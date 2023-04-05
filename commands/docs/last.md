---
title: last
categories: |
  filters
version: 0.78.0
filters: |
  Return only the last several rows of the input. Counterpart of `first`. Opposite of `drop`.
usage: |
  Return only the last several rows of the input. Counterpart of `first`. Opposite of `drop`.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> last (rows)```

## Parameters

 -  `rows`: starting from the back, the number of rows to return

## Examples

Get the last 2 items
```shell
> [1,2,3] | last 2
╭───┬───╮
│ 0 │ 2 │
│ 1 │ 3 │
╰───┴───╯

```

Get the last item
```shell
> [1,2,3] | last
3
```
