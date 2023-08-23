---
title: math min
categories: |
  math
version: 0.84.0
math: |
  Finds the minimum within a list of values or tables.
usage: |
  Finds the minimum within a list of values or tables.
---

# <code>{{ $frontmatter.title }}</code> for math

<div class='command-title'>{{ $frontmatter.math }}</div>

## Signature

```> math min ```


## Input/output types:

| input     | output |
| --------- | ------ |
| list\<any\> | any    |
| table     | record |
## Examples

Compute the minimum of a list of numbers
```shell
> [-50 100 25] | math min
-50
```

Compute the minima of the columns of a table
```shell
> [{a: 1 b: 3} {a: 2 b: -1}] | math min
╭───┬────╮
│ a │ 1  │
│ b │ -1 │
╰───┴────╯
```

Find the minimum of a list of arbitrary values (Warning: Weird)
```shell
> [-50 'hello' true] | math min
true
```
