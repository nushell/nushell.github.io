---
title: any
categories: |
  filters
version: 0.71.0
filters: |
  Tests if any element of the input fulfills a predicate expression.
usage: |
  Tests if any element of the input fulfills a predicate expression.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> any (predicate)```

## Parameters

 -  `predicate`: the expression, or block, that should return a boolean

## Examples

Check if any row's status is the string 'DOWN'
```shell
> [[status]; [UP] [DOWN] [UP]] | any status == DOWN
```

Check if any of the values is odd, using the built-in $it variable
```shell
> [2 4 1 6 8] | any ($it mod 2) == 1
```

Check if any of the values are odd, using a block
```shell
> [2 4 1 6 8] | any {|e| $e mod 2 == 1 }
```
