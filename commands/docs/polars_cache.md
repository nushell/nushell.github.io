---
title: polars cache
categories: |
  dataframe
version: 0.106.0
dataframe: |
  Caches operations in a new LazyFrame.
usage: |
  Caches operations in a new LazyFrame.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `polars cache` for [dataframe](/commands/categories/dataframe.md)

<div class='command-title'>Caches operations in a new LazyFrame.</div>

::: warning This command requires a plugin
The `polars cache` command resides in the `polars` plugin.
To use this command, you must install and register `nu_plugin_polars`.
See the [Plugins](/book/plugins.html) chapter in the book for more information.
:::


## Signature

```> polars cache {flags} ```


## Input/output types:

| input     | output    |
| --------- | --------- |
| dataframe | dataframe |
## Examples

Caches the result into a new LazyFrame
```nu
> [[a b]; [6 2] [4 2] [2 2]] | polars into-df
                | polars reverse
                | polars cache
                | polars sort-by a
╭───┬───┬───╮
│ # │ a │ b │
├───┼───┼───┤
│ 0 │ 2 │ 2 │
│ 1 │ 4 │ 2 │
│ 2 │ 6 │ 2 │
╰───┴───┴───╯

```
