---
title: dfr into-nu
categories: |
  dataframe
  expression
version: 0.82.0
dataframe: |
  Converts a section of the dataframe into nushell Table.
expression: |
  Convert expression into a nu value for access and exploration.
usage: |
  Converts a section of the dataframe into nushell Table.
  Convert expression into a nu value for access and exploration.
---

# <code>{{ $frontmatter.title }}</code> for dataframe

<div class='command-title'>{{ $frontmatter.dataframe }}</div>

## Signature

```> dfr into-nu --rows --tail```

## Parameters

 -  `--rows {number}`: number of rows to be shown
 -  `--tail` `(-t)`: shows tail rows

## Examples

Shows head rows from dataframe
```shell
> [[a b]; [1 2] [3 4]] | dfr into-df | dfr into-nu
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 1 │ 2 │
│ 1 │ 3 │ 4 │
╰───┴───┴───╯

```

Shows tail rows from dataframe
```shell
> [[a b]; [1 2] [5 6] [3 4]] | dfr into-df | dfr into-nu -t -n 1
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 2 │ 3 │ 4 │
╰───┴───┴───╯

```

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr into-nu ```

## Examples

Convert a col expression into a nushell value
```shell
> dfr col a | dfr into-nu
╭───────┬────────╮
│ expr  │ column │
│ value │ a      │
╰───────┴────────╯
```
