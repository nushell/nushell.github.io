---
title: prepend
categories: |
  filters
version: 0.84.0
filters: |
  Prepend any number of rows to a table.
usage: |
  Prepend any number of rows to a table.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> prepend (row)```

## Parameters

 -  `row`: the row, list, or table to prepend


## Input/output types:

| input | output    |
| ----- | --------- |
| any   | list\<any\> |

## Examples

prepend a list to an item
```shell
> 0 | prepend [1 2 3]
╭───┬───╮
│ 0 │ 1 │
│ 1 │ 2 │
│ 2 │ 3 │
│ 3 │ 0 │
╰───┴───╯

```

Prepend a list of strings to a string
```shell
> "a" | prepend ["b"]
╭───┬───╮
│ 0 │ b │
│ 1 │ a │
╰───┴───╯

```

Prepend one integer item
```shell
> [1,2,3,4] | prepend 0
╭───┬───╮
│ 0 │ 0 │
│ 1 │ 1 │
│ 2 │ 2 │
│ 3 │ 3 │
│ 4 │ 4 │
╰───┴───╯

```

Prepend two integer items
```shell
> [2,3,4] | prepend [0,1]
╭───┬───╮
│ 0 │ 0 │
│ 1 │ 1 │
│ 2 │ 2 │
│ 3 │ 3 │
│ 4 │ 4 │
╰───┴───╯

```

Prepend integers and strings
```shell
> [2,nu,4,shell] | prepend [0,1,rocks]
╭───┬───────╮
│ 0 │     0 │
│ 1 │     1 │
│ 2 │ rocks │
│ 3 │     2 │
│ 4 │ nu    │
│ 5 │     4 │
│ 6 │ shell │
╰───┴───────╯

```

## Notes
Be aware that this command 'unwraps' lists passed to it. So, if you pass a variable to it,
and you want the variable's contents to be prepended without being unwrapped, it's wise to
pre-emptively wrap the variable in a list, like so: `prepend [$val]`. This way, `prepend` will
only unwrap the outer list, and leave the variable's contents untouched.