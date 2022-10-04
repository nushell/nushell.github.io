---
title: from ods
version: 0.69.1
formats: |
  Parse OpenDocument Spreadsheet(.ods) data and create table.
usage: |
  Parse OpenDocument Spreadsheet(.ods) data and create table.
---

# <code>{{ $frontmatter.title }}</code> for formats

<div style='white-space: pre-wrap;margin-top: 10px'>{{ $frontmatter.formats }}</div>

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
