---
title: dfr last
categories: |
  dataframe
  expression
version: 0.82.0
dataframe: |
  Creates new dataframe with tail rows or creates a last expression.
expression: |
  creates a last expression
usage: |
  Creates new dataframe with tail rows or creates a last expression.
  creates a last expression
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr last (rows)```

## Parameters

 -  `rows`: Number of rows for tail

## Examples

Create new dataframe with last rows
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr last 1
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 3 │ 4 │
╰───┴───┴───╯

```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr last ```

## Examples

Creates a last expression from a column
```shell
> dfr col a | dfr last

```
