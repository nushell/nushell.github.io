---
title: from ods
categories: |
  formats
version: 0.73.1
formats: |
  Parse OpenDocument Spreadsheet(.ods) data and create table.
usage: |
  Parse OpenDocument Spreadsheet(.ods) data and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div class='command-title'>{{ $frontmatter.formats }}</div>

## Signature

```> from ods --sheets```

## Parameters

 -  `--sheets {list<string>}`: Only convert specified sheets

## Examples

Convert binary .ods data to a table
```shell
> open --raw test.ods | from ods
```

Convert binary .ods data to a table, specifying the tables
```shell
> open --raw test.ods | from ods -s [Spreadsheet1]
```
