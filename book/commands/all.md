---
title: all
categories: |
  filters
version: 0.71.0
filters: |
  Test if every element of the input fulfills a predicate expression.
usage: |
  Test if every element of the input fulfills a predicate expression.
---

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> all (predicate)```

## Parameters

 -  `predicate`: the expression, or block, that must evaluate to a boolean

## Examples

Check if each row's status is the string 'UP'
```shell
> [[status]; [UP] [UP]] | all status == UP
```

Check that all of the values are even, using the built-in $it variable
```shell
> [2 4 6 8] | all ($it mod 2) == 0
```

Check that all of the values are even, using a block
```shell
> [2 4 6 8] | all {|e| $e mod 2 == 0 }
```
