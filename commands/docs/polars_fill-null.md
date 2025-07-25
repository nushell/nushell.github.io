---
title: polars fill-null
categories: |
  lazyframe
version: 0.106.0
lazyframe: |
  Replaces NULL values with the given expression.
usage: |
  Replaces NULL values with the given expression.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `polars fill-null` for [lazyframe](/commands/categories/lazyframe.md)

<div class='command-title'>Replaces NULL values with the given expression.</div>

::: warning This command requires a plugin
The `polars fill-null` command resides in the `polars` plugin.
To use this command, you must install and register `nu_plugin_polars`.
See the [Plugins](/book/plugins.html) chapter in the book for more information.
:::


## Signature

```> polars fill-null {flags} (fill)```

## Parameters

 -  `fill`: Expression to use to fill the null values


## Input/output types:

| input     | output    |
| --------- | --------- |
| dataframe | dataframe |
## Examples

Fills the null values by 0
```nu
> [1 2 2 3 3] | polars into-df | polars shift 2 | polars fill-null 0
╭───┬───╮
│ # │ 0 │
├───┼───┤
│ 0 │ 0 │
│ 1 │ 0 │
│ 2 │ 1 │
│ 3 │ 2 │
│ 4 │ 2 │
╰───┴───╯

```
