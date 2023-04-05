---
title: join
categories: |
  default
version: 0.78.0
default: |
  Join two tables
usage: |
  Join two tables
---

# <code>{{ $frontmatter.title }}</code> for default

<div class='command-title'>{{ $frontmatter.default }}</div>

## Signature

```> join (right-table) (left-on) (right-on) --inner --left --right --outer```

## Parameters

 -  `right-table`: The right table in the join
 -  `left-on`: Name of column in input (left) table to join on
 -  `right-on`: Name of column in right table to join on. Defaults to same column as left table.
 -  `--inner` `(-i)`: Inner join (default)
 -  `--left` `(-l)`: Left-outer join
 -  `--right` `(-r)`: Right-outer join
 -  `--outer` `(-o)`: Outer join

## Examples

Join two tables
```shell
> [{a: 1 b: 2}] | join [{a: 1 c: 3}] a
╭───┬───┬───┬───╮
│ # │ a │ b │ c │
├───┼───┼───┼───┤
│ 0 │ 1 │ 2 │ 3 │
╰───┴───┴───┴───╯

```
