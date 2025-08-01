---
title: polars arg-unique
categories: |
  dataframe
version: 0.106.0
dataframe: |
  Returns indexes for unique values.
usage: |
  Returns indexes for unique values.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `polars arg-unique` for [dataframe](/commands/categories/dataframe.md)

<div class='command-title'>Returns indexes for unique values.</div>

::: warning This command requires a plugin
The `polars arg-unique` command resides in the `polars` plugin.
To use this command, you must install and register `nu_plugin_polars`.
See the [Plugins](/book/plugins.html) chapter in the book for more information.
:::


## Signature

```> polars arg-unique {flags} ```


## Input/output types:

| input     | output    |
| --------- | --------- |
| dataframe | dataframe |
## Examples

Returns indexes for unique values
```nu
> [1 2 2 3 3] | polars into-df | polars arg-unique
╭───┬────────────╮
│ # │ arg_unique │
├───┼────────────┤
│ 0 │          0 │
│ 1 │          1 │
│ 2 │          3 │
╰───┴────────────╯

```
