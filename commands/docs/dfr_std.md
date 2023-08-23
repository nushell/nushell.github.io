---
title: dfr std
categories: |
  expression
version: 0.84.0
expression: |
  Creates a std expression for an aggregation of std value from columns in a dataframe
usage: |
  Creates a std expression for an aggregation of std value from columns in a dataframe
---

# <code>{{ $frontmatter.title }}</code> for expression

<div class='command-title'>{{ $frontmatter.expression }}</div>

## Signature

```> dfr std ```


## Input/output types:

| input | output |
| ----- | ------ |
| any   | any    |

## Examples

Std value from columns in a dataframe
```shell
> [[a b]; [6 2] [4 2] [2 2]] | dfr into-df | dfr std
╭───┬──────┬──────╮
│ # │  a   │  b   │
├───┼──────┼──────┤
│ 0 │ 2.00 │ 0.00 │
╰───┴──────┴──────╯

```

Std aggregation for a group-by
```shell
> [[a b]; [one 2] [one 2] [two 1] [two 1]]
    | dfr into-df
    | dfr group-by a
    | dfr agg (dfr col b | dfr std)
╭───┬─────┬──────╮
│ # │  a  │  b   │
├───┼─────┼──────┤
│ 0 │ one │ 0.00 │
│ 1 │ two │ 0.00 │
╰───┴─────┴──────╯

```


**Tips:** Dataframe commands were not shipped in the official binaries by default, you have to build it with `--features=dataframe` flag