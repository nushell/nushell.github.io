---
title: all
categories: |
  filters
version: 0.74.0
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

 -  `predicate`: a closure that must evaluate to a boolean

## Examples

Check if each row's status is the string 'UP'
```shell
> [[status]; [UP] [UP]] | all {|el| $el.status == UP }
```

Check that all values are equal to twice their index
```shell
> [0 2 4 6] | all {|el ind| $el == $ind * 2 }
```

Check that all of the values are even, using a stored closure
```shell
> let cond = {|el| ($el mod 2) == 0 }; [2 4 6 8] | all $cond
```
