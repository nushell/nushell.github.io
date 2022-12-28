---
title: any
categories: |
  filters
version: 0.73.1
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

 -  `predicate`: a closure that must evaluate to a boolean

## Examples

Check if any row's status is the string 'DOWN'
```shell
> [[status]; [UP] [DOWN] [UP]] | any {|el| $el.status == DOWN }
```

Check if any value is equal to twice its own index
```shell
> [9 8 7 6] | any {|el ind| $el == $ind * 2 }
```

Check if any of the values are odd, using a stored closure
```shell
> let cond = {|e| $e mod 2 == 1 }; [2 4 1 6 8] | any $cond
```
