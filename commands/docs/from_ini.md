---
title: from ini
categories: |
  formats
version: 0.106.0
formats: |
  Parse text as .ini and create table.
usage: |
  Parse text as .ini and create table.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `from ini` for [formats](/commands/categories/formats.md)

<div class='command-title'>Parse text as .ini and create table.</div>

::: warning This command requires a plugin
The `from ini` command resides in the `formats` plugin.
To use this command, you must install and register `nu_plugin_formats`.
See the [Plugins](/book/plugins.html) chapter in the book for more information.
:::


## Signature

```> from ini {flags} ```


## Input/output types:

| input  | output |
| ------ | ------ |
| string | record |
## Examples

Converts ini formatted string to record
```nu
> '[foo]
a=1
b=2' | from ini
╭─────┬───────────╮
│     │ ╭───┬───╮ │
│ foo │ │ a │ 1 │ │
│     │ │ b │ 2 │ │
│     │ ╰───┴───╯ │
╰─────┴───────────╯
```
