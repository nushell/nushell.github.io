---
title: prepend
categories: |
  filters
version: 0.76.0
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

## Notes
Be aware that this command 'unwraps' lists passed to it. So, if you pass a variable to it,
and you want the variable's contents to be prepended without being unwrapped, it's wise to
pre-emptively wrap the variable in a list, like so: `prepend [$val]`. This way, `prepend` will
only unwrap the outer list, and leave the variable's contents untouched.
## Examples

Prepend one Int item
```shell
> [1,2,3,4] | prepend 0
```

Prepend two Int items
```shell
> [2,3,4] | prepend [0,1]
```

Prepend Ints and Strings
```shell
> [2,nu,4,shell] | prepend [0,1,rocks]
```
