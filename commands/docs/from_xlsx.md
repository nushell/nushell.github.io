---
title: from xlsx
categories: |
  formats
version: 0.84.0
formats: |
  Parse binary Excel(.xlsx) data and create table.
usage: |
  Parse binary Excel(.xlsx) data and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from xlsx --sheets```

## Parameters

 -  `--sheets {list<string>}`: Only convert specified sheets


## Input/output types:

| input  | output |
| ------ | ------ |
| binary | table  |

## Examples

Convert binary .xlsx data to a table
```shell
> open --raw test.xlsx | from xlsx

```

Convert binary .xlsx data to a table, specifying the tables
```shell
> open --raw test.xlsx | from xlsx -s [Spreadsheet1]

```
