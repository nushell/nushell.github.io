---
title: dfr mean
categories: |
  expression
version: 0.84.0
expression: |
  Creates a mean expression for an aggregation or aggregates columns to their mean value
usage: |
  Creates a mean expression for an aggregation or aggregates columns to their mean value
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr mean ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Mean value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr mean
╭───┬──────┬──────╮
│ # │  a   │  b   │
├───┼──────┼──────┤
│ 0 │ 4.00 │ 2.00 │
╰───┴──────┴──────╯

```

Mean aggregation for a group-by
```shell
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


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag