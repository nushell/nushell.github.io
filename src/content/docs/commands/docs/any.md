---
title: any
categories: |
  filters
version: 0.90.0
filters: |
  Tests if any element of the input fulfills a predicate expression.
usage: |
  Tests if any element of the input fulfills a predicate expression.
feature: default
---

<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

`> any {flags} (predicate)`

## Parameters

- `predicate`: A closure that must evaluate to a boolean.

## Input/output types:

| input       | output |
| ----------- | ------ |
| list\<any\> | bool   |

## Examples

Check if any row's status is the string 'DOWN'

```nu
> [[status]; [UP] [DOWN] [UP]] | any {|el| $el.status == DOWN }
true
```

Check that any item is a string

```nu
> [1 2 3 4] | any {|| ($in | describe) == 'string' }
false
```

Check if any value is equal to twice its own index

```nu
> [9 8 7 6] | enumerate | any {|i| $i.item == $i.index * 2 }
true
```

Check if any of the values are odd, using a stored closure

```nu
> let cond = {|e| $e mod 2 == 1 }; [2 4 1 6 8] | any $cond
true
```