---
title: polars replace
categories: |
  expression
version: 0.106.0
expression: |
  Create an expression that replaces old values with new values
usage: |
  Create an expression that replaces old values with new values
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `polars replace` for [expression](/commands/categories/expression.md)

<div class='command-title'>Create an expression that replaces old values with new values</div>

::: warning This command requires a plugin
The `polars replace` command resides in the `polars` plugin.
To use this command, you must install and register `nu_plugin_polars`.
See the [Plugins](/book/plugins.html) chapter in the book for more information.
:::


## Signature

```> polars replace {flags} (old) (new)```

## Flags

 -  `--strict, -s`: Require that all values must be replaced or throw an error (ignored if `old` or `new` are expressions).
 -  `--default, -d {any}`: Set values that were not replaced to this value. If no default is specified, (default), an error is raised if any values were not replaced. Accepts expression input. Non-expression inputs are parsed as literals.
 -  `--return-dtype, -t {string}`: Data type of the resulting expression. If set to `null` (default), the data type is determined automatically based on the other inputs.

## Parameters

 -  `old`: Values to be replaced
 -  `new`: Values to replace by


## Input/output types:

| input      | output     |
| ---------- | ---------- |
| expression | expression |
## Examples

Replace column with different values of same type
```nu
> [[a]; [1] [1] [2] [2]]
                | polars into-df
                | polars select (polars col a | polars replace [1 2] [10 20])
                | polars collect
╭───┬────╮
│ # │ a  │
├───┼────┤
│ 0 │ 10 │
│ 1 │ 10 │
│ 2 │ 20 │
│ 3 │ 20 │
╰───┴────╯

```

Replace column with different values of another type
```nu
> [[a]; [1] [1] [2] [2]]
                | polars into-df
                | polars select (polars col a | polars replace [1 2] [a b] --strict)
                | polars collect
╭───┬───╮
│ # │ a │
├───┼───┤
│ 0 │ a │
│ 1 │ a │
│ 2 │ b │
│ 3 │ b │
╰───┴───╯

```

Replace column with different values based on expressions (cannot be used with strict)
```nu
> [[a]; [1] [1] [2] [2]]
                | polars into-df
                | polars select (polars col a | polars replace [(polars col a | polars max)] [(polars col a | polars max | $in + 5)])
                | polars collect
╭───┬───╮
│ # │ a │
├───┼───┤
│ 0 │ 1 │
│ 1 │ 1 │
│ 2 │ 7 │
│ 3 │ 7 │
╰───┴───╯

```

Replace column with different values based on expressions with default
```nu
> [[a]; [1] [1] [2] [3]]
                | polars into-df
                | polars select (polars col a | polars replace [1] [10] --default (polars col a | polars max | $in * 100) --strict)
                | polars collect
╭───┬─────╮
│ # │  a  │
├───┼─────┤
│ 0 │  10 │
│ 1 │  10 │
│ 2 │ 300 │
│ 3 │ 300 │
╰───┴─────╯

```

Replace column with different values based on expressions with default
```nu
> [[a]; [1] [1] [2] [3]]
                | polars into-df
                | polars select (polars col a | polars replace [1] [10] --default (polars col a | polars max | $in * 100) --strict --return-dtype str)
                | polars collect
╭───┬─────╮
│ # │  a  │
├───┼─────┤
│ 0 │ 10  │
│ 1 │ 10  │
│ 2 │ 300 │
│ 3 │ 300 │
╰───┴─────╯

```

Replace column with different values using a record
```nu
> [[a]; [1] [1] [2] [2]]
                | polars into-df
                | polars select (polars col a | polars replace {1: a, 2: b} --strict --return-dtype str)
                | polars collect
╭───┬───╮
│ # │ a │
├───┼───┤
│ 0 │ a │
│ 1 │ a │
│ 2 │ b │
│ 3 │ b │
╰───┴───╯

```
