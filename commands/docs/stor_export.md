---
title: stor export
categories: |
  database
version: 0.106.0
database: |
  Export the in-memory sqlite database to a sqlite database file.
usage: |
  Export the in-memory sqlite database to a sqlite database file.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `stor export` for [database](/commands/categories/database.md)

<div class='command-title'>Export the in-memory sqlite database to a sqlite database file.</div>

## Signature

```> stor export {flags} ```

## Flags

 -  `--file-name, -f {string}`: file name to export the sqlite in-memory database to


## Input/output types:

| input   | output |
| ------- | ------ |
| nothing | table  |
## Examples

Export the in-memory sqlite database
```nu
> stor export --file-name nudb.sqlite

```
