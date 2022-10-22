---
title: is-in
categories: |
  dataframe
  expression
version: 0.70.0
dataframe: |
  Checks if elements from a series are contained in right series
expression: |
  Creates an is-in expression
usage: |
  Checks if elements from a series are contained in right series
  Creates an is-in expression
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> is-in (other)```

## Parameters

 -  `other`: right series

## Examples

Checks if elements from a series are contained in right series
```shell
> let other = ([1 3 6] | into df);
    [5 6 6 6 8 8 8] | into df | is-in $other
```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> is-in (list)```

## Parameters

 -  `list`: List to check if values are in

## Examples

Creates a is-in expression
```shell
> let df = ([[a b]; [one 1] [two 2] [three 3]] | into df);
    $df | with-column (col a | is-in [one two] | as a_in)
```
