---
title: into sqlite
categories: |
  conversions
version: 0.83.0
conversions: |
  Convert table into a SQLite database.
usage: |
  Convert table into a SQLite database.
---

# <code>{{ $frontmatter.title }}</code> for conversions

<div class='command-title'>{{ $frontmatter.conversions }}</div>

## Signature

```> into sqlite (file_name) --table_name```

## Parameters

 -  `file_name`: Specify the filename to save the database to
 -  `--table_name {string}`: Specify table name to store the data in

## Examples

Convert ls entries into a SQLite database with 'main' as the table name
```shell
> ls | into sqlite my_ls.db

```

Convert ls entries into a SQLite database with 'my_table' as the table name
```shell
> ls | into sqlite my_ls.db -t my_table

```

Convert table literal into a SQLite database with 'main' as the table name
```shell
> [[name]; [-----] [someone] [=====] [somename] ['(((((']] | into sqlite filename.db

```

Convert a variety of values in table literal form into a SQLite database
```shell
> [one 2 5.2 six true 100mib 25sec] | into sqlite variety.db

```
