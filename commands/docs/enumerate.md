---
title: enumerate
categories: |
  filters
version: 0.84.0
filters: |
  Enumerate the elements in a stream.
usage: |
  Enumerate the elements in a stream.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> enumerate ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | table  |

## Examples

Add an index to each element of a list
```shell
> [a, b, c] | enumerate
╭───┬──────╮
│ # │ item │
├───┼──────┤
│ 0 │ a    │
│ 1 │ b    │
│ 2 │ c    │
╰───┴──────╯

```
