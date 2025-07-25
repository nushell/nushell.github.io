---
title: polars get
categories: |
  dataframe
version: 0.106.0
dataframe: |
  Creates dataframe with the selected columns.
usage: |
  Creates dataframe with the selected columns.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `polars get` for [dataframe](/commands/categories/dataframe.md)

<div class='command-title'>Creates dataframe with the selected columns.</div>

::: warning This command requires a plugin
The `polars get` command resides in the `polars` plugin.
To use this command, you must install and register `nu_plugin_polars`.
See the [Plugins](/book/plugins.html) chapter in the book for more information.
:::


## Signature

```> polars get {flags} ...rest```

## Parameters

 -  `...rest`: column names to sort dataframe


## Input/output types:

| input     | output    |
| --------- | --------- |
| dataframe | dataframe |
## Examples

Returns the selected column
```nu
> [[a b]; [1 2] [3 4]] | polars into-df | polars get a
╭───┬───╮
│ # │ a │
├───┼───┤
│ 0 │ 1 │
│ 1 │ 3 │
╰───┴───╯

```
