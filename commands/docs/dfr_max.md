---
title: dfr max
categories: |
  expression
version: 0.84.0
expression: |
  Creates a max expression or aggregates columns to their max value
usage: |
  Creates a max expression or aggregates columns to their max value
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr max ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Max value from columns in a dataframe
```shell
> [[a b]; [6 2] [1 4] [4 1]] | dfr into-df | dfr max
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 6 │ 4 │
╰───┴───┴───╯

```

Max aggregation for a group-by
```shell
> [[a b]; [one 2] [one 4] [two 1]]
    | dfr into-df
    | dfr group-by a
    | dfr agg (dfr col b | dfr max)
╭───┬─────┬───╮
│ # │  a  │ b │
├───┼─────┼───┤
│ 0 │ one │ 4 │
│ 1 │ two │ 1 │
╰───┴─────┴───╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag