---
title: from ods
version: 0.68.0
usage: |
  Parse OpenDocument Spreadsheet(.ods) data and create table.
---

# <code>{{ $frontmatter.title }}</code>

<div style='white-space: pre-wrap;'>{{ $frontmatter.usage }}</div>

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
