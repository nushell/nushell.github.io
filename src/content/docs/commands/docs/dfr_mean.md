---
title: dfr mean
categories: |
  expression
version: 0.90.0
expression: |
  Creates a mean expression for an aggregation or aggregates columns to their mean value.
usage: |
  Creates a mean expression for an aggregation or aggregates columns to their mean value.
feature: dataframe
---

<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

:::caution[warning]
Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag
:::

## Signature

`> dfr mean {flags} `

## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Mean value from columns in a dataframe

```nu
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr mean
╭───┬──────┬──────╮
│ # │  a   │  b   │
├───┼──────┼──────┤
│ 0 │ 4.00 │ 2.00 │
╰───┴──────┴──────╯

```

Mean aggregation for a group-by

```nu
> [[a b]; [one 2] [one 4] [two 1]]
    | dfr into-df
    | dfr group-by a
    | dfr agg (dfr col b | dfr mean)
╭───┬─────┬──────╮
│ # │  a  │  b   │
├───┼─────┼──────┤
│ 0 │ one │ 3.00 │
│ 1 │ two │ 1.00 │
╰───┴─────┴──────╯

```