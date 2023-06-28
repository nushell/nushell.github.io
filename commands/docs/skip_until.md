---
title: skip until
categories: |
  filters
version: 0.82.1
filters: |
  Skip elements of the input until a predicate is true.
usage: |
  Skip elements of the input until a predicate is true.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> skip until (predicate)```

## Parameters

 -  `predicate`: the predicate that skipped element must not match

## Examples

Skip until the element is positive
```shell
> [-2 0 2 -1] | skip until {|x| $x > 0 }
╭───┬────╮
│ 0 │  2 │
│ 1 │ -1 │
╰───┴────╯

```

Skip until the element is positive using stored condition
```shell
> let cond = {|x| $x > 0 }; [-2 0 2 -1] | skip until $cond
╭───┬────╮
│ 0 │  2 │
│ 1 │ -1 │
╰───┴────╯

```

Skip until the field value is positive
```shell
> [{a: -2} {a: 0} {a: 2} {a: -1}] | skip until {|x| $x.a > 0 }
╭───┬────╮
│ # │ a  │
├───┼────┤
│ 0 │  2 │
│ 1 │ -1 │
╰───┴────╯

```
