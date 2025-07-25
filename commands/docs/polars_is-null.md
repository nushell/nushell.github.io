---
title: polars is-null
categories: |
  dataframe
version: 0.106.0
dataframe: |
  Creates mask where value is null.
usage: |
  Creates mask where value is null.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `polars is-null` for [dataframe](/commands/categories/dataframe.md)

<div class='command-title'>Creates mask where value is null.</div>

::: warning This command requires a plugin
The `polars is-null` command resides in the `polars` plugin.
To use this command, you must install and register `nu_plugin_polars`.
See the [Plugins](/book/plugins.html) chapter in the book for more information.
:::


## Signature

```> polars is-null {flags} ```


## Input/output types:

| input      | output     |
| ---------- | ---------- |
| expression | expression |
| dataframe  | dataframe  |
## Examples

Create mask where values are null
```nu
> let s = ([5 6 0 8] | polars into-df);
    let res = ($s / $s);
    $res | polars is-null
╭───┬─────────╮
│ # │ is_null │
├───┼─────────┤
│ 0 │ false   │
│ 1 │ false   │
│ 2 │ true    │
│ 3 │ false   │
╰───┴─────────╯

```

Creates a is null expression from a column
```nu
> polars col a | polars is-null

```
