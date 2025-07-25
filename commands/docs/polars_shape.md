---
title: polars shape
categories: |
  dataframe
version: 0.106.0
dataframe: |
  Shows column and row size for a dataframe.
usage: |
  Shows column and row size for a dataframe.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `polars shape` for [dataframe](/commands/categories/dataframe.md)

<div class='command-title'>Shows column and row size for a dataframe.</div>

::: warning This command requires a plugin
The `polars shape` command resides in the `polars` plugin.
To use this command, you must install and register `nu_plugin_polars`.
See the [Plugins](/book/plugins.html) chapter in the book for more information.
:::


## Signature

```> polars shape {flags} ```


## Input/output types:

| input     | output    |
| --------- | --------- |
| dataframe | dataframe |
## Examples

Shows row and column shape
```nu
> [[a b]; [1 2] [3 4]] | polars into-df | polars shape
╭───┬──────┬─────────╮
│ # │ rows │ columns │
├───┼──────┼─────────┤
│ 0 │    2 │       2 │
╰───┴──────┴─────────╯

```
