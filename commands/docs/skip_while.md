---
title: skip while
categories: |
  filters
version: 0.82.0
filters: |
  Skip elements of the input while a predicate is true.
usage: |
  Skip elements of the input while a predicate is true.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> skip while (predicate)```

## Parameters

 -  `predicate`: the predicate that skipped element must match

## Examples

Skip while the element is negative
```shell
> [-2 0 2 -1] | skip while {|x| $x < 0 }
╭───┬────╮
│ 0 │  0 │
│ 1 │  2 │
│ 2 │ -1 │
╰───┴────╯

```

Skip while the element is negative using stored condition
```shell
> let cond = {|x| $x < 0 }; [-2 0 2 -1] | skip while $cond
╭───┬────╮
│ 0 │  0 │
│ 1 │  2 │
│ 2 │ -1 │
╰───┴────╯

```

Skip while the field value is negative
```shell
> [{a: -2} {a: 0} {a: 2} {a: -1}] | skip while {|x| $x.a < 0 }
╭───┬────╮
│ # │ a  │
├───┼────┤
│ 0 │  0 │
│ 1 │  2 │
│ 2 │ -1 │
╰───┴────╯

```
