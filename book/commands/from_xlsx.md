---
title: from xlsx
version: 0.69.1
formats: |
  Parse binary Excel(.xlsx) data and create table.
usage: |
  Parse binary Excel(.xlsx) data and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.formats }}</div>

## Signature

```> from xlsx --sheets```

## Parameters

 -  `--sheets {list<string>}`: Only convert specified sheets

## Examples

Convert binary .xlsx data to a table
```shell
> open --raw test.xlsx | from xlsx
```

Convert binary .xlsx data to a table, specifying the tables
```shell
> open --raw test.xlsx | from xlsx -s [Spreadsheet1]
```
