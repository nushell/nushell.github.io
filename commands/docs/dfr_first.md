---
title: dfr first
categories: |
  dataframe
  expression
version: 0.77.0
dataframe: |
  Show only the first number of rows.
expression: |
  creates a first expression
usage: |
  Show only the first number of rows.
  creates a first expression
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr first ```

## Examples

Return the first row of a dataframe
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr first
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
╰───┴───┴───╯

```

Return the first two rows of a dataframe
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr first 2
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
│ 1 │ 3 │ 4 │
╰───┴───┴───╯

```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr first ```

## Examples

Creates a first expression from a column
```shell
> dfr col a | dfr first

```
