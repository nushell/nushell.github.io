---
title: from ics
categories: |
  formats
version: 0.106.0
formats: |
  Parse text as .ics and create table.
usage: |
  Parse text as .ics and create table.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `from ics` for [formats](/commands/categories/formats.md)

<div class='command-title'>Parse text as .ics and create table.</div>

::: warning This command requires a plugin
The `from ics` command resides in the `formats` plugin.
To use this command, you must install and register `nu_plugin_formats`.
See the [Plugins](/book/plugins.html) chapter in the book for more information.
:::


## Signature

```> from ics {flags} ```


## Input/output types:

| input  | output |
| ------ | ------ |
| string | table  |
## Examples

Converts ics formatted string to table
```nu
> 'BEGIN:VCALENDAR
END:VCALENDAR' | from ics
╭───┬────────────────┬────────────────┬────────────────┬────────────────┬────────────────┬────────────────┬────────────────╮
│ # │   properties   │     events     │     alarms     │     to-Dos     │    journals    │   free-busys   │   timezones    │
├───┼────────────────┼────────────────┼────────────────┼────────────────┼────────────────┼────────────────┼────────────────┤
│ 0 │ [list 0 items] │ [list 0 items] │ [list 0 items] │ [list 0 items] │ [list 0 items] │ [list 0 items] │ [list 0 items] │
╰───┴────────────────┴────────────────┴────────────────┴────────────────┴────────────────┴────────────────┴────────────────╯

```
