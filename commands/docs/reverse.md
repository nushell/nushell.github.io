---
title: reverse
categories: |
  filters
version: 0.81.0
filters: |
  Reverses the input list or table.
usage: |
  Reverses the input list or table.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> reverse ```

## Examples

Reverse a list
```shell
> [0,1,2,3] | reverse
╭───┬───╮
│ 0 │ 3 │
│ 1 │ 2 │
│ 2 │ 1 │
│ 3 │ 0 │
╰───┴───╯

```

Reverse a table
```shell
> [{a: 1} {a: 2}] | reverse
╭───┬───╮
│ # │ a │
├───┼───┤
│ 0 │ 2 │
│ 1 │ 1 │
╰───┴───╯

```
