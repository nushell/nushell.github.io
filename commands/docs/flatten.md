---
title: flatten
categories: |
  expression
  filters
version: 0.75.0
expression: |
  creates a flatten expression
filters: |
  Flatten the table.
usage: |
  creates a flatten expression
  Flatten the table.
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> flatten ```

## Examples


```shell
>
```

# <code>{{ $frontmatter.title }}</code> for filters

<div class='command-title'>{{ $frontmatter.filters }}</div>

## Signature

```> flatten ...rest --all```

## Parameters

 -  `...rest`: optionally flatten data by column
 -  `--all`: flatten inner table one level out

## Examples

flatten a table
```shell
> [[N, u, s, h, e, l, l]] | flatten
```

flatten a table, get the first item
```shell
> [[N, u, s, h, e, l, l]] | flatten | first
```

flatten a column having a nested table
```shell
> [[origin, people]; [Ecuador, ([[name, meal]; ['Andres', 'arepa']])]] | flatten --all | get meal
```

restrict the flattening by passing column names
```shell
> [[origin, crate, versions]; [World, ([[name]; ['nu-cli']]), ['0.21', '0.22']]] | flatten versions --all | last | get versions
```

Flatten inner table
```shell
> { a: b, d: [ 1 2 3 4 ],  e: [ 4 3  ] } | flatten d --all
```
