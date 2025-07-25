---
title: into sqlite
categories: |
  conversions
version: 0.106.0
conversions: |
  Convert table into a SQLite database.
usage: |
  Convert table into a SQLite database.
editLink: false
contributors: false
---
<!-- This file is automatically generated. Please edit the command in https://github.com/nushell/nushell instead. -->

# `into sqlite` for [conversions](/commands/categories/conversions.md)

<div class='command-title'>Convert table into a SQLite database.</div>

## Signature

```> into sqlite {flags} (file-name)```

## Flags

 -  `--table-name, -t {string}`: Specify table name to store the data in

## Parameters

 -  `file-name`: Specify the filename to save the database to.


## Input/output types:

| input  | output  |
| ------ | ------- |
| table  | nothing |
| record | nothing |
## Examples

Convert ls entries into a SQLite database with 'main' as the table name
```nu
> ls | into sqlite my_ls.db

```

Convert ls entries into a SQLite database with 'my_table' as the table name
```nu
> ls | into sqlite my_ls.db -t my_table

```

Convert table literal into a SQLite database with 'main' as the table name
```nu
> [[name]; [-----] [someone] [=====] [somename] ['(((((']] | into sqlite filename.db

```

Insert a single record into a SQLite database
```nu
> { foo: bar, baz: quux } | into sqlite filename.db

```
